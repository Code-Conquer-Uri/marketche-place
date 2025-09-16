/** biome-ignore-all lint/suspicious/noExplicitAny: Needed For Typed Routes */
"use client";

import { AuthUIProvider } from "@daveyplate/better-auth-ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { authClient } from "@/lib/auth-client";

export function ClientProviders({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <AuthUIProvider
      authClient={authClient}
      navigate={router.push as any}
      replace={router.replace as any}
      onSessionChange={() => {
        router.refresh();
      }}
      Link={Link as any}
      account={{
        basePath: "/dashboard/account",
      }}
      organization={{
        basePath: "/dashboard/organization",
        customRoles: [
          {
            label: "Dono da organização",
            role: "organizationOwner",
          },
          {
            label: "Admin da organização",
            role: "organizationAdmin",
          },
          {
            label: "Membro da organização",
            role: "organizationMember",
          },
        ],
      }}
    >
      {children}
    </AuthUIProvider>
  );
}
