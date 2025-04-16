// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { NavUser } from "@/components/nav-user";
import { Toaster } from 'sonner';
import { AuthProvider } from "@/providers/auth-provider";
import { getCurrentUser } from "./login/user-server";

export const metadata: Metadata = {
  title: "Event App",
  description: "Pixl Test",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="es">
      <body>
        <AuthProvider initialUser={user}>
          <header className="p-4 absolute top-0 right-0 z-50 h-12">
                <NavUser />
          </header>
          <Toaster richColors position="top-center"/>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}