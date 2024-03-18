import { FastifyInstance, FastifyRequest } from "fastify";
import { bucket, textCollection } from './firebase';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import getRawBody from 'raw-body';

async function routes(fastify: FastifyInstance, options: any): Promise<void> {
  fastify.get('/', async (requst, reply) => {
    return { hello: 'hello' }
  });

  fastify.post('/text', async (request, reply) => {
    const { text } = request.body as { text: string };
    try {
      const docRef = await textCollection.add({ text });
      console.log('docRef', docRef.id);
      return reply.status(200).send({id: docRef.id});
    } catch (error) {
      return reply.status(500).send();
    }
  });

  fastify.get('/text/:id', async (request: {[key:string]: any, id: string}, reply) => {
    const { id } = request.params;
    try {
      const docRef = textCollection.doc(id);
      const doc = await docRef.get();
      if (!doc.exists) {
        return reply.status(404).send();
      }
      return reply.status(200).send({ text: doc.data()});
    } catch (error) {
      return reply.status(500).send();
    }
  });

  interface UploadRequest extends FastifyRequest {
    file: any;
  }

  fastify.post('/file', async(request, reply) => {
    const data = await (request as UploadRequest).file() as any;
    const originalFilename = data?.filename as string;
    const fileStream = data?.file;

    const extension = path.extname(originalFilename);
    const basename = path.basename(originalFilename, extension);
    const uniqueFilename = `${basename}-${uuidv4()}${extension}`;
    const metadata = {
      contentType: `image/${(extension === '.png')? 'png' : 'jpeg'}`,
      contentDisposition: 'attachment; filename="uniqueFilename"',
    }
    try {
      const uploadStream = await bucket.file(uniqueFilename).createWriteStream(metadata);
      await new Promise((resolve, reject) => {
        fileStream.pipe(uploadStream)
          .on('finish', resolve)
          .on('error', reject);
        fileStream.on('error', reject);
      });
      return reply.status(200).send({filename: uniqueFilename});
    } catch(error) {
      return reply.code(500).send();
    }
  });

  fastify.get('/file/:filename', async (request: {[key:string]: any}, reply) => {
    const { filename } = request.params;

    try {
      const file = bucket.file(filename);
      const [exists] = await file.exists();
      if(!exists) {
        return reply.code(404).send();
      }

      const [metadata] = await file.getMetadata();

      reply.headers({
        'Content-Type': metadata.contentType || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${metadata.name}"`,
      });

      const buffer = await getRawBody(file.createReadStream());
      reply.send(buffer);
    } catch (error) {
      console.error('error getting file from firebase', error);
      return reply.code(500).send();
    }
  })
}

export default routes;