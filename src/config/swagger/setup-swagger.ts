import { type INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  type SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { GlobalConfig } from '../global/global-config';
import { swaggerDescription } from './data';

export function setupSwagger(app: INestApplication): void {
  const documentBuilder = new DocumentBuilder()
    .setVersion(GlobalConfig.APP_VERSION)
    .setTitle(GlobalConfig.APPLICATION_NAME)
    .setDescription(swaggerDescription)
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      description: 'JWT Authorization header using the Bearer scheme',
      bearerFormat: 'JWT',
    })
    .addServer('http://localhost:8000', 'LOCAL')
    .addServer('https://api.kliqpay.in', 'PROD');

  if (process.env.API_VERSION) {
    documentBuilder.setVersion(process.env.API_VERSION);
  }

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (_controllerKey: string, methodKey: string) =>
      `${methodKey}`,
  };

  const document = SwaggerModule.createDocument(
    app,
    documentBuilder.build(),
    options,
  );
  SwaggerModule.setup(GlobalConfig.SWAGGER_PATH, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'KP APIs',
    jsonDocumentUrl: 'docs-json',
    yamlDocumentUrl: 'docs-yaml',
    explorer: true,
    swaggerUiEnabled: true,
  });

  app.use(
    '/reference',
    apiReference({
      content: document,
    }),
  );

  console.info(
    `Documentation: http://localhost:${process.env.PORT}/${GlobalConfig.SWAGGER_PATH}`,
  );
}
