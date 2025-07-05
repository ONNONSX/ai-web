
"use client";

import DreamClient from "./dream-client";
import { useTranslation } from "@/components/language-provider";

export default function DreamInterpretationPage() {
  const { t } = useTranslation();
  return (
    <main className="flex-1 p-4 md:p-8 overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight text-primary">
            {t('dream_interpretation_page.title')}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {t('dream_interpretation_page.subtitle')}
          </p>
        </div>
        <DreamClient />
      </div>
    </main>
  );
}
