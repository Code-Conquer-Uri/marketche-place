"use server";

import { cookies } from "next/headers";

export async function getToken(): Promise<string | undefined> {
  const cookieStore = await cookies();

  const cookiestoken = cookieStore.get("better-auth.session_token")?.value;

  const token = cookiestoken ? cookiestoken.split(".")[0] : undefined;

  return token;
}

export async function isUserAuthenticated(): Promise<boolean> {
  const token = await getToken();

  return !!token;
}
