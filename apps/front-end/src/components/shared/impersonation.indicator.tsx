"use client";

import { AlertTriangle, Shield, UserX } from "lucide-react";
import { type FC, memo, use, useCallback, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { authClient } from "@/lib/auth-client";

export const ImpersonationIndicator: FC<{
  isImperonatingPromise: Promise<boolean>;
}> = memo(({ isImperonatingPromise }) => {
  const isImperonating = use(isImperonatingPromise);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleStopImpersonate = useCallback(async () => {
    setIsSubmitting(true);
    const toastId = toast.loading("Encerrando impersonação…");

    const { error } = await authClient.admin.stopImpersonating();

    setIsSubmitting(false);
    toast.dismiss(toastId);

    if (error) {
      toast.error("Não foi possível encerrar a impersonação", {
        description: error.message || "Erro desconhecido",
      });
      return;
    }

    toast.success("Impersonação encerrada com sucesso");
    window.location.reload();
  }, []);

  if (!isImperonating) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <Card className="border-destructive/50 bg-destructive/10 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-destructive/20 rounded-lg">
                <Shield className="h-4 w-4 text-destructive" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <Badge variant="destructive" className="text-xs">
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    MODO ADMIN
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Você está impersonando um usuário
                </p>
              </div>
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleStopImpersonate}
                    disabled={isSubmitting}
                    variant="destructive"
                    size="sm"
                    className="ml-3"
                  >
                    <UserX className="mr-2 h-4 w-4" />
                    {isSubmitting ? "Encerrando..." : "Encerrar"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Clique para voltar à sua conta original</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

ImpersonationIndicator.displayName = "ImpersonationIndicator";
