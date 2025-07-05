
"use client";

import PersonalColorClient from "./personal-color-client";
import { useTranslation } from "@/components/language-provider";

export default function PersonalColorTestPage() {
  const { t } = useTranslation();
  return (
    <main className="flex-1 p-4 md:p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight text-primary">
            {t('personal_color_test_page.title')}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {t('personal_color_test_page.subtitle')}
          </p>
        </div>
        <PersonalColorClient />
      </div>
    </main>
  );
}
