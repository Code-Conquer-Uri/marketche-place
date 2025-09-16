"use client";

import { ArrowsClockwiseIcon } from "@phosphor-icons/react/dist/ssr";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FC, memo, useCallback, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";

export const LogOutButton: FC = memo(() => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const router = useRouter();

  const handleLogout = useCallback(async () => {
    setIsSubmitting(true);
    const loadingToast = toast.loading("Saindo...");

    const { error } = await authClient.signOut();

    toast.dismiss(loadingToast);

    if (error) {
      return toast.error("Erro ao sair da conta", {
        description: error.message,
      });
    }

    toast.success("Você saiu com sucesso");
    router.push("/");
    setIsSubmitting(false);
  }, [router]);

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      onClick={handleLogout}
      disabled={isSubmitting}
    >
      {!isSubmitting ? (
        <LogOut className="h-4 w-4" />
      ) : (
        <ArrowsClockwiseIcon className="size-5 rotate-180 duration-500" />
      )}
      {!isSubmitting ? "Logout" : "Saindo"}
    </Button>
  );
});

LogOutButton.displayName = "LogOutButton";
