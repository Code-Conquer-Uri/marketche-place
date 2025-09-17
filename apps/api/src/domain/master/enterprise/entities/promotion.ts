import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface PromotionProps {
  discountPercentage: number;
  validUntil: Date;

  productId: UniqueEntityID;

  userId: UniqueEntityID;

  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export class Promotion extends Entity<PromotionProps> {
  get productId(): PromotionProps["productId"] {
    return this.props.productId;
  }

  get userId(): PromotionProps["userId"] {
    return this.props.userId;
  }

  get discountPercentage(): PromotionProps["discountPercentage"] {
    return this.props.discountPercentage;
  }

  get validUntil(): PromotionProps["validUntil"] {
    return this.props.validUntil;
  }

  get createdAt(): Date | null | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | null | undefined {
    return this.props.updatedAt;
  }

  set discountPercentage(discountPercentage: number) {
    this.props.discountPercentage = discountPercentage;
    this.updateTimestamp();
  }

  set validUntil(validUntil: Date) {
    this.props.validUntil = validUntil;

    this.updateTimestamp();
  }

  private updateTimestamp() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<PromotionProps, "createdAt" | "updatedAt">,
    id?: UniqueEntityID,
  ): Promotion {
    const promotion = new Promotion(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );

    return promotion;
  }
}
