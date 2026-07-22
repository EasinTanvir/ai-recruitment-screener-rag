import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { Toaster } from "react-hot-toast";
import { EdgeStoreProvider } from "@/lib/edgestore";
import Navbar from "@/components/Navbar";
import { getAuthTokenFromCookies } from "@/lib/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AI Recruiter System",
  description:
    "A premium recruiter dashboard and public job listing experience built with Next.js and Tailwind CSS.",
};

export default async function RootLayout({ children }) {
  const cookie = await getAuthTokenFromCookies();
  const isAuthenticated = !!cookie;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-100 text-slate-950">
        <Navbar isAuthenticated={isAuthenticated} />
        <main>
          <Toaster position="top-center" />
          <EdgeStoreProvider>{children}</EdgeStoreProvider>
        </main>
      </body>
    </html>
  );
}
