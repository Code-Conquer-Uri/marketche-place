import { OrganizationSwitcher, UserButton } from "@daveyplate/better-auth-ui";
import Link from "next/link";
import { Suspense } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import SmallLogo from "@/components/small-logo";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default async function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className="min-h-dvh w-full">
          <header className="fixed top-0 left-0 right-0 h-20 shadow-sm border-b bg-background z-20">
            <div className="mx-auto max-w-7xl px-5 xl:px-0 flex items-center gap-4 justify-between h-full">
              <div className="flex items-center gap-2">
                <SidebarTrigger />
                <Link
                  href="/"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <SmallLogo color="var(--primary)" />
                  <span className="hidden md:inline text-sm font-medium">
                    Home
                  </span>
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden md:block text-sm text-muted-foreground pr-4" />
                <ThemeToggle />
                <Suspense>
                  <OrganizationSwitcher
                    className="h-10 bg-transparent text-foreground font-medium hover:bg-muted/50 w-20 md:w-36 lg:w-52 cursor-pointer"
                    size="sm"
                  />
                </Suspense>
                <Suspense>
                  <UserButton className="h-10 bg-transparent text-foreground font-medium hover:bg-muted/50 w-20 md:w-36 lg:w-52 cursor-pointer" />
                </Suspense>
              </div>
            </div>
          </header>
          <div className="pt-20">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
