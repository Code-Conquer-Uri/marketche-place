/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prisma } from "@prisma/client";

/**
 * Parameters for search operations
 */
interface SearchParams {
  search?: string;
  page?: number;
  perPage?: number;
  orderBy?: string;
  order?: "asc" | "desc";
  minSimilarity?: number;
}

/**
 * Result structure for paginated search operations
 */
interface SearchResult<T> {
  data: T[];
  total: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
}

/**
 * Configuration for model search indexes
 */
interface ModelSearchConfig {
  indexName: string;
  searchFields: string[];
  keyField: string;
  sortableFields: string[];
}

const MODEL_SEARCH_CONFIG: Record<string, ModelSearchConfig> = {
  user: {
    indexName: "user_search_idx",
    searchFields: ["name", "name_ngram", "email", "email_regex"],
    keyField: "id",
    sortableFields: ["id", "name", "email", "createdAt", "updatedAt"],
  },
  organization: {
    indexName: "organization_search_index",
    searchFields: ["id", "name", "name_ngram", "slug"],
    keyField: "id",
    sortableFields: ["id", "name", "slug", "createdAt", "updatedAt"],
  },
  product: {
    indexName: "product_search_index",
    searchFields: [
      "id",
      "title",
      "title_ngram",
      "description",
      "description_icu",
    ],
    keyField: "id",
    sortableFields: ["id", "title", "description", "price", "createdAt", "updatedAt"],
  },
} as const;

/**
 * Builds an ORDER BY clause for SQL queries
 */
function buildOrderBy(
  orderBy?: string,
  order: "asc" | "desc" = "desc",
): string {
  if (!orderBy) return '"createdAt" DESC';

  const direction = order.toUpperCase();
  return `"${orderBy}" ${direction}`;
}

interface CountResult {
  total: bigint;
}

type ModelType<T> = T extends {
  findMany: (args?: unknown) => Promise<infer U>;
}
  ? U extends (infer V)[]
    ? V
    : never
  : never;

/**
 * Prisma extension that adds pg_search functionality to all models
 *
 * @example
 * ```typescript
 * const prisma = new PrismaClient().$extends(pgSearchExtension)
 *
 * const results = await prisma.user.searchPaginated({
 *   search: 'john doe',
 *   page: 1,
 *   perPage: 10,
 *   orderBy: 'name',
 *   order: 'asc'
 * })
 * ```
 */
export const pgSearchExtension = Prisma.defineExtension((client) => {
  return client.$extends({
    name: "pg-search-extension",
    model: {
      $allModels: {
        /**
         * Performs paginated search using pg_search BM25 indexing
         * Falls back to regular Prisma queries if pg_search is unavailable
         *
         * @param params - Search and pagination parameters
         * @returns Promise resolving to paginated search results
         */
        async searchPaginated<T, TModel = ModelType<T>>(
          this: T,
          params: SearchParams = {},
          // biome-ignore lint/suspicious/noExplicitAny: Generic Prisma model type
          where?: Record<string, any>,
        ): Promise<SearchResult<TModel>> {
          const context = Prisma.getExtensionContext(this);
          const modelName = context.$name?.toLowerCase();

          console.log(where)

          if (!modelName) {
            throw new Error("Could not determine model name");
          }

          const {
            search,
            page = 1,
            perPage = 10,
            orderBy,
            order = "desc",
            minSimilarity,
          } = params;

          const config = MODEL_SEARCH_CONFIG[modelName];

          if (!config && search) {
            throw new Error(
              `Search index not configured for model: ${modelName}`,
            );
          }

          if (search?.trim() && config) {
            const cleanedTerm = search.trim();
            const offset = (page - 1) * perPage;

            const countCondition = config.searchFields.map(
              (field) =>
                Prisma.sql`${Prisma.raw(config.keyField)} @@@ paradedb.match(${field}, ${cleanedTerm}, distance => 1)`,
            );

            const searchCondition = Prisma.join(countCondition, " OR ");

            const whereConditions = where
              ? Object.entries(where).map(
                  ([key, value]) => {

                    const processedValue = typeof value === 'object' && value !== null ? JSON.stringify(value) : value;

                    return Prisma.sql`${Prisma.raw(`"${key}"`)} = ${processedValue}`;

                  },
                )
              : [];

            const countWhereClause =
              whereConditions.length > 0
                ? Prisma.sql`${searchCondition} AND ${Prisma.join(whereConditions, " AND ")}`
                : searchCondition;

            const countQuery = Prisma.sql`
              SELECT COUNT(*)::int as total
              FROM "${Prisma.raw(modelName)}"
              WHERE ${countWhereClause}
            `;

            const searchConditions = config.searchFields.map(
              (field) =>
                Prisma.sql`${Prisma.raw(config.keyField)} @@@ paradedb.match(${field}, ${cleanedTerm}, distance => 1)`,
            );

            const conditions = [Prisma.join(searchConditions, " OR ")];

            if (minSimilarity && minSimilarity > 0) {
              const scoreCondition = Prisma.sql`paradedb.score(${Prisma.raw(config.keyField)}) >= ${minSimilarity}`;
              conditions.push(scoreCondition);
            }

            if (whereConditions.length > 0) {
              conditions.push(...whereConditions);
            }

            const whereClause = Prisma.join(conditions, " AND ");

            const mainQuery = Prisma.sql`
              SELECT *
              FROM "${Prisma.raw(modelName)}"
              WHERE ${whereClause}
              ORDER BY ${Prisma.raw(buildOrderBy(orderBy, order))}, paradedb.score(${Prisma.raw(config.keyField)}) DESC
              LIMIT ${perPage}
              OFFSET ${offset}
            `;

            const [countResult, dataResult] = await Promise.all([
              client.$queryRaw<CountResult[]>(countQuery),
              client.$queryRaw<(TModel & { search_score: number | null })[]>(
                mainQuery,
              ),
            ]);

            const total = Number(countResult[0]?.total) ?? 0;
            const totalPages = Math.ceil(total / perPage);

            const cleanedData: TModel[] = dataResult.map((row) => {
              const { search_score: _, ...cleanRow } = row;
              return cleanRow as TModel;
            });

            return {
              data: cleanedData,
              total,
              totalPages,
              currentPage: page,
              perPage,
            };
          }

            const whereConditions = where

              ? Object.entries(where).map(

                  ([key, value]) => {

                    const processedValue = typeof value === 'object' && value !== null ? JSON.stringify(value) : value;

                    return Prisma.sql`${Prisma.raw(`"${key}"`)} = ${processedValue}`;

                  },

                )

              : [];          const skip = (page - 1) * perPage;

          const countWhereClause = whereConditions.length > 0

            ? Prisma.sql`WHERE ${Prisma.join(whereConditions, " AND ")}`

            : Prisma.sql``;

          const countQuery = Prisma.sql`

            SELECT COUNT(*)::int as total

            FROM "${Prisma.raw(modelName)}"

            ${countWhereClause}

          `;

          const dataWhereClause = whereConditions.length > 0

            ? Prisma.sql`WHERE ${Prisma.join(whereConditions, " AND ")}`

            : Prisma.sql``;

          const dataQuery = Prisma.sql`

            SELECT *

            FROM "${Prisma.raw(modelName)}"

            ${dataWhereClause}

            ORDER BY ${Prisma.raw(buildOrderBy(orderBy, order))}

            LIMIT ${perPage}

            OFFSET ${skip}

          `;

          const [data, countResult] = await client.$transaction([
            client.$queryRaw<TModel[]>(dataQuery),
            client.$queryRaw<CountResult[]>(countQuery),
          ]);

          const total = Number(countResult[0]?.total) ?? 0;
          const totalPages = Math.ceil(total / perPage);

          return {
            data,
            total,
            totalPages,
            currentPage: page,
            perPage,
          };
        },
      },
    },
  });
});

/**
 * Type for the extended Prisma client with pg_search functionality
 */
export type ExtendedPrismaClient = ReturnType<typeof pgSearchExtension>;
