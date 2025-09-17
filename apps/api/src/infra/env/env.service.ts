import { Injectable } from "@nestjs/common";
import { ConfigService, PathValue } from "@nestjs/config";
import type { env } from "@repo/env";

type GetEnv<T extends keyof typeof env> = PathValue<
  {
    NODE_ENV: string;
    DATABASE_URL: string;

    PORT: number;
    DRAGONFLY_URL: string;

    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;

    APPLE_CLIENT_ID?: string;
    APPLE_CLIENT_SECRET?: string;
    APPLE_APP_BUNDLE_IDENTIFIER?: string;

    FACEBOOK_CLIENT_ID?: string;
    FACEBOOK_CLIENT_SECRET?: string;

    API_URL: string;

    CLOUDFLARE_ACCOUNT_ID: string
    AWS_ACCESS_KEY_ID: string
    AWS_SECRET_ACCESS_KEY: string
    AWS_BUCKET_NAME: string
    AWS_PUBLIC_BUCKET_NAME: string
  },
  T
>;

@Injectable()
export class EnvService {
  constructor(private configService: ConfigService<typeof env, true>) {}

  get<T extends keyof typeof env>(key: T): GetEnv<T> {
    return this.configService.get(key, { infer: true });
  }
}
