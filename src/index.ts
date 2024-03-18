import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import { Server, IncomingMessage, ServerResponse } from 'http'
import * as dotenv from 'dotenv';
import routes from './routes';

dotenv.config();

const server: FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify({
  logger: {
    name: __filename,
    level: 'info',
  },
});

server.register(multipart);
server.register(cors, { 
  origin: ['http://localhost:3001', 'http://localhost:3001/parados-frontend', 'http://127.0.0.1:3001', 'https://nathanielbrewer.github.io'],
  exposedHeaders: ['Content-Type', 'X-Content-Type', 'Content-Disposition'], 
});
server.register(routes);

server.listen({port: Number(process.env.PORT) ?? 3000, host: process.env.HOST ?? '127.0.0.1'}, (error: Error | null, address: string | number) => {
  if (error) {
    server.log.error(error);
  }
  server.log.info(`Server listening on ${address}`);
});
