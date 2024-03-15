import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
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

server.register(cors, { origin: ['http://localhost:3002', 'https://nathanielbrewer.github.io'] });
server.register(routes);

server.listen({port: Number(process.env.PORT) ?? 3000, host: '0.0.0.0'}, (error: Error | null, address: string | number) => {
  if (error) {
    server.log.error(error);
  }
  server.log.info(`Server listening on ${address}`);
});
