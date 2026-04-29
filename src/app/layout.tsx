import type { Metadata } from "next";
import { montserratAlternates } from "@/config/fonts";
import { QueryProvider } from "@/providers/QueryProvider";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "ACME & CIA - Dashboard",
  description: "Sistema de gestión empresarial ACME & CIA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={cn("h-full antialiased", "font-sans", geist.variable)}
    >
      <body
        className={`${montserratAlternates.className} min-h-full flex flex-col`}
      >
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
