"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Smile, Sparkles, User, Upload, LoaderCircle, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { handleAnalyzeFace } from "./actions";
import { useTranslation } from "@/components/language-provider";
import { Badge } from "@/components/ui/badge";

type AnalysisResult = {
  personalityInsights: string;
  fortuneOutlook: string;
  jobRecommendations: string[];
};

export default function FaceReadingClient() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { t, locale } = useTranslation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({ 
          title: t('face_reading_page.toast_file_too_large_title'), 
          description: t('face_reading_page.toast_file_too_large_description'), 
          variant: "destructive" 
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setImageDataUri(reader.result as string);
      };
      reader.readAsDataURL(file);
      setResult(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageDataUri) {
      toast({ 
        title: t('face_reading_page.toast_no_image_title'),
        description: t('face_reading_page.toast_no_image_description'),
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    setResult(null);

    const response = await handleAnalyzeFace({ photoDataUri: imageDataUri, locale });

    if (response.success && response.data) {
      setResult(response.data);
    } else {
      toast({ 
        title: t('face_reading_page.toast_error_title'), 
        description: response.error || t('face_reading_page.toast_error_description'), 
        variant: "destructive"
       });
    }

    setLoading(false);
  };

  return (
    <div>
      <Card className="shadow-lg bg-secondary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline text-2xl">
            <Upload className="w-8 h-8 text-primary" />
            {t('face_reading_page.upload_card_title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div
              className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors bg-background"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/jpeg, image/webp"
                disabled={loading}
              />
              {imagePreview ? (
                <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden shadow-md">
                    <Image src={imagePreview} alt="Face preview" layout="fill" objectFit="cover" />
                </div>
              ) : (
                <div className="flex flex-col items-center text-muted-foreground">
                  <User className="w-16 h-16 mb-2" />
                  <p>{t('face_reading_page.upload_prompt')}</p>
                  <p className="text-sm">{t('face_reading_page.upload_hint')}</p>
                </div>
              )}
            </div>
            <Button type="submit" className="w-full text-lg" disabled={!imagePreview || loading}>
              {loading ? (
                <>
                  <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                  {t('face_reading_page.button_analyzing')}
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  {t('face_reading_page.button_analyze')}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <div className="mt-8">
          <div className="grid gap-6 md:grid-cols-1">
              <Card className="shadow-xl border-2 border-primary/50 bg-secondary/30">
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2 font-headline text-2xl text-primary">
                          <Smile className="w-8 h-8"/>
                          {t('face_reading_page.results_personality_title')}
                      </CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-lg">{result.personalityInsights}</p>
                  </CardContent>
              </Card>
              <Card className="shadow-xl border-2 border-accent/50 bg-secondary/30">
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2 font-headline text-2xl text-accent">
                          <Sparkles className="w-8 h-8"/>
                          {t('face_reading_page.results_fortune_title')}
                      </CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-lg">{result.fortuneOutlook}</p>
                  </CardContent>
              </Card>
              <Card className="shadow-xl border-2 border-accent/50 bg-secondary/30">
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2 font-headline text-2xl text-accent">
                          <Briefcase className="w-8 h-8"/>
                          {t('face_reading_page.results_jobs_title')}
                      </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                      {result.jobRecommendations.map((job, index) => (
                        <Badge key={index} variant="secondary" className="text-lg px-3 py-1">{job}</Badge>
                      ))}
                  </CardContent>
              </Card>
          </div>
        </div>
      )}
    </div>
  );
}
