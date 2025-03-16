import express from 'express';

import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { createOpenApiExpressMiddleware } from 'trpc-to-openapi';
import swaggerUi from 'swagger-ui-express';

import { appRouter } from './router';
import { openApiDocument } from './openapi';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/api', createOpenApiExpressMiddleware({ router: appRouter }));

app.use('/trpc', createExpressMiddleware({ router: appRouter }));

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
app.use('/', swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
