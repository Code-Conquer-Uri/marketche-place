import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  const redirectUrl = request.nextUrl.clone();

  redirectUrl.pathname = "/auth/login";

  redirectUrl.searchParams.forEach((_value, key) => {
    redirectUrl.searchParams.delete(key);
  });
  (await cookies()).delete("auth_token");
  revalidateTag("user");

  return NextResponse.redirect(redirectUrl);
}
