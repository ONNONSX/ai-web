import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import MainLayout from "@/components/main-layout";
import { LanguageProvider } from "@/components/language-provider";
import "./globals.css";
import { GoogleAdsense } from '@/components/ads/google-adsense';
import { CoupangPartners } from '@/components/ads/coupang-partners';

export const metadata: Metadata = {
  metadataBase: new URL("https://mysticai.com"),
  title: "Mystic AI Portal",
  description: "An AI-Powered Fortune Telling & Entertainment Portal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4823432612824489"
          crossOrigin="anonymous"
        />
        <meta name="google-adsense-account" content={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID} />
      </head>
      <body className="font-body antialiased">
        <LanguageProvider>
          <MainLayout>
            <div className="min-h-screen bg-background">
              <div className="container mx-auto p-4">
                {/* 메인 컨텐츠 */}
                {children}

                {/* 하단 광고 영역 */}
                <div className="mt-12 space-y-6">
                  <GoogleAdsense slot="9876543210" />
                  <CoupangPartners productId="1234567" />
                </div>

                {/* 사이드바 광고 (데스크톱에서만 표시) */}
                <div className="fixed right-4 top-1/4 hidden xl:block" style={{ width: '160px' }}>
                  <GoogleAdsense slot="8765432109" />
                </div>
              </div>
            </div>
          </MainLayout>
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
