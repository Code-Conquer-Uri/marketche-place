import { OrganizationSwitcher, UserButton } from "@daveyplate/better-auth-ui";
import { Suspense } from "react";
import { Auth } from "@/components/shared/auth";

export default async function AuthLayout({
  children,
}: LayoutProps<"/dashboard">) {
  return (
    <>
      <Suspense>
        <Auth allow="Authenticated-Only" redirectTo="/auth" />
      </Suspense>
      <main className="min-h-dvh w-full">
        <header className="w-full h-20">
          <div className="mx-auto max-w-7xl px-5 xl:px-0 flex items-center justify-between h-full">
            <div>
              <Suspense>
                <OrganizationSwitcher />
              </Suspense>
            </div>

            <div>
              <Suspense>
                <UserButton />
              </Suspense>
            </div>
          </div>
        </header>
        {children}
      </main>
    </>
  );
}
