
"use client";

import { useTranslation } from "@/components/language-provider";

export default function BrainStructureTestPage() {
  const { t } = useTranslation();
  return (
    <main className="flex-1 p-4 md:p-8 overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight text-primary">
            {t('services.brain_structure_test.title')}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {t('services.brain_structure_test.description')}
          </p>
          <p className="mt-8 text-lg text-foreground">Coming Soon!</p>
        </div>
      </div>
    </main>
  );
}
