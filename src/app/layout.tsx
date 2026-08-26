import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SAAS-FRELANCE — Oportunidades de freelance agregadas",
  description:
    "Agrega vagas de freelance de várias plataformas (Workana, 99Freelas, Freelancer.com, Upwork) em um só lugar.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}
