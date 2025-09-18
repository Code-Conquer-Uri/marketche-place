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
    <SidebarProvider>
      <AppSidebar />
      <Suspense>
        <Auth allow="Authenticated-Only" redirectTo="/auth" />
      </Suspense>
      <main className="min-h-dvh w-full">
        <header className="w-full h-20 shadow-sm border-b bg-background fixed top-0 left-0 right-0 z-20">
          <div className="mx-auto max-w-7xl px-5 xl:px-0 flex items-center gap-4 justify-between h-full">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="" />
              <Link href="/" className="cursor-pointer">
                <SmallLogo color="var(--primary)" />
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <div>
                <ThemeToggle />
              </div>

              <div>
                <Suspense>
                  <OrganizationSwitcher
                    localization={{
                      ORGANIZATION: "Organização",
                      ORGANIZATION_ALREADY_EXISTS:
                        "Você já pertence a essa organização",
                      CREATE_ORGANIZATION: "Criar organização",
                      ORGANIZATION_NAME: "Nome da organização",
                      ORGANIZATION_NAME_PLACEHOLDER:
                        "Digite o nome da organização",
                      ORGANIZATION_SLUG: "Slug da organização",
                      ORGANIZATION_SLUG_PLACEHOLDER:
                        "Digite o slug da organização",
                      ORGANIZATION_NAME_DESCRIPTION:
                        "O nome da sua organização será exibido publicamente.",
                      ORGANIZATION_SLUG_DESCRIPTION:
                        "O slug da sua organização será usado na URL.",
                      CANCEL: "Cancelar",
                      ORGANIZATIONS_DESCRIPTION:
                        "Organizações são grupos de usuários que podem colaborar em projetos juntos.",
                      ORGANIZATION_NAME_INSTRUCTIONS:
                        "Deve ter entre 3 e 50 caracteres.",
                      ORGANIZATIONS_INSTRUCTIONS:
                        "Insira nome e slug (url) para sua nova organização.",
                    }}
                    hidePersonal={true}
                    className="h-10 bg-transparent text-foreground font-medium hover:bg-muted/50 w-20 md:w-36 lg:w-52 cursor-pointer"
                  />
                </Suspense>
              </div>

              <div>
                <Suspense>
                  <UserButton className="h-10 bg-transparent text-foreground font-medium hover:bg-muted/50 w-20 md:w-36 lg:w-52 cursor-pointer" />
                </Suspense>
              </div>
            </div>
          </div>
        </header>
        {children}
      </main>
    </SidebarProvider>
  );
}
