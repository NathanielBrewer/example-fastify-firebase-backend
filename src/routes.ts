import { FastifyInstance } from "fastify";
import { textCollection } from './firebase';

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
      console.log(`text/{$id} doc:`, doc);
      return reply.status(200).send({ text: doc.data()});
    } catch (error) {
      return reply.status(500).send();
    }
  });
}

export default routes;