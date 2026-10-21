// 'use client';

// import { 
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from '@/components/ui/alert-dialog';
// import { LogOut, Loader2 } from 'lucide-react';

// interface LogoutModalProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }

// export default function LogoutModal({ open, onOpenChange }: LogoutModalProps) {
//   const { logout, isLoggingOut } = useLogout();

//   const handleLogout = () => {
//     // logout();
//   };

//   const handleCancel = () => {
//     if (!isLoggingOut) {
//       onOpenChange(false);
//     }
//   };

//   return (
//     <AlertDialog open={open} onOpenChange={onOpenChange}>
//       <AlertDialogContent className="sm:max-w-md">
//         <AlertDialogHeader>
//           <div className="flex items-center gap-3">
//             <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
//               <LogOut className="h-6 w-6 text-primary" />
//             </div>
//             <div>
//               <AlertDialogTitle className="text-primary">
//                 ¿Cerrar Sesión?
//               </AlertDialogTitle>
//             </div>
//           </div>
//           <AlertDialogDescription className="text-gray-600 pt-2">
//             ¿Estás seguro de que deseas cerrar sesión? Tendrás que volver a ingresar 
//             tus credenciales para acceder al sistema.
//           </AlertDialogDescription>
//         </AlertDialogHeader>
        
//         <AlertDialogFooter className="gap-2 sm:gap-2">
//           <AlertDialogCancel 
//             onClick={handleCancel}
//             disabled={isLoggingOut}
//             className="hover:bg-gray-50"
//           >
//             Cancelar
//           </AlertDialogCancel>
          
//           <AlertDialogAction
//             onClick={handleLogout}
//             disabled={isLoggingOut}
//             className="bg-primary hover:bg-primary-dark focus:ring-primary"
//           >
//             {isLoggingOut ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Cerrando sesión...
//               </>
//             ) : (
//               <>
//                 <LogOut className="mr-2 h-4 w-4" />
//                 Cerrar Sesión
//               </>
//             )}
//           </AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// }