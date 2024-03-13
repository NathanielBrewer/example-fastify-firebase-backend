import fastify, { FastifyInstance } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http'
import * as fbAdmin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

const fbApp: fbAdmin.app.App = fbAdmin.initializeApp({
  credential: fbAdmin.credential.cert(process.env.GOOGLE_APPLICATION_CREDENTIALS as string)
});

const fbFirestore: fbAdmin.firestore.Firestore = fbApp.firestore();

const server: FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify({
  logger: {
    name: __filename,
    level: 'info',
  },
});

server.listen({port: Number(process.env.PORT) ?? 3000}, (error: Error | null, address: string | number) => {
  if (error) {
    server.log.error(error);
  }
  server.log.info(`Server listening on ${address}`);
});
