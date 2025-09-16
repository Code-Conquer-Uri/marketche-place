import {
  BarChart3,
  Building2,
  CheckCircle,
  Database,
  Globe,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-7xl px-4 flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <span className="font-semibold text-lg text-foreground">
              Multi-Tenant Platform
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Funcionalidades
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Preços
            </Link>
            <Link
              href="#contact"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Contato
            </Link>
            <Link href="/auth/sign-in">
              <Button variant="outline" size="sm">
                Entrar
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="mb-4">
                  <Building2 className="mr-2 h-3 w-3" />
                  Plataforma Multi-Tenant
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-foreground">
                  Plataforma
                  <span className="block text-primary">Multi-Tenant</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Gerencie múltiplas organizações com isolamento completo de
                  dados, personalização por tenant e escalabilidade enterprise.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-sm text-foreground">
                    Isolamento completo de dados por tenant
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-sm text-foreground">
                    Personalização e branding por organização
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-sm text-foreground">
                    Escalabilidade automática e segurança avançada
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/sign-up">
                  <Button size="lg" className="w-full sm:w-auto">
                    Criar Organização
                  </Button>
                </Link>
                <Button variant="outline" size="lg">
                  Agendar Demo
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-3xl transform rotate-3"></div>
              <Card className="relative shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Dashboard Multi-Tenant
                    </CardTitle>
                    <Badge variant="secondary">Ao vivo</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="p-4 bg-primary/5 border-primary/20">
                      <div className="flex items-center space-x-2">
                        <Building2 className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">
                          Tenants
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-primary mt-1">
                        127
                      </p>
                    </Card>
                    <Card className="p-4 bg-muted border-border">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">
                          Usuários
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-foreground mt-1">
                        8.2k
                      </p>
                    </Card>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Uptime do sistema
                      </span>
                      <span className="text-primary">99.9%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: "99.9%" }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary">Funcionalidades</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Tudo que sua plataforma multi-tenant precisa
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Uma arquitetura robusta com todas as ferramentas necessárias para
              gerenciar múltiplas organizações de forma segura e escalável.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Isolamento de Dados</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Cada tenant possui seus próprios dados completamente isolados,
                  garantindo privacidade e segurança total.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Segurança Avançada</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Autenticação robusta, autorização baseada em roles e
                  criptografia de dados em trânsito e em repouso.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Zap className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Escalabilidade</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Infraestrutura que cresce automaticamente conforme sua base de
                  tenants e usuários se expande.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <BarChart3 className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Analytics por Tenant</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Dashboards e relatórios isolados por organização com métricas
                  específicas para cada tenant.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Globe className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Personalização</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Cada tenant pode personalizar temas, logos, domínios e
                  configurações específicas da organização.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Database className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Backup & Recovery</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Backup automático por tenant com recuperação granular e
                  versionamento de dados.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-12">
              <div className="space-y-6">
                <Badge variant="secondary">Comece Hoje</Badge>
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                  Pronto para criar sua plataforma multi-tenant?
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Junte-se a centenas de empresas que já construíram suas
                  plataformas SaaS com nossa arquitetura multi-tenant robusta.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
                  <Input
                    placeholder="Seu melhor email"
                    className="bg-background border-input"
                  />
                  <Button size="lg" className="whitespace-nowrap">
                    Começar Grátis
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground">
                  Sem cartão de crédito • Setup em minutos • Suporte 24/7
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-12 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <span className="font-semibold text-foreground">
                  Multi-Tenant Platform
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Plataforma robusta para construir aplicações SaaS multi-tenant
                com isolamento completo de dados.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Produto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Funcionalidades
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Documentação
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    API Reference
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Suporte</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Central de Ajuda
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Contato
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Status
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Privacidade
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Termos de Uso
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Política de Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <Separator className="my-8" />

          <div className="text-center text-sm text-muted-foreground">
            <p>
              &copy; 2025 Multi-Tenant Platform. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
