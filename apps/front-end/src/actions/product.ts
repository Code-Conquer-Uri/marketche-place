"use server";

import {
  type CreateProductBodyDto,
  createProductControllerHandle,
  deleteProductControllerHandle,
  type GetProductsByOrganizationControllerHandleQueryParams,
  type GetPublicProductsControllerHandleQueryParams,
  getCouponsByProductIdControllerHandle,
  getProductControllerHandle,
  getProductsByOrganizationControllerHandle,
  getPromotionsByProductIdControllerHandle,
  getPublicProductsControllerHandle,
  getSimilarProductsControllerHandle,
  type SearchProductControllerHandleQueryParams,
  searchProductControllerHandle,
  type UpdateProductBodyDto,
  updateProductControllerHandle,
} from "@/http";
import { createUserCouponControllerHandle } from "@/http/requests/createUserCouponControllerHandle.ts";
import { searchCouponsControllerHandle } from "@/http/requests/searchCouponsControllerHandle.ts";
import { searchUserCouponsControllerHandle } from "@/http/requests/searchUserCouponsControllerHandle.ts";
import type { GetSimilarProductsControllerHandleQueryParams } from "@/http/types/GetSimilarProductsControllerHandle.ts";
import type { SearchCouponsControllerHandleQueryParams } from "@/http/types/SearchCouponsControllerHandle.ts";
import type { SearchUserCouponsControllerHandleQueryParams } from "@/http/types/SearchUserCouponsControllerHandle.ts";

/**
 * @public
 * @summary Get a product by ID
 */
export async function getProductAction(productId: string) {
  return getProductControllerHandle(productId);
}

/**
 * @private
 * @summary Create a product
 */
export async function createProductAction(data: CreateProductBodyDto) {
  return createProductControllerHandle(data);
}

/**
 * @private
 * @summary Update a product
 */
export async function updateProductAction(
  productId: string,
  data: UpdateProductBodyDto,
) {
  return updateProductControllerHandle(productId, data);
}

/**
 * @private
 * @summary Delete a product
 */
export async function deleteProductAction(productId: string) {
  return deleteProductControllerHandle(productId);
}

/**
 * @public
 * @summary Search products
 */
export async function searchProductAction(
  params: SearchProductControllerHandleQueryParams,
) {
  return searchProductControllerHandle(params);
}

/**
 * @public
 * @summary Get products by organization
 */
export async function getProductsByOrganizationAction(
  params: GetProductsByOrganizationControllerHandleQueryParams,
) {
  return getProductsByOrganizationControllerHandle(params);
}

/**
 * @public
 * @summary Get public products from all organizations
 */
export async function getPublicProductsAction(
  params: GetPublicProductsControllerHandleQueryParams,
) {
  return getPublicProductsControllerHandle(params);
}

export async function getCouponsByProductIdAction(productId: string) {
  return getCouponsByProductIdControllerHandle(productId);
}

export async function getPromotionsByProductIdAction(productId: string) {
  return getPromotionsByProductIdControllerHandle(productId);
}

export async function getSimilarProductsAction(
  productId: string,
  params?: GetSimilarProductsControllerHandleQueryParams,
) {
  return getSimilarProductsControllerHandle(productId, params);
}

export async function redeemCouponAction(couponId: string) {
  return createUserCouponControllerHandle({ couponId });
}

export async function searchUserCouponsAction(
  params: SearchUserCouponsControllerHandleQueryParams,
) {
  return searchUserCouponsControllerHandle(params);
}

export async function searchCouponsAction(
  params: SearchCouponsControllerHandleQueryParams,
) {
  return searchCouponsControllerHandle(params);
}
