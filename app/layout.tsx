import BackToTopButton from "@/components/common/back-button";
import { ThemeProvider } from "@/components/common/theme-provider";
import type { Metadata } from "next";
import { DM_Sans, Plus_Jakarta_Sans } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";
import "./globals.css";

// For headings
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

// For body text
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "ECGS - E-Career Guidance System",
  description:
    "Find personalized jobs that match your skills and interests with ECGS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} ${dmSans.variable}`}
    >
      <body>
        {/* Next top loader: Appears at the top of the page on page transition */}
        <NextTopLoader color={"#2563eb"} zIndex={9999} />
        {/* Toaster */}
        <Toaster
          toastOptions={{
            className:
              "bg-white dark:bg-slate-800 dark:text-slate-200 z-[999999]",
            duration: 3000,
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
          storageKey="ecgs-theme"
        >
          {children}
          <BackToTopButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
