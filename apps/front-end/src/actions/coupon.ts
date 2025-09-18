"use server";

import {
  type CreateCouponBodyDto,
  createCouponControllerHandle,
  deleteCouponControllerHandle,
  getCouponControllerHandle,
  getCouponsByProductIdControllerHandle,
  type UpdateCouponBodyDto,
  updateCouponControllerHandle,
} from "@/http";

/**
 * @private
 * @summary Create a coupon
 */
export async function createCouponAction(data: CreateCouponBodyDto) {
  return createCouponControllerHandle(data);
}

/**
 * @private
 * @summary Update a coupon
 */
export async function updateCouponAction(
  couponId: string,
  data: UpdateCouponBodyDto,
) {
  return updateCouponControllerHandle(couponId, data);
}

/**
 * @private
 * @summary Delete a coupon
 */
export async function deleteCouponAction(couponId: string) {
  return deleteCouponControllerHandle(couponId);
}

/**
 * @public
 * @summary Get a coupon by ID
 */
export async function getCouponAction(couponId: string) {
  return getCouponControllerHandle(couponId);
}

export async function getCouponsByProductIdAction(productId: string) {
  return getCouponsByProductIdControllerHandle(productId);
}
