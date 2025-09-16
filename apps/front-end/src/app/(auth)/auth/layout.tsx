import { Building2, Shield, Users, Zap } from "lucide-react";
import { Suspense } from "react";
import { Auth } from "@/components/shared/auth";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default async function AuthLayout({ children }: LayoutProps<"/auth">) {
  return (
    <>
      <Suspense>
        <Auth allow="Unauthenticated-Only" redirectTo="/dashboard" />
      </Suspense>
      <main className="min-h-dvh w-full bg-background">
        <section className="flex h-full w-full grid-cols-5 md:grid">
          <div className="col-span-3 hidden h-full min-h-dvh w-full flex-col justify-between bg-muted/30 md:flex">
            <div className="p-8">
              <Badge variant="outline" className="mb-4">
                <Building2 className="mr-2 h-3 w-3" />
                Multi-Tenant Platform
              </Badge>
            </div>

            <div className="flex flex-1 items-center justify-center px-8 py-12">
              <div className="max-w-lg text-left space-y-6">
                <h1 className="text-5xl font-bold tracking-tight text-foreground">
                  Plataforma
                  <span className="block text-primary">Multi-Tenant</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Gerencie múltiplas organizações com isolamento completo de
                  dados e personalização por tenant
                </p>

                <div className="grid gap-4 mt-8">
                  <Card className="border-muted">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-md">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">
                          Isolamento de Dados
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Cada tenant possui seus próprios dados
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-muted">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-md">
                        <Shield className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">
                          Segurança Avançada
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Autenticação e autorização robustas
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-muted">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-md">
                        <Zap className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">
                          Escalabilidade
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Cresce conforme sua necessidade
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            <div className="p-8">
              <p className="text-sm text-muted-foreground">
                Powered by Next.js, shadcn/ui & Tailwind CSS
              </p>
            </div>
          </div>

          <div className="col-span-2 bg-background">{children}</div>
        </section>
      </main>
    </>
  );
}
