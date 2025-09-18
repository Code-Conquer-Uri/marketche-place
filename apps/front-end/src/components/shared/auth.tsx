import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { authClient } from "@/lib/auth-client";

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

  const { data: session } = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (allow === "Authenticated-Only") {
    if (!session) {
      redirect(redirectTo);
    }
  }

  if (allow === "Unauthenticated-Only") {
    if (session) {
      redirect(redirectTo);
    }
  }

  return children;
}
