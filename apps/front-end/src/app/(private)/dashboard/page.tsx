import { Camera, Package, Plus, Search, Users } from "lucide-react";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CameraIcon, CameraPlusIcon } from "@phosphor-icons/react/dist/ssr";

export default async function DashboardPage() {
  return (
    <Container className="min-h-dvh py-0 lg:py-0 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-10 pt-3 lg:pt-6">
        <div className="flex flex-col gap-2.5 lg:gap-5">
          {/* Foto capa */}
          <div className="w-full border-2 border-dashed border-foreground h-[8.5rem] lg:h-64 rounded-md flex items-center justify-center cursor-pointer bg-muted/20 hover:bg-muted/80 transition">
            <div className="flex flex-col items-center m-auto gap-1 px-5 py-2 text-center">
              <CameraIcon size={48} />
              <p className="text-muted-foreground text-sm">
                Clique aqui para fazer o upload de uma foto para a capa
              </p>
            </div>
          </div>

          {/* Foto capa */}
          <div className="flex flex-col gap-4 lg:flex-row">
              <div className="w-20 lg:w-[6.5rem] border-2 border-dashed border-foreground h-20 lg:h-[6.5rem] rounded-md flex items-center justify-center cursor-pointer bg-muted/20 hover:bg-muted/80 transition">
                <div className="flex flex-col items-center m-auto gap-1">
                  <CameraIcon size={36} />
                  <p className="text-muted-foreground text-sm">
                    Sua Logo
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <h1 className="text-foreground text-3xl font-semibold">
                    New Era - ERE
                  </h1>
                  <p className="text-muted-foreground">Pequena descrição aqui sobre a organização</p>
                </div>
                <div className="flex flex-row gap-3 text-muted-foreground font-bold">
                  <span>0 Funcionários</span>
                  <span>0 Produtos</span>
                </div>
              </div>
          </div>
        </div>

        <div className="w-full flex flex-col gap-0">
          <div className="flex w-full flex-col gap-3 lg:flex-row lg:justify-between lg:items-center border-x border-t rounded-t-md p-5">
            <Input 
              placeholder="Buscar..."
              className="max-w-sm"
            />
            <Button>
              Adicionar novo produto +
            </Button>
          </div>
          <div className="w-full flex justify-center items-center border-x border-b rounded-b-md p-5 h-full">
            <div className="flex flex-col gap-1.5 text-center">
              <span className="text-2xl font-semibold text-muted-foreground">Nenhum produto adicionado ainda</span>
              <p className="text-muted-foreground">Adicione produtos cliando no botão “Adicionar novo produto + “</p>
            </div>
          </div>
        </div>
      </div>

      
      
    </Container>
  );
}
