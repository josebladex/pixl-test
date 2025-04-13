import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Event App",
  description: "Pixl Test",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <header className="bg-gray-800 text-white p-4">
          <h1>Mi Aplicación</h1>
        </header>
        <main>{children}</main>
        <footer className="bg-gray-800 text-white p-4 text-center">
          Pie de página
        </footer>
      </body>
    </html>
  );
}
