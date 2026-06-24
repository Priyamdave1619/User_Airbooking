import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastContainer } from "@/components/ui/Toast";
import { PageLoader } from "@/components/layout/PageLoader";

export const metadata: Metadata = {
  title: "SkyRoute Airlines | Book Flights, Compare Fares, Fly Smarter",
  description:
    "Search and book flights worldwide with SkyRoute Airlines. Compare fares across Economy, Business and First class, manage your trips, and explore travel offers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        <AuthProvider>
          <PageLoader />
          {children}
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  );
}
