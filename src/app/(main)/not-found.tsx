'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* 404 Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-[#f8aa19] rounded-full opacity-10 blur-2xl" />
            <AlertCircle className="h-24 w-24 text-[#1a2a53] relative" />
          </div>
        </div>

        {/* Error Code */}
        <div>
          <h1 className="text-7xl font-black text-[#1a2a53] leading-none">404</h1>
          <div className="h-1 w-16 bg-[#f8aa19] mx-auto mt-3 rounded-full" />
        </div>

        {/* Messages */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-[#1a2a53]">
            Página no encontrada
          </h2>
          <p className="text-gray-600 text-sm">
            Lo sentimos, la página que buscas no existe o ha sido movida a otra ubicación.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-4">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-[#1a2a53] text-[#1a2a53] rounded-lg hover:bg-gray-50 transition-colors font-semibold"
          >
            <ArrowLeft className="h-5 w-5" />
            Volver atrás
          </button>

          <Link href="/dashboard">
            <Button className="w-full flex items-center justify-center gap-2 bg-[#1a2a53] hover:bg-[#111c38] text-white rounded-lg font-semibold py-3">
              <Home className="h-5 w-5" />
              Ir al Dashboard
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
