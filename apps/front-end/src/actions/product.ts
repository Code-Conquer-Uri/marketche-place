"use server";

import {
  type CreateProductBodyDto,
  createProductControllerHandle,
  deleteProductControllerHandle,
  type GetProductsByOrganizationControllerHandleQueryParams,
  type GetPublicProductsControllerHandleQueryParams,
  getProductControllerHandle,
  getProductsByOrganizationControllerHandle,
  getPublicProductsControllerHandle,
  type SearchProductControllerHandleQueryParams,
  searchProductControllerHandle,
  type UpdateProductBodyDto,
  updateProductControllerHandle,
} from "@/http";

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
  console.log(params);
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
