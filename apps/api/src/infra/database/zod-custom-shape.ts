import type { z } from "zod";

import type { UniqueEntityID } from "@/core/entities/unique-entity-id";

type ToZodShape<T> = {
  [K in keyof T]: T[K] extends UniqueEntityID
    ? z.ZodString
    : T[K] extends UniqueEntityID | undefined
      ? z.ZodOptional<z.ZodString>
      : T[K] extends Date | null | undefined
        ? z.ZodNullable<z.ZodOptional<z.ZodCoercedString<unknown>>>
        : T[K] extends Date | null
          ? z.ZodNullable<z.ZodCoercedString<unknown>>
          : T[K] extends Date | undefined
            ? z.ZodOptional<z.ZodCoercedString<unknown>>
            : T[K] extends Date
              ? z.ZodString
              : T[K] extends Buffer
                ? z.ZodString
                : z.ZodType<T[K]>;
};

/**
 * Helper utilities to create Zod schemas from Entity types.
 *
 * These types help map entity properties to appropriate Zod validators:
 * - UniqueEntityID fields are mapped to string validators
 * - Date fields are mapped to string validators
 * - Other fields are mapped to their corresponding Zod types
 *
 * @example
 * ```typescript
 * import { z } from 'zod';
 * import { ZodCustomShape } from './zod-helper';
 *
 * class UserProps {
 *   name: string;
 *   createdAt: Date;
 * }
 *
 * // Create a Zod schema for the UserEntity
 * const userSchema = z.object<ZodCustomShape<UserProps>>({
 *   id: z.string(),
 *   name: z.string(),
 *   createdAt: z.string(),
 * };
 * ```
 */
export type ZodCustomShape<T> = ToZodShape<T & { id: UniqueEntityID }>;
