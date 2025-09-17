import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface UserCouponProps {
  couponId: UniqueEntityID;

  userId: UniqueEntityID;
}

export class UserCoupon extends Entity<UserCouponProps> {
  get couponId(): UserCouponProps["couponId"] {
    return this.props.couponId;
  }

  get userId(): UserCouponProps["userId"] {
    return this.props.userId;
  }

  static create(props: UserCouponProps, id?: UniqueEntityID): UserCoupon {
    const usercoupon = new UserCoupon(
      {
        ...props,
      },
      id,
    );

    return usercoupon;
  }
}
