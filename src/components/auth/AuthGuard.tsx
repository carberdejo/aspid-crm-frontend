// "use client";

// import { useAuthStore } from "@/store/useAuthStore";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { Loader2 } from "lucide-react";

// interface AuthGuardProps {
//   children: React.ReactNode;
// }

// export default function AuthGuard({ children }: AuthGuardProps) {
//   const router = useRouter();
//   const { user } = useAuthStore();
//   const [isHydrated, setIsHydrated] = useState(false);

//   // ✅ Detectar cuando Zustand se hidrata y si hay user
//   useEffect(() => {
//     // Esperar un frame para que Zustand se hidrate desde localStorage
//     const timer = requestAnimationFrame(() => {
//       setIsHydrated(true);

//       // Si después de hidratación NO hay user → redirigir a login
//       if (!user) {
//         router.push("/auth/login");
//       }
//     });

//     return () => cancelAnimationFrame(timer);
//   }, [user, router]);

//   // Mientras se hidrata (isHydrated = false), mostrar spinner
//   if (!isHydrated) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="flex flex-col items-center gap-4">
//           <Loader2 className="h-8 w-8 animate-spin text-[#1a2a53]" />
//           <p className="text-sm text-gray-600">Inicializando sesión...</p>
//         </div>
//       </div>
//     );
//   }

//   // Si está hidratado pero NO hay user → NO renderizar (router.push está en progreso)
//   if (!user) {
//     return null;
//   }

//   // ✅ Usuario autenticado e hydrated, renderizar children
//   return <>{children}</>;
// }
