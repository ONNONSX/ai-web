"use client";

import FaceReadingClient from "./face-reading-client";
import { useTranslation } from "@/components/language-provider";
import { GoogleAdsense } from '@/components/ads/google-adsense';
import { CoupangPartners } from '@/components/ads/coupang-partners';

export default function FaceReadingPage() {
  const { t } = useTranslation();
  return (
    <main className="flex-1 p-4 md:p-8 overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight text-primary">
            {t('face_reading_page.title')}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {t('face_reading_page.subtitle')}
          </p>
        </div>

        {/* 컨텐츠 상단 광고 */}
        <div className="my-4">
          <GoogleAdsense slot="관상_상단_광고_슬롯" />
        </div>

        <FaceReadingClient />

        {/* 결과 후 광고 */}
        <div className="mt-12 space-y-6">
          <GoogleAdsense slot="관상_하단_광고_슬롯" />
          <CoupangPartners productId="관상_관련_상품_ID" />
        </div>
      </div>
    </main>
  );
}
