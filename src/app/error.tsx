"use client"; // Los error boundaries deben ser client components

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Aquí puedes ver en consola el error real que está rompiendo React
    console.error("React se rompió por esto:", error);
  }, [error]);

  return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-bold text-red-600">
        ¡Ups! Algo salió mal en la interfaz.
      </h2>
      <p className="text-gray-600 mt-2">{error.message}</p>
      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => reset()} // Esto intenta re-renderizar el componente
      >
        Intentar de nuevo
      </button>
    </div>
  );
}
