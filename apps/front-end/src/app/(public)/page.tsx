import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { OurOrganizations } from "@/components/pages/landing-page/our-organizations";
import { SearchProducts } from "@/components/pages/landing-page/search-products";
import { SearchProductsInput } from "@/components/pages/landing-page/search-products/search-products.input";
import Prism from "@/components/prism";
import SmallLogo from "@/components/small-logo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type Props = {
  searchParams: Promise<{
    searchTerm?: string;
    page?: string;
    perPage?: string;
    orderBy?: string;
    orderDirection?: string;
    organizationId?: string;
  }>;
};

export default async function LandingPage({ searchParams }: Props) {
  return (
    <>
      <div className="w-full h-20"></div>
      <div className="min-h-screen bg-background px-5 overflow-hidden">
        {/* Header */}
        <div className="w-full h-[33.5rem] relative bg-black mt-10 2xl:px-0 mx-auto max-w-7xl rounded-xl">
          <Prism
            animationType="rotate"
            timeScale={0.5}
            height={3.5}
            baseWidth={5.5}
            scale={3.6}
            hueShift={0}
            colorFrequency={1}
            noise={0.5}
            glow={1}
          />
          <div className="absolute bottom-0 left-0 right-0 top-[20%] mx-auto w-full max-w-2xl px-5">
            <div className="hidden sm:mb-8 sm:flex sm:justify-center">
              <Link
                href="/"
                className="flex items-center rounded-full px-3 py-1 text-sm leading-6 text-white ring-1 ring-slate-500 hover:ring-slate-300"
              >
                <div className="flex flex-row gap-14">
                  <div className="flex flex-row gap-2.5">
                    <strong className="text-white">+600</strong>
                    <span className="text-slate-300">
                      produtos à pronta entrega
                    </span>
                  </div>
                  <strong className="flex flex-row items-center gap-1.5 text-white">
                    Veja mais
                    <ArrowRight size={16} />
                  </strong>
                </div>
              </Link>
            </div>
            <article className="text-center">
              <h1 className="text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                O melhor em materiais de construção
              </h1>
              <p className="mt-2.5 text-pretty text-slate-300">
                Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui
                lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat.
              </p>
              <div className="mt-14 flex flex-col items-center justify-center gap-2.5 gap-x-6 sm:flex-row">
                <Link href="/" className="w-full sm:w-56 cursor-pointer">
                  <Button
                    variant="outline"
                    className="w-full sm:w-56 cursor-pointer bg-white text-black hover:bg-white/90 border-white hover:text-black"
                  >
                    Compre agora
                  </Button>
                </Link>
              </div>
            </article>
          </div>
        </div>

        <section className="py-20 px-4">
          <div className="container max-w-7xl mx-auto">
            <div className="flex flex-col gap-5 lg:flex-row lg:justify-between lg:items-center mb-5">
              <div className="flex flex-col gap-3">
                <h4 className="text-foreground font-semibold text-2xl">
                  Aqui você só encontra o que tem de melhor
                </h4>
                <p className="text-muted-foreground">
                  Encontre seu produto aqui e acesse
                </p>
              </div>
              <SearchProductsInput />
            </div>
            <div className="space-y-6">
              <Suspense fallback={<div>Loading ...</div>}>
                <SearchProducts searchParams={searchParams} />
              </Suspense>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <OurOrganizations />

        {/* Footer */}
        <footer className="border-t border-border bg-muted/30 py-12 px-4">
          <div className="container max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <SmallLogo
                      color="var(--primary)"
                      className="h-6 w-6 text-primary"
                    />
                  </div>
                  <span className="font-semibold text-foreground">
                    MarkeTchê Place
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  O futuro dos lojistas de Erechim
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Acesse</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link
                      href="/auth/sign-in"
                      className="hover:text-foreground transition-colors"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/auth/sign-up"
                      className="hover:text-foreground transition-colors"
                    >
                      Crie sua conta
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
              <p>&copy; 2025 MarkeTchê Place. Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
