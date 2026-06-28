import type { Metadata } from "next";
import "@fontsource/fraunces/400.css";
import "@fontsource/fraunces/400-italic.css";
import "@fontsource/fraunces/500.css";
import "@fontsource/fraunces/600.css";
import "@fontsource/fraunces/600-italic.css";
import "@fontsource/fraunces/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "./globals.css";

const siteUrl = "https://www.sadebalyapi.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sadebal Yapı | İnşaat ve Gayrimenkul Geliştirme",
    template: "%s | Sadebal Yapı",
  },
  description:
    "Sadebal Yapı; konut, ticari ve karma kullanım projelerinde güvenilir mühendislik ve zamansız mimari anlayışıyla hizmet veren bir inşaat ve gayrimenkul geliştirme firmasıdır.",
  keywords: [
    "Sadebal Yapı",
    "Sadebal",
    "inşaat firması",
    "gayrimenkul geliştirme",
    "konut projeleri",
    "ticari yapı",
    "müteahhitlik",
  ],
  authors: [{ name: "Sadebal Yapı" }],
  creator: "Sadebal Yapı",
  publisher: "Sadebal Yapı",
  formatDetection: { email: false, address: false, telephone: true },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: siteUrl,
    siteName: "Sadebal Yapı",
    title: "Sadebal Yapı | İnşaat ve Gayrimenkul Geliştirme",
    description:
      "Konut, ticari ve karma kullanım projelerinde güvenilir mühendislik ve zamansız mimari.",
    images: [{ url: "/images/og-cover.png", width: 1200, height: 630, alt: "Sadebal Yapı" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sadebal Yapı | İnşaat ve Gayrimenkul Geliştirme",
    description:
      "Konut, ticari ve karma kullanım projelerinde güvenilir mühendislik ve zamansız mimari.",
    images: ["/images/og-cover.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('sadebal-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "GeneralContractor",
              name: "Sadebal Yapı",
              image: `${siteUrl}/images/logo.png`,
              url: siteUrl,
              description:
                "Sadebal Yapı; konut, ticari ve karma kullanım projelerinde güvenilir mühendislik ve zamansız mimari anlayışıyla hizmet veren bir inşaat ve gayrimenkul geliştirme firmasıdır.",
              areaServed: "TR",
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-bg text-ink">
        {children}
      </body>
    </html>
  );
}
