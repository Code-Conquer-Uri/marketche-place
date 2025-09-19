import { OrganizationSwitcher, UserButton } from "@daveyplate/better-auth-ui";
import Link from "next/link";
import { Suspense } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Auth } from "@/components/shared/auth";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import SmallLogo from "@/components/small-logo";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default async function AuthLayout({
  children,
}: LayoutProps<"/dashboard">) {
  return (
    <SidebarProvider defaultOpen={false}>
      <Suspense>
        <Auth allow="Authenticated-Only" redirectTo="/auth" />
      </Suspense>
      <AppSidebar />
      <main className="min-h-dvh w-full">
        <header className="fixed top-0 left-0 right-0 h-20 shadow-sm border-b bg-background z-20">
          <div className="mx-auto max-w-7xl px-5 xl:px-0 flex items-center gap-4 justify-between h-full">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <Link href="/dashboard" className="flex items-center gap-2">
                <SmallLogo color="var(--primary)" />
                <span className="text-sm font-medium hidden md:inline">
                  Dashboard
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden md:block text-sm text-muted-foreground pr-4">
                {/* Placeholder for breadcrumbs / page title injection */}
              </div>
              <ThemeToggle />
              <Suspense>
                <OrganizationSwitcher
                  className="h-10 bg-transparent text-foreground font-medium hover:bg-muted/50 w-32 md:w-44 lg:w-52 cursor-pointer"
                  size="sm"
                />
              </Suspense>
              <Suspense>
                <UserButton className="h-10 bg-transparent text-foreground font-medium hover:bg-muted/50 w-20 md:w-32 lg:w-52 cursor-pointer" />
              </Suspense>
            </div>
          </div>
        </header>
        <div className="pt-20">{children}</div>
      </main>
    </SidebarProvider>
  );
}
