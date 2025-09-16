import { BarChart3, Building2, Search, Shield, Users } from "lucide-react";
import { Suspense } from "react";
import { SearchUsers } from "@/components/pages/dashboard/search-user";
import { SearchUserInput } from "@/components/pages/dashboard/search-user/search-user.input";
import { LogOutButton } from "@/components/shared/logout.button";
import { Permission } from "@/components/shared/permission";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Props = {
  searchParams: Promise<{ searchTerm?: string }>;
};

export default async function DashboardPage({ searchParams }: Props) {
  return (
    <div className="min-h-dvh bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Dashboard Multi-Tenant
                </h1>
                <p className="text-sm text-muted-foreground">
                  Gerencie sua organização e usuários
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="hidden sm:flex">
                <Shield className="mr-1 h-3 w-3" />
                Admin
              </Badge>
              <LogOutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats Cards */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total de Usuários
                  </CardTitle>
                  <Users className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    1,284
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +12% em relação ao mês passado
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Tenants Ativos
                  </CardTitle>
                  <Building2 className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">127</div>
                  <p className="text-xs text-muted-foreground">
                    +5% em relação ao mês passado
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Uptime do Sistema
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    99.9%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Últimos 30 dias
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* User Search Section */}

          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Search className="h-5 w-5 text-primary" />
                  <CardTitle className="text-foreground">
                    Buscar Usuários
                  </CardTitle>
                </div>
                <CardDescription className="text-muted-foreground">
                  Encontre e gerencie usuários em todos os tenants da plataforma
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Suspense>
                  <Permission
                    resource="user"
                    action="list"
                    fallback={<div>Sem permissão</div>}
                  >
                    <SearchUserInput />

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-foreground">
                        Resultados da Busca
                      </h3>
                      <Suspense fallback={<div>Loading ...</div>}>
                        <SearchUsers searchParams={searchParams} />
                      </Suspense>
                    </div>
                  </Permission>
                </Suspense>
              </CardContent>
            </Card>
          </div>

          {/* System Status */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">
                  Status do Sistema
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Monitoramento em tempo real
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      API Gateway
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                    >
                      Online
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Database
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                    >
                      Online
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Cache Redis
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                    >
                      Online
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      File Storage
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                    >
                      Degraded
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
