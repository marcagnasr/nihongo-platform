import type { Metadata } from "next";
import { Shippori_Mincho, DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/Toast";
import { ModalProvider } from "@/components/Modal";
import Navbar from "@/components/Navbar";

// ── Fonts ──────────────────────────────────────────────────────────
// Loaded via next/font/google: self-hosted, no layout shift, no runtime
// request to Google. Each exposes a CSS variable that globals.css reads
// (e.g. `var(--font-shippori)`), matching the prototype's font roles:
//   Shippori Mincho → headings, logo, Japanese text (serif)
//   DM Sans         → body, buttons, labels (sans)
//   DM Mono         → timestamps, lesson numbers (mono)

const shippori = Shippori_Mincho({
  variable: "--font-shippori",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nihongo — Learn Japanese, beautifully",
  description:
    "Interactive Japanese video lessons with in-video quizzes, adaptive recommendations, and live tutoring.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${shippori.variable} ${dmSans.variable} ${dmMono.variable} antialiased`}
    >
      <body>
        {/* Providers expose useToast()/useModal() to the whole app.
            Toast must wrap Modal because the modal shows toasts on submit. */}
        <ToastProvider>
          <ModalProvider>
            <Navbar />
            {children}
          </ModalProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
