import type { Metadata } from 'next';
import { ThemeProvider } from "@/components/theme-provider";
import './globals.css';
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { cn } from '@/lib/utils';
import { Space_Grotesk, Inter } from 'next/font/google';
import Script from "next/script";



const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Tiklink - Download TikTok Videos & Free TikTok Tools',
  description: 'Download TikTok videos without watermark in seconds. Plus free AI tools: money calculator, hashtag generator, viral predictor, bio generator & more!',
  keywords: 'TikTok downloader, download TikTok videos, TikTok no watermark, TikTok money calculator, TikTok hashtag generator, TikTok viral predictor, TikTok analytics, TikTok bio generator, TikTok tools, Tiklink',
  metadataBase: new URL('https://tiklink.ink'), // Replace with your actual domain
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Tiklink - Download TikTok Videos — No Watermark, No Hassle',
    description: 'The best way to download TikTok videos without watermarks. Fast, free, and easy to use.',
    url: '/',
    siteName: 'Tiklink',
    images: [
      {
        url: '/og-image.png', // Make sure to add this image to your /public folder
        width: 1200,
        height: 630,
        alt: 'Tiklink OG Image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tiklink - Download TikTok Videos — No Watermark, No Hassle',
    description: 'The best way to download TikTok videos without watermarks. Fast, free, and easy to use.',
    images: ['/og-image.png'], // Make sure to add this image to your /public folder
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
      </head>
      <body
        className={cn(
          "font-body antialiased",
          spaceGrotesk.variable,
          inter.variable
        )}
      >
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7004371088604965"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* Google Analytics Script */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-J51967TB2Q`}
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
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <div className={cn("flex flex-col min-h-screen text-foreground")}>
              <div className="absolute top-0 left-0 w-full h-[700px] bg-gradient-hero-light dark:bg-gradient-hero-dark -z-10" />
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
