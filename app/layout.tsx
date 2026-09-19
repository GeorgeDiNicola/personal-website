import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { homepageIntroBootScript } from "@/components/portfolio/motion/homepageIntro";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteTitle = "George DiNicola | Software Engineer";
const siteDescription = "Personal portfolio and software engineering work.";
const siteUrl = "https://georgedinicola.github.io";
const themeBootScript = `
(() => {
  try {
    const storedTheme = localStorage.getItem("theme");
    const legacyStoredThemePreference = localStorage.getItem("theme-preference");
    const resolvedTheme =
      storedTheme === "light" || storedTheme === "dark"
        ? storedTheme
        : legacyStoredThemePreference === "light" ||
            legacyStoredThemePreference === "dark"
          ? legacyStoredThemePreference
          : window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.style.colorScheme = resolvedTheme;
  } catch {}
})();
`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  openGraph: {
    type: "website",
    url: siteUrl,
    title: siteTitle,
    description: siteDescription,
    siteName: "George DiNicola Portfolio",
    images: [
      {
        url: "/me.png",
        width: 1448,
        height: 1086,
        alt: "George DiNicola"
      }
    ]
  },
  twitter: {
    card: "summary",
    title: siteTitle,
    description: siteDescription,
    images: ["/me.png"]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script id="site-theme" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <Script id="home-intro" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: homepageIntroBootScript }} />
        <a href="#main-content" className="skip-link">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
