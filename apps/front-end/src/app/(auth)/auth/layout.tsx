import { Suspense } from "react";
import Logo from "@/components/logo";
import { Auth } from "@/components/shared/auth";

export default async function AuthLayout({ children }: LayoutProps<"/auth">) {
  return (
    <>
      <Suspense>
        <Auth allow="Unauthenticated-Only" redirectTo={"/dashboard"} />
      </Suspense>
      <div className="grid min-h-screen grid-cols-1 px-5 lg:max-h-screen lg:grid-cols-2 lg:px-0">
        {/* Left side - Image and testimonial */}
        <div className="relative hidden bg-primary lg:block">
          <div className="relative flex h-full w-full items-center justify-center">
            <Logo color="var(--primary)" />
          </div>
        </div>

        {children}
      </div>
    </>
  );
}
