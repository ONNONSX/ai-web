"use client";

import { useState } from "react";
import Image from "next/image";
import { Users, Sparkles, LoaderCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "@/components/language-provider";

type Scores = {
  teto: number;
  egen: number;
};

type Result = {
  type: string;
  description: string;
  keywords: string[];
};

export default function PersonalityTestPage() {
  const { t } = useTranslation();
  
  const questions = t('personality_test_page.questions');
  const resultsData = t('personality_test_page.results');
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Scores[]>([]);
  const [finalResult, setFinalResult] = useState<Result | null>(null);
  const [loadingResult, setLoadingResult] = useState(false);
  
  const handleAnswer = (scores: Scores) => {
    const newAnswers = [...answers, scores];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setLoadingResult(true);
      setTimeout(() => {
        calculateAndSetResult(newAnswers);
        setLoadingResult(false);
      }, 1500);
    }
  };

  const calculateAndSetResult = (finalAnswers: Scores[]) => {
    let tetoTotal = 0;
    let egenTotal = 0;

    finalAnswers.forEach(score => {
      tetoTotal += score.teto;
      egenTotal += score.egen;
    });

    let resultIndex;
    if (tetoTotal > 0 && egenTotal > 0) {
      resultIndex = 0; // 논리적 활동가 (Logical Activist)
    } else if (tetoTotal > 0 && egenTotal <= 0) {
      resultIndex = 1; // 논리적 사색가 (Logical Thinker)
    } else if (tetoTotal <= 0 && egenTotal > 0) {
      resultIndex = 2; // 감성적 활동가 (Emotional Activist)
    } else {
      resultIndex = 3; // 감성적 사색가 (Emotional Thinker)
    }
    
    setFinalResult(resultsData[resultIndex]);
  };


  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setFinalResult(null);
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <main className="flex-1 p-4 md:p-8 overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight text-primary">
            {t('personality_test_page.title')}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {t('personality_test_page.subtitle')}
          </p>
        </div>

        <Card className="shadow-lg bg-secondary/30">
          {!finalResult && !loadingResult && (
            <>
            <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2 font-headline text-2xl">
                    {t('personality_test_page.question_title', { current: currentQuestion + 1, total: questions.length })}
                </CardTitle>
                <Progress value={progress} className="mt-2" />
            </CardHeader>
            <CardContent className="space-y-6">
                <p className="text-xl font-semibold text-center h-24 flex items-center justify-center p-4">
                    {questions[currentQuestion].questionText}
                </p>
                <div className="grid grid-cols-1 gap-4">
                {questions[currentQuestion].answers.map((answer: any, index: number) => (
                    <Button key={index} onClick={() => handleAnswer(answer.scores)} variant="outline" className="h-auto py-4 text-base whitespace-normal justify-start text-left bg-background/50 hover:bg-background">
                        {answer.text}
                    </Button>
                ))}
                </div>
            </CardContent>
            </>
          )}

          {loadingResult && (
            <CardContent className="flex flex-col items-center justify-center pt-8 text-primary min-h-[400px]">
                <LoaderCircle className="w-12 h-12 animate-spin" />
                <p className="mt-4 text-lg font-semibold">{t('personality_test_page.button_analyzing')}</p>
            </CardContent>
          )}

          {finalResult && (
            <>
            <CardHeader className="text-center items-center">
                 <div className="w-40 h-40 relative rounded-full overflow-hidden mx-auto flex items-center justify-center mb-4">
                    <Image 
                      src={`https://placehold.co/400x400.png`} 
                      data-ai-hint={`${finalResult.keywords[0]} ${finalResult.keywords[1]}`}
                      alt={finalResult.type} layout="fill" objectFit="cover" />
                </div>
                <CardDescription className="font-semibold text-primary">{t('personality_test_page.result_type')}</CardDescription>
                <CardTitle className="font-headline text-3xl">{finalResult.type}</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
                <div className="text-base text-left bg-background/50 p-4 rounded-md">
                    <p>{finalResult.description}</p>
                    <ul className="mt-4 space-y-2">
                        {finalResult.keywords.map((feature: string, index: number) => (
                           <li key={index} className="flex items-start">
                             <Sparkles className="w-4 h-4 mr-2 mt-1 shrink-0 text-accent"/> 
                             <span>{feature}</span>
                           </li>
                        ))}
                    </ul>
                </div>
                
                <Button onClick={resetTest} className="text-lg">
                  <RefreshCw className="mr-2"/>
                  {t('personality_test_page.button_reset')}
                </Button>
            </CardContent>
            </>
          )}
        </Card>
      </div>
    </main>
  );
}
