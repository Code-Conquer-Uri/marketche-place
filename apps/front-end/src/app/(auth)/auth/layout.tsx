import Logo from "@/components/logo";

export default async function AuthLayout({ children }: LayoutProps<"/auth">) {
  return (
    <div className="grid min-h-screen grid-cols-1 px-5 lg:max-h-screen lg:grid-cols-2 lg:px-0">
      {/* Left side - Image and testimonial */}
      <div className="relative hidden bg-primary lg:block">
        <div className="relative flex h-full w-full items-center justify-center">
          <Logo color="var(--color-background)" />
        </div>
      </div>

      {children}
    </div>
  );
}
