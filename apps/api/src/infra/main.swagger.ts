import { writeFileSync } from "node:fs";

import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { cleanupOpenApiDoc } from "nestjs-zod";

import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    // logger: false,
  });

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

  writeFileSync("swagger.json", JSON.stringify(document));
  process.exit();
}
bootstrap();
