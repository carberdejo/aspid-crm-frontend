'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Key, Loader2, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  console.log('estoy ne login page')
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login, isLoading, isError, error } = useAuth();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  
  // Extraemos los datos directamente del formulario (DOM)
  const data = new FormData(e.currentTarget);
  const email = data.get('email') as string;
  const password = data.get('password') as string;

  console.log("🚀 Datos capturados:", { email, password });

  if (!email || !password) return; // Validación básica rápida

  login({ email: email.trim(), password });
};

  return (
    /* 1. min-h-screen + flex-col: Esto hace que el body sea una columna que ocupa al menos toda la pantalla */
    <div className="relative min-h-screen w-full flex flex-col bg-[#1a2a53] overflow-y-auto">
      
      {/* FONDO: Se queda absoluto para no estorbar al flujo de los elementos */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a2a53]/50 via-transparent to-[#1a2a53]" />
      </div>

      {/* 2. CONTENIDO PRINCIPAL: flex-1 hace que este div crezca y empuje al footer al fondo */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto flex items-center justify-center p-8 md:p-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          
          {/* LADO IZQUIERDO: Branding */}
          <div className="lg:col-span-5 flex flex-col space-y-8 animate-in slide-in-from-left-8 duration-700">
            <div className="space-y-4">
              <Image
                src="/logo-acme.png"
                alt="ACME & CIA Logo"
                width={220}
                height={70}
                className="object-contain"
                priority
              />
              <div className="h-1 w-20 bg-secondary rounded-full" />
              <p className="text-slate-300 text-sm font-medium tracking-widest uppercase opacity-70">
                Innovación y tecnología para la industria
              </p>
            </div>

            <div className="space-y-2">
              <h1 className="text-white text-6xl font-black uppercase tracking-tighter leading-none">
                Concar <span className="text-secondary">ACME</span>
              </h1>
              <p className="text-slate-400 text-lg font-light italic">
                Gestión centralizada de operaciones y ventas.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 w-fit px-4 py-2 rounded-full">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Sistema Operativo v2.4</span>
            </div>
          </div>

          {/* LADO DERECHO: Formulario */}
          <div className="lg:col-span-7 flex justify-center lg:justify-end animate-in zoom-in-95 duration-500">
            <form 
              onSubmit={handleSubmit}
              className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-10 md:p-14 w-full max-w-lg relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                <Key size={120} />
              </div>

              <div className="space-y-8">
                <div className="space-y-2 border-b border-slate-100 pb-6">
                  <h3 className="text-2xl font-black text-primary uppercase tracking-tight">Iniciar Sesión</h3>
                  <p className="text-sm text-slate-500 font-medium italic text-balance">Ingrese sus credenciales de acceso para entrar al sistema.</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Correo Electrónico</Label>
                    <Input
                      name="email"
                      type="email"
                      required
                      placeholder="carlos.personal@concar.com"
                      className="h-14 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-secondary transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Contraseña</Label>
                    <Input
                      name="password"
                      type="password"
                      required
                      placeholder="••••••••"
                      className="h-14 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-secondary transition-all"
                    />
                  </div>
                </div>

                {isError && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[10px] font-black uppercase tracking-widest text-center animate-shake">
                    {error?.message || "Validation failed"}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-accent hover:bg-accent/90 text-white font-black h-14 rounded-2xl shadow-lg shadow-accent/20 flex items-center justify-between px-8 transition-all group"
                >
                  <span className="uppercase tracking-widest text-xs">
                    {isLoading ? 'Procesando...' : 'Ingresar al sistema'}
                  </span>
                  {isLoading ? <Loader2 className="animate-spin" /> : <ChevronRight className="group-hover:translate-x-1 transition-transform" />}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* 3. FOOTER: Al estar fuera del main con mt-auto, siempre se queda abajo sin encimarse */}
      <footer className="relative z-10 w-full py-10">
        <div className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.5em] text-center px-6">
          Acme & Cia © 2026 - Innovation for industry
        </div>
      </footer>

    </div>
  );
}