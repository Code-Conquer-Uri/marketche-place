/** biome-ignore-all lint/suspicious/noExplicitAny: Needed For Typed Routes */
"use client";

import { AuthUIProvider } from "@daveyplate/better-auth-ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { authClient } from "@/lib/auth-client";
import { ThemeProvider } from "./theme-provider";

export function ClientProviders({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <AuthUIProvider
      authClient={authClient}
      localization={{
        SIGN_IN: "Entrar",
        SIGN_UP: "Cadastrar",
        FORGOT_PASSWORD: "Esqueci minha senha",
        EMAIL: "Email",
        PASSWORD: "Senha",
        NEW_PASSWORD: "Nova senha",
        CONFIRM_PASSWORD: "Confirmar senha",
        NAME: "Nome",
        CHANGE_PASSWORD: "Alterar senha",
        CURRENT_PASSWORD: "Senha atual",
        SIGN_IN_DESCRIPTION: "Entre para continuar",
        SIGN_UP_DESCRIPTION: "Cadastre-se para continuar",
        RESET_PASSWORD_DESCRIPTION: "Insira seu email para redefinir sua senha",
        SIGN_IN_USERNAME_DESCRIPTION: "Insira seu email para entrar",
        USERNAME: "Usuário",
        SIGN_UP_ACTION: "Cadastre-se",
        SIGN_IN_ACTION: "Entrar",
        RESET_PASSWORD_ACTION: "Lembrou sua senha? Entre",
        FORGOT_PASSWORD_ACTION: "Esqueci minha senha",
        FORGOT_PASSWORD_EMAIL: "Enviar email de redefinição",
        SIGN_IN_USERNAME_PLACEHOLDER: "Insira seu email",
        RESET_PASSWORD: "Redefinir senha",
        INVALID_PASSWORD: "Senha inválida",
        PASSWORDS_DO_NOT_MATCH: "As senhas não coincidem",
        EMAIL_REQUIRED: "Email é obrigatório",
        PASSWORD_REQUIRED: "Senha é obrigatória",
        SIGN_OUT: "Sair",
        ACCOUNT: "Conta",
        SETTINGS: "Configurações",
        FORGOT_PASSWORD_DESCRIPTION: "Esqueceu sua senha?",
        FORGOT_PASSWORD_LINK: "Esqueceu sua senha?",
        DONT_HAVE_AN_ACCOUNT: "Não possui uma conta?",
        ALREADY_HAVE_AN_ACCOUNT: "Já possui uma conta?",
        PASSWORD_PLACEHOLDER: "Insira sua senha",
        EMAIL_PLACEHOLDER: "Insira seu email",
        NAME_PLACEHOLDER: "Insira seu nome",
      }}
      navigate={router.push as any}
      replace={router.replace as any}
      onSessionChange={() => {
        window.location.reload();
      }}
      Link={Link as any}
      account={{
        basePath: "/dashboard/account",
      }}
      organization={{
        basePath: "/dashboard/organization",
        pathMode: "slug",
        customRoles: [
          {
            label: "Dono da organização",
            role: "organizationOwner",
          },
          {
            label: "Membro da organização",
            role: "organizationMember",
          },
        ],
      }}
    >
      <ThemeProvider
        attribute="class"
        enableSystem={false}
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </AuthUIProvider>
  );
}
