import {
  Injectable,
  type OnModuleDestroy,
  type OnModuleInit,
} from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

import { pgSearchExtension } from "./extensions/paginated-search.extension";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  public readonly extendedClient;

  constructor() {
    super({
      log: ["warn", "error"],
    });

    this.extendedClient = this.$extends(pgSearchExtension);
  }

  onModuleInit(): Promise<void> {
    return this.$connect();
  }

  onModuleDestroy(): Promise<void> {
    return this.$disconnect();
  }
}
