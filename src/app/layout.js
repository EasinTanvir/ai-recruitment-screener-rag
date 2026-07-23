import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { Toaster } from "react-hot-toast";
import { EdgeStoreProvider } from "@/lib/edgestore";
import Navbar from "@/components/Navbar";
import { getAuthTokenFromCookies, getCurrentUser } from "@/lib/auth";
import Footer from "@/components/Footer";
import AiChat from "@/components/ai-chat/AiChat";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "HireFlow - Recruiter System",
  description:
    "A premium recruiter dashboard and public job listing experience built with Next.js and Tailwind CSS.",
};

export default async function RootLayout({ children }) {
  const user = await getCurrentUser();

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "ADMIN";

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-100 text-slate-950">
        <Navbar isAuthenticated={isAuthenticated} isAdmin={isAdmin} />
        <main>
          <AiChat />
          <Toaster position="top-center" />
          <EdgeStoreProvider>{children}</EdgeStoreProvider>
        </main>
        <Footer />
      </body>
    </html>
  );
}
