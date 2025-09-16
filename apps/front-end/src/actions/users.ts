"use server";

import { searchUserControllerHandle } from "../http/requests";
import type { SearchUserControllerHandleQueryParams } from "../http/types";

export async function searchUserAction(
  params: SearchUserControllerHandleQueryParams,
) {
  return searchUserControllerHandle(params);
}
