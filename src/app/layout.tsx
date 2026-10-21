import type { Metadata } from "next";
import { sora } from "@/config/fonts";
import { QueryProvider } from "@/providers/QueryProvider";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "ASPID CRM",
  description: "ASPID CRM: gestión comercial de clientes, visitas y ventas",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/brand/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/brand/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/brand/favicon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/brand/favicon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/brand/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={cn("h-full antialiased", "font-sans", sora.variable)}
    >
      <body className="font-sans min-h-full flex flex-col">
        <QueryProvider>
          <TooltipProvider delayDuration={0}>
            {children}
            <Toaster richColors position="top-right" closeButton />
          </TooltipProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
