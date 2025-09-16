import "./globals.css";

import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";
import { Suspense } from "react";
import { Toaster } from "sonner";
import { ClientProviders } from "@/components/shared/client.providers";
import { ImpersonationIndicator } from "@/components/shared/impersonation.indicator";
import { ServerProviders } from "@/components/shared/server.providers";
import { isImpersonatingAction } from "@/lib/get-current-user";

export const experimental_ppr = true;

// Fonte principal Sans-serif
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

// Fonte Monospace
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

// Fonte Serif
const playfairDisplay = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Multi-Tenant Platform",
  description:
    "Plataforma robusta para construir aplicações SaaS multi-tenant com isolamento completo de dados",
  keywords: ["multi-tenant", "saas", "platform", "enterprise", "scalable"],
  authors: [{ name: "Multi-Tenant Platform Team" }],
  creator: "Multi-Tenant Platform",
  publisher: "Multi-Tenant Platform",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://multi-tenant-platform.com"),
  openGraph: {
    title: "Multi-Tenant Platform",
    description:
      "Plataforma robusta para construir aplicações SaaS multi-tenant",
    url: "https://multi-tenant-platform.com",
    siteName: "Multi-Tenant Platform",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Multi-Tenant Platform",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Multi-Tenant Platform",
    description:
      "Plataforma robusta para construir aplicações SaaS multi-tenant",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} ${playfairDisplay.variable}`}
    >
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="apple-mobile-web-app-title" content="Multi-Tenant" />
      </head>
      <body className="font-sans antialiased">
        <ServerProviders>
          <ClientProviders>{children}</ClientProviders>
        </ServerProviders>

        <Toaster
          richColors
          position="top-right"
          toastOptions={{
            style: {
              background: "hsl(var(--background))",
              color: "hsl(var(--foreground))",
              border: "1px solid hsl(var(--border))",
            },
          }}
        />

        <Suspense>
          <ImpersonationIndicator
            isImperonatingPromise={isImpersonatingAction()}
          />
        </Suspense>
      </body>
    </html>
  );
}
