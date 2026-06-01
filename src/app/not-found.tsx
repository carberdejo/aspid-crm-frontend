"use client";

import Link from "next/link";
import { AlertCircle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; // ✅ 1. Importar el router de Next.js

export default function NotFound() {
  const router = useRouter(); // ✅ 2. Inicializar el router

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* 404 Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-accent rounded-full opacity-10 blur-2xl" />
            <AlertCircle className="h-24 w-24 text-primary relative" />
          </div>
        </div>

        {/* Error Code */}
        <div>
          <h1 className="text-7xl font-black text-primary leading-none">404</h1>
          <div className="h-1 w-16 bg-accent mx-auto mt-3 rounded-full" />
        </div>

        {/* Messages */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-primary">
            Página no encontrada
          </h2>
          <p className="text-gray-600 text-sm">
            Lo sentimos, la página que buscas no existe o ha sido movida a otra
            ubicación.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-4">
          {/* ✅ 3. Botón limpio, sin <form> y usando router.back() */}
          {/* <button
            type="button"
            onClick={() => router.back()}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-primary text-primary rounded-lg hover:bg-gray-50 transition-colors font-semibold"
          >
            Volver atrás
          </button> */}

          {/* Dashboard link */}
          <Link href="/" className="w-full">
            <Button className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-semibold py-3">
              <Home className="h-5 w-5" />
              Ir al Inicio
            </Button>
          </Link>
        </div>

        {/* Help Text */}
        <p className="text-xs text-gray-500 pt-4">
          Si crees que esto es un error, por favor contacta con soporte.
        </p>
      </div>
    </div>
  );
}
