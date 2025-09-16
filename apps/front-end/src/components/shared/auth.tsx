import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { isUserAuthenticated } from "@/lib/get-token";

export async function Auth({
  children,
  allow,
  redirectTo,
}: {
  children?: ReactNode | Array<ReactNode>;
  redirectTo: Parameters<typeof redirect>[0];
  allow: "Authenticated-Only" | "Unauthenticated-Only" | "Both";
}) {
  if (allow === "Both") {
    return children;
  }

  const isAuthenticated = await isUserAuthenticated();

  if (allow === "Authenticated-Only") {
    if (!isAuthenticated) {
      redirect(redirectTo);
    }
  }

  if (allow === "Unauthenticated-Only") {
    if (isAuthenticated) {
      redirect(redirectTo);
    }
  }

  return children;
}
