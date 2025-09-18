import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { apiReference } from "@scalar/nestjs-api-reference";
import { json, urlencoded } from "express";
import { cleanupOpenApiDoc } from "nestjs-zod";

import { AppModule } from "./app.module";
import { EnvService } from "./env/env.service";
import { otelSDK } from "./tracing.service";

async function bootstrap(): Promise<void> {
  await otelSDK.start();

  const app = await NestFactory.create(AppModule);
  const configService = app.get(EnvService);
  const port = configService.get("PORT");

  // Configure body parser with higher limits
  app.use(json({ limit: "10mb" }));
  app.use(urlencoded({ limit: "10mb", extended: true }));

  const config = new DocumentBuilder()
    .addBearerAuth({ type: "http" })
    .setTitle("MarkeTchêplace")
    .setDescription("MarkeTchêplace API description")
    .setVersion("1.0")
    .build();

  const document = cleanupOpenApiDoc(
    SwaggerModule.createDocument(app, config, {
      deepScanRoutes: true,
    }),
  );

  app.use(
    "/scalar",
    apiReference({
      content: document,
    }),
  );

  SwaggerModule.setup("docs", app, document, {});

  await app.listen(port);
}
bootstrap();
