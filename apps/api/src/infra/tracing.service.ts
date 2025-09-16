import * as process from "node:process";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { ExpressInstrumentation } from "@opentelemetry/instrumentation-express";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { NestInstrumentation } from "@opentelemetry/instrumentation-nestjs-core";
import {
  type DetectedResourceAttributes,
  type Resource,
  resourceFromAttributes,
} from "@opentelemetry/resources";
import { NodeSDK } from "@opentelemetry/sdk-node";
import {
  BatchSpanProcessor,
  SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace-base";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { PrismaInstrumentation } from "@prisma/instrumentation";

const attributes: DetectedResourceAttributes = {
  ATTR_SERVICE_NAME: "MarkeTchêplace API",
  [SemanticResourceAttributes.SERVICE_NAME]: "MarkeTchêplace API",
};

const jaegerExporter = new OTLPTraceExporter({
  url: "http://localhost:4318/v1/traces",
});

const oltpExporter = new OTLPTraceExporter({
  url: `https://api.honeycomb.io/v1/traces`,
  headers: {
    "x-honeycomb-team": process.env.HONEYCOMB_API_KEY || "",
  },
});

const treacerChosen =
  process.env.TRACER === `development` || !process.env.TRACER;

const traceExporter = treacerChosen ? jaegerExporter : oltpExporter;
console.log(`Using trace exporter: ${treacerChosen ? `Jaeger` : `Honeycomb`}`);

const spanProcessor = treacerChosen
  ? new SimpleSpanProcessor(traceExporter)
  : new BatchSpanProcessor(traceExporter);

const resource: Resource = resourceFromAttributes(attributes);

export const otelSDK = new NodeSDK({
  resource,
  spanProcessor,
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
    new NestInstrumentation(),
    new PrismaInstrumentation(),
  ],
});
