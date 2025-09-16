import { compare, hash } from "bcryptjs";

import type { HashComparer } from "@/domain/master/application/cryptography/hash-comparer";
import type { HashGenerator } from "@/domain/master/application/cryptography/hash-generator";

export class BcryptHasher implements HashGenerator, HashComparer {
  private HASH_SALT_LENGTH = 8;

  hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH);
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash);
  }
}
