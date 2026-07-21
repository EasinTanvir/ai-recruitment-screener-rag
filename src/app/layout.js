import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { Toaster } from "react-hot-toast";
import { EdgeStoreProvider } from "@/lib/edgestore";

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

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-100 text-slate-950">
        <main>
          <Toaster position="top-center" />
          <EdgeStoreProvider>{children}</EdgeStoreProvider>
        </main>
      </body>
    </html>
  );
}
