"use server";

import {
  getOrganizationBySlugControllerHandle,
  SearchOrganizationsControllerHandleQueryParams,
  searchOrganizationsControllerHandle,
} from "@/http";

export async function getOrganizationBySlugAction(slug: string) {
  return getOrganizationBySlugControllerHandle(slug);
}

export async function searchOrganizationsAction(
  params: SearchOrganizationsControllerHandleQueryParams,
) {
  return searchOrganizationsControllerHandle(params);
}
