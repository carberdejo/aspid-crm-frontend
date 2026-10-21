import { Sora } from "next/font/google";

// Tipografía ASPID: 400 texto corrido, 500 menús, 600 etiquetas y botones,
// 700 títulos y logotipo. next/font la sirve desde el propio servidor
export const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sora",
});
