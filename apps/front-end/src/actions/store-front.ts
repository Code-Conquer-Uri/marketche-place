"use server";

import {
  type CreateStoreFrontBodyDto,
  createStoreFrontControllerHandle,
  type GetStoreFrontControllerHandleQueryParams,
  getStoreFrontControllerHandle,
  type UpdateStoreFrontBodyDto,
  updateStoreFrontControllerHandle,
} from "@/http";

/**
 *
 *
 * @public
 * @summary Get a store front
 */
export async function getStoreFrontAction(
  params: GetStoreFrontControllerHandleQueryParams,
) {
  return getStoreFrontControllerHandle(params);
}

/**
 * @private
 * @summary Create a store front
 */
export async function createStoreFrontAction(data: CreateStoreFrontBodyDto) {
  const promise = createStoreFrontControllerHandle(data);

  return promise;
}

/**
 *
 * @private
 * @returns
 */
export async function updateStoreFrontAction(data: UpdateStoreFrontBodyDto) {
  return updateStoreFrontControllerHandle(data);
}
