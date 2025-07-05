"use client";

import { useState } from "react";
import { BrainCircuit, Sparkles, LoaderCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { handleInterpretDream } from "./actions";
import { useTranslation } from "@/components/language-provider";

type InterpretationResult = {
  interpretation: string;
};

export default function DreamClient() {
  const [dreamContent, setDreamContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InterpretationResult | null>(null);
  const { toast } = useToast();
  const { t, locale } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (dreamContent.trim().length < 10) {
      toast({
        title: t('dream_interpretation_page.toast_too_short_title'),
        description: t('dream_interpretation_page.toast_too_short_description'),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    const response = await handleInterpretDream({ dreamContent, locale });

    if (response.success && response.data) {
      setResult(response.data);
    } else {
      toast({
        title: t('dream_interpretation_page.toast_error_title'),
        description: response.error || t('dream_interpretation_page.toast_error_description'),
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  return (
    <div>
      <Card className="shadow-lg bg-secondary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline text-2xl">
            <BrainCircuit className="w-8 h-8 text-primary" />
            {t('dream_interpretation_page.input_card_title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder={t('dream_interpretation_page.input_placeholder')}
              value={dreamContent}
              onChange={(e) => setDreamContent(e.target.value)}
              rows={6}
              className="text-base bg-background"
              disabled={loading}
            />
            <Button type="submit" className="w-full text-lg" disabled={loading}>
              {loading ? (
                <>
                  <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                  {t('dream_interpretation_page.button_interpreting')}
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  {t('dream_interpretation_page.button_interpret')}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <>
          <Card className="mt-8 shadow-xl border-2 border-accent/50 bg-secondary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline text-2xl text-accent">
                <Sparkles className="w-8 h-8" />
                {t('dream_interpretation_page.results_title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p>{result.interpretation}</p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
