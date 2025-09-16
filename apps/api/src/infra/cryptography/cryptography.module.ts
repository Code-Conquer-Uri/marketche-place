import { Module } from "@nestjs/common";

import { HashComparer } from "@/domain/master/application/cryptography/hash-comparer";
import { HashGenerator } from "@/domain/master/application/cryptography/hash-generator";

import { BcryptHasher } from "./bcrypt-hasher";

@Module({
  providers: [
    { provide: HashComparer, useClass: BcryptHasher },
    { provide: HashGenerator, useClass: BcryptHasher },
  ],
  exports: [HashComparer, HashGenerator],
})
export class CryptographyModule {}
