import type { Metadata } from 'next';
import { ThemeProvider } from "@/components/theme-provider";
import './globals.css';
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { cn } from '@/lib/utils';
import { Inter } from 'next/font/google';
import Script from "next/script";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Tiklink — Download Videos Without Watermark | Free Video Downloader',
    template: '%s | Tiklink',
  },
  description: 'Download TikTok, Instagram, Twitter and Facebook videos instantly without watermark . Bulk download, video to MP3, 100% free, no signup, HD quality. The fastest video downloader online.',
  keywords: 'video downloader, TikTok downloader, Instagram Reels downloader, YouTube Shorts downloader, no watermark, download videos, Tiklink, free video downloader, save videos online, download without watermark',
  metadataBase: new URL('https://www.tiklink.ink'),
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Tiklink — Download Videos Without Watermark',
    description: 'Download TikTok, Instagram Reels & Facebook & X videos without watermark. Bulk download, video to MP3, and free creator tools. Fast, free, no signup.',
    url: '/',
    siteName: 'Tiklink',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Tiklink — Download Videos Without Watermark',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tiklink — Download Videos Without Watermark',
    description: 'Download TikTok, Instagram Reels & Facebook & X videos without watermark. Bulk download, video to MP3, and free creator tools. Fast, free, no signup.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7004371088604965"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={cn(
          "font-body antialiased",
          inter.variable
        )}
      >
        {/* Structured Data — WebApplication */}
        <Script
          id="webapp-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Tiklink",
              url: "https://www.tiklink.ink",
              description: "Download TikTok, Instagram, YouTube, Twitter and Facebook videos without watermark. Free, fast, HD quality.",
              applicationCategory: "MultimediaApplication",
              operatingSystem: "Any",
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              author: { "@type": "Organization", name: "Tiklink", url: "https://www.tiklink.ink" },
            }),
          }}
        />
        <Script
          id="org-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Tiklink",
              url: "https://www.tiklink.ink",
              logo: "https://www.tiklink.ink/og-image.png",
              sameAs: [],
            }),
          }}
        />

        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-J51967TB2Q"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-J51967TB2Q', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />

        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <div className="flex flex-col min-h-screen text-foreground">
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
