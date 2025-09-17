import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	client: {},
	server: {
		// Google OAuth
		GOOGLE_CLIENT_ID: z.string().optional(),
		GOOGLE_CLIENT_SECRET: z.string().optional(),

		// Apple OAuth
		APPLE_CLIENT_ID: z.string().optional(),
		APPLE_CLIENT_SECRET: z.string().optional(),
		APPLE_APP_BUNDLE_IDENTIFIER: z.string().optional(),

		// Facebook OAuth
		FACEBOOK_CLIENT_ID: z.string().optional(),
		FACEBOOK_CLIENT_SECRET: z.string().optional(),

		CLOUDFLARE_ACCOUNT_ID: z.string(),
		AWS_ACCESS_KEY_ID: z.string(),
		AWS_SECRET_ACCESS_KEY: z.string(),
		AWS_BUCKET_NAME: z.string(),
		AWS_PUBLIC_BUCKET_NAME: z.string(),

		DATABASE_URL: z
			.url()
			.default(
				"postgresql://postgres:docker@localhost:5432/nest-clean?schema=public",
			),

		PORT: z.coerce.number().default(3333),
		DRAGONFLY_URL: z.string().optional().default("redis://127.0.0.1:6379"),
	},
	shared: {
		API_URL: z.url().default("http://localhost:3333/"),
		NODE_ENV: z
			.enum(["development", "production", "test"])
			.default("development"),
	},
	runtimeEnv: {
		NODE_ENV: process.env.NODE_ENV,

		GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
		GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

		APPLE_CLIENT_ID: process.env.APPLE_CLIENT_ID,
		APPLE_CLIENT_SECRET: process.env.APPLE_CLIENT_SECRET,
		APPLE_APP_BUNDLE_IDENTIFIER: process.env.APPLE_APP_BUNDLE_IDENTIFIER,

		FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
		FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,

		DATABASE_URL: process.env.DATABASE_URL,
		API_URL: process.env.API_URL,

		PORT: process.env.PORT,

		DRAGONFLY_URL: process.env.DRAGONFLY_URL,

		CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
		AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
		AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
		AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
		AWS_PUBLIC_BUCKET_NAME: process.env.AWS_PUBLIC_BUCKET_NAME,
	},
});
