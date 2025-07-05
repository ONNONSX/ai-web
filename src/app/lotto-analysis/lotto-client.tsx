"use client";

import { useState } from "react";
import { Ticket, Sparkles, LoaderCircle, BarChart, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTranslation } from "@/components/language-provider";
import { Badge } from "@/components/ui/badge";

const getBallColor = (number: number) => {
  if (number <= 10) return 'bg-yellow-400 text-black';
  if (number <= 20) return 'bg-blue-500 text-white';
  if (number <= 30) return 'bg-red-500 text-white';
  if (number <= 40) return 'bg-gray-700 text-white';
  return 'bg-green-500 text-white';
};

const ColorBall = ({ number }: { number: number }) => (
  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-md ${getBallColor(number)}`}>
    {number}
  </div>
);

export default function LottoClient() {
  const [numbers, setNumbers] = useState<number[][]>([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const generateNumbers = () => {
    setLoading(true);
    setNumbers([]);

    setTimeout(() => {
      const allGames: number[][] = [];
      for (let i = 0; i < 5; i++) {
        const game = new Set<number>();
        while (game.size < 6) {
          game.add(Math.floor(Math.random() * 45) + 1);
        }
        allGames.push(Array.from(game).sort((a, b) => a - b));
      }
      setNumbers(allGames);
      setLoading(false);
    }, 1500);
  };
  
  const mostFrequentNumbers = [34, 1, 12, 17, 43, 27];
  const leastFrequentNumbers = [9, 23, 22, 30, 41, 38];

  const colorStats = [
    { range: '1-10', color: t('lotto_analysis_page.color_yellow'), count: 213, bgColor: 'bg-yellow-400 text-black' },
    { range: '11-20', color: t('lotto_analysis_page.color_blue'), count: 221, bgColor: 'bg-blue-500 text-white' },
    { range: '21-30', color: t('lotto_analysis_page.color_red'), count: 228, bgColor: 'bg-red-500 text-white' },
    { range: '31-40', color: t('lotto_analysis_page.color_gray'), count: 231, bgColor: 'bg-gray-700 text-white' },
    { range: '41-45', color: t('lotto_analysis_page.color_green'), count: 125, bgColor: 'bg-green-500 text-white' },
  ];

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline text-2xl">
            <Ticket className="w-8 h-8 text-primary" />
            {t('lotto_analysis_page.generator_card_title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="mb-6 space-y-4 min-h-[260px] flex flex-col justify-center items-center">
            {loading ? (
              <div className="flex justify-center items-center">
                <LoaderCircle className="w-12 h-12 animate-spin text-primary" />
              </div>
            ) : numbers.length > 0 ? (
              <div className="space-y-3">
                {numbers.map((game, gameIndex) => (
                  <div key={gameIndex} className="flex items-center gap-2 sm:gap-4 animate-in fade-in-50" style={{ animationDelay: `${gameIndex * 100}ms` }}>
                    <Badge variant="secondary" className="w-20 justify-center text-sm py-2 shrink-0">
                      {t('lotto_analysis_page.game_label', { number: gameIndex + 1 })}
                    </Badge>
                    <div className="flex flex-row gap-2">
                      {game.map((num) => (
                        <ColorBall key={num} number={num} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center">
                <p className="text-muted-foreground text-lg">{t('lotto_analysis_page.generator_prompt')}</p>
              </div>
            )}
          </div>
          <Button
            onClick={generateNumbers}
            className="w-full max-w-sm text-lg"
            disabled={loading}
          >
            <Sparkles className="mr-2 h-5 w-5" />
            {t('lotto_analysis_page.button_generate')}
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline text-2xl">
            <BarChart className="w-8 h-8 text-primary" />
            {t('lotto_analysis_page.analysis_card_title')}
          </CardTitle>
          <CardDescription>
            {t('lotto_analysis_page.analysis_card_subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-secondary/30">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base font-semibold">{t('lotto_analysis_page.most_frequent_title')}</CardTitle>
                  <TrendingUp className="w-5 h-5 text-green-500"/>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {mostFrequentNumbers.map(num => <ColorBall key={num} number={num} />)}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-secondary/30">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                   <CardTitle className="text-base font-semibold">{t('lotto_analysis_page.least_frequent_title')}</CardTitle>
                   <TrendingDown className="w-5 h-5 text-red-500"/>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {leastFrequentNumbers.map(num => <ColorBall key={num} number={num} />)}
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card className="bg-secondary/30">
              <CardHeader>
                <CardTitle className="text-base font-semibold">{t('lotto_analysis_page.color_stats_title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap justify-around gap-4 text-center">
                  {colorStats.map(stat => (
                    <div key={stat.range} className="flex flex-col items-center gap-2">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-inner ${stat.bgColor}`}>{stat.count}</div>
                      <Badge variant="outline">{stat.color}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
        </CardContent>
      </Card>
    </div>
  );
}
