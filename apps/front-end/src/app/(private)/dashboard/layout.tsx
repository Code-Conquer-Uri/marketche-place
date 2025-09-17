import { OrganizationSwitcher, UserButton } from "@daveyplate/better-auth-ui";
import { Suspense } from "react";
import { Auth } from "@/components/shared/auth";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import SmallLogo from "@/components/small-logo";

export default async function AuthLayout({
  children,
}: LayoutProps<"/dashboard">) {
  return (
    <>
      <Suspense>
        <Auth allow="Authenticated-Only" redirectTo="/auth" />
      </Suspense>
      <main className="min-h-dvh w-full">
        <header className="w-full h-20 shadow-sm border-b bg-background">
          <div className="mx-auto max-w-7xl px-5 xl:px-0 flex items-center gap-4 justify-between h-full">
            <div>
              <SmallLogo color="var(--primary" />
            </div>
            <div className="flex items-center gap-2">
              <div>
                <ThemeToggle />
              </div>

              <div>
                <Suspense>
                  <OrganizationSwitcher className="h-10 bg-transparent text-foreground font-medium hover:bg-muted/50 w-full lg:w-52 cursor-pointer" />
                </Suspense>
              </div>

              <div>
                <Suspense>
                  <UserButton className="h-10 bg-transparent text-foreground font-medium hover:bg-muted/50 w-full lg:w-52 cursor-pointer" />
                </Suspense>
              </div>
            </div>
          </div>
        </header>
        {children}
      </main>
    </>
  );
}
