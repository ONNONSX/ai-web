
"use client";

import PalmReadingClient from "./palm-reading-client";
import { useTranslation } from "@/components/language-provider";

export default function PalmReadingPage() {
  const { t } = useTranslation();
  return (
    <main className="flex-1 p-4 md:p-8 overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight text-primary">
            {t('palm_reading_page.title')}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {t('palm_reading_page.subtitle')}
          </p>
        </div>
        <PalmReadingClient />
      </div>
    </main>
  );
}
