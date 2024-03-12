import fastify, { FastifyInstance } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http'

const server: FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify(
  {
    logger: {
      name: __filename,
      level: 'info',
    },
  })

const start = async () => {
    await server.listen({port: 3000}, (error: Error | null, address: string | number) => {
      if (error) {
        server.log.error(error);
      }
      server.log.info(`Server listening on ${address}`);
    });
};
start();