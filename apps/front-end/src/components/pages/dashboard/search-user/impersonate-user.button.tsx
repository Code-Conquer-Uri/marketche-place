"use client";

import { ArrowsClockwiseIcon } from "@phosphor-icons/react/dist/ssr";
import { User } from "lucide-react";
import {
  type FC,
  memo,
  useCallback,
  useMemo,
  useState,
  useTransition,
} from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export const ImpersonateUserButton: FC<{ userId: string; name: string }> = memo(
  ({ userId, name }) => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isPending, startTransition] = useTransition();

    const handleImpersonate = useCallback(async () => {
      setIsSubmitting(true);

      const loadingToast = toast.loading(`Personificando o usuário ${name}`);

      const { error } = await authClient.admin.impersonateUser({
        userId,
      });

      setIsSubmitting(false);

      toast.dismiss(loadingToast);

      if (error) {
        return toast.error("Erro ao personificar usuário", {
          description: error.message,
        });
      }

      toast.success("Usuário personificado com sucesso");
      startTransition(() => {
        window.location.reload();
      });
    }, [userId, name]);

    const busy = useMemo(
      () => isSubmitting || isPending,
      [isSubmitting, isPending],
    );

    return (
      <Button
        disabled={busy}
        onClick={handleImpersonate}
        aria-busy={busy}
        size="icon"
        title={busy ? `Personificando ${name}…` : `Personificar ${name}`}
      >
        {busy ? (
          <ArrowsClockwiseIcon className="size-5 rotate-180 duration-500" />
        ) : (
          <User size={16} />
        )}
        <span className="sr-only">
          {busy ? `Personificando ${name}` : `Personificar ${name}`}
        </span>
      </Button>
    );
  },
);

ImpersonateUserButton.displayName = "ImpersonateUserButton";
