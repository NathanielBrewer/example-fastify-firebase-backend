import { FastifyRequest } from 'fastify';

export interface TextPostBody {
  text: string;
}

export interface TextPostRequest extends FastifyRequest {
  Body: TextPostBody;
}

export interface TextGetParams {
  id: string;
}

export interface FileGetParams {
  filename: string;
}

export interface FilePostRequest extends FastifyRequest {
  file: any;
}

export interface FileRequestFileData {
  filename: string;
  file: NodeJS.ReadableStream;
}