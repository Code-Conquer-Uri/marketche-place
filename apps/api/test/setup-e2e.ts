import "dotenv/config";

import { execSync } from "node:child_process";

import { PrismaClient } from "@prisma/client";
import { env } from "@repo/env";
import Redis from "ioredis";
import { ulid } from "ulid";

const prisma = new PrismaClient();
const redis = new Redis(env.DRAGONFLY_URL);

function generateUniqueDatabaseURL(schemaId: string): string {
  const url = new URL(
    "postgresql://postgres:docker@localhost:5432/nest-clean-pg?schema=public",
  );

  url.searchParams.set("schema", schemaId);

  return url.toString();
}

const schemaId = ulid();

beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseURL(schemaId);

  process.env.DATABASE_URL = databaseURL;

  // Validate that DATABASE_URL points to localhost or 127.0.0.1
  const databaseUrl = new URL(process.env.DATABASE_URL);

  if (
    databaseUrl.hostname !== "localhost" &&
    databaseUrl.hostname !== "127.0.0.1"
  ) {
    throw new Error(
      "DATABASE_URL must point to localhost or 127.0.0.1 for tests",
    );
  }

  execSync("pnpm prisma migrate deploy");
});

afterAll(async () => {
  const databaseUrl = new URL(process.env.DATABASE_URL || "");

  if (
    databaseUrl.hostname !== "localhost" &&
    databaseUrl.hostname !== "127.0.0.1"
  ) {
    throw new Error(
      "DATABASE_URL must point to localhost or 127.0.0.1 for tests",
    );
  }

  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);

  await redis.flushdb();

  await prisma.$disconnect();
});
