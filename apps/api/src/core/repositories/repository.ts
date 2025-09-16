import { Entity } from "../entities/entity";

// biome-ignore lint/suspicious/noExplicitAny: Generic repository
export abstract class Repository<T extends Entity<any>> {
  abstract create(entity: T): Promise<void>;

  abstract findById(id: string): Promise<T | null>;

  abstract findManyByIds(ids: string[]): Promise<T[]>;

  abstract findAll(): Promise<T[]>;

  abstract save(entity: T): Promise<void>;

  abstract delete(entity: T): Promise<void>;
}
