import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import { CartProvider } from "@/lib/cart";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LOMEI HOME — Arquitectura e Interiorismo",
  description:
    "Estudio de arquitectura e interiorismo en Querétaro, México. Diseñamos espacios que se viven.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${cormorant.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
