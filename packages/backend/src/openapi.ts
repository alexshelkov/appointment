import { generateOpenApiDocument } from 'trpc-to-openapi';

import { appRouter } from './router';

export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: 'tRPC OpenAPI',
  version: '1.0.0',
  baseUrl: '/api'
});
