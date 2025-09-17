import { AuthView } from "@daveyplate/better-auth-ui";
import { authViewPaths } from "@daveyplate/better-auth-ui/server";
import LabeledLogo from "@/components/labeled-logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.values(authViewPaths).map((path) => ({ path }));
}

export default async function AuthPage({ params }: PageProps<"/auth/[path]">) {
  const { path } = await params;

  return (
    <div className="h-full flex flex-col justify-between p-5">
      <div className="flex self-end items-center gap-2.5">
        <span className="text-sm">Mudar tema</span>
        <ThemeToggle />
      </div>
      <main className="container border-none shadow-none flex grow flex-col items-center justify-center self-center p-4 md:p-6">
        <div className="flex flex-col gap-5 justify-center">
          <LabeledLogo
            className="mx-auto h-10 w-auto"
            color="var(--color-primary)"
          />
          <AuthView className="border-none shadow-none" path={path} />
        </div>
      </main>
    </div>
  );
}
