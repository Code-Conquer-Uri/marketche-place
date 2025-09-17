import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface CouponProps {
  discountPercentage: number;

  maxQuantity: number;
  currentQuantity: number;

  productId: UniqueEntityID;

  userId: UniqueEntityID;

  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export class Coupon extends Entity<CouponProps> {
  get productId(): CouponProps["productId"] {
    return this.props.productId;
  }

  get userId(): CouponProps["userId"] {
    return this.props.userId;
  }

  get discountPercentage(): CouponProps["discountPercentage"] {
    return this.props.discountPercentage;
  }

  get maxQuantity(): CouponProps["maxQuantity"] {
    return this.props.maxQuantity;
  }

  get currentQuantity(): CouponProps["currentQuantity"] {
    return this.props.currentQuantity;
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

  set maxQuantity(maxQuantity: CouponProps["maxQuantity"]) {
    this.props.maxQuantity = maxQuantity;

    this.updateTimestamp();
  }

  set currentQuantity(currentQuantity: CouponProps["currentQuantity"]) {
    this.props.currentQuantity = currentQuantity;

    this.updateTimestamp();
  }

  private updateTimestamp() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<CouponProps, "createdAt" | "updatedAt">,
    id?: UniqueEntityID,
  ): Coupon {
    const coupon = new Coupon(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );

    return coupon;
  }
}
