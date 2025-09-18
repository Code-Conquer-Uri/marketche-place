"use server";

import { getOrganizationBySlugControllerHandle } from "@/http";

export async function getOrganizationBySlugAction(slug: string) {
  return getOrganizationBySlugControllerHandle(slug);
}
