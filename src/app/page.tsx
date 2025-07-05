"use client";

import {
  Smile,
  Hand,
  BrainCircuit,
  Users,
  Ticket,
  Palette,
} from "lucide-react";
import ServiceCard from "@/components/service-card";
import { useTranslation } from "@/components/language-provider";
import { useState, useEffect } from "react";

export default function Home() {
  const { t } = useTranslation();

  const services = [
    {
      title: "AI 관상 분석",
      description: t('services.face_reading.description'),
      href: "/face-reading",
      icon: Smile,
      image: "/image/AI 관상분석.png",
      imageHint: "AI face reading analysis"
    },
    {
      title: "AI 손금 분석",
      description: t('services.palm_reading.description'),
      href: "/palm-reading",
      icon: Hand,
      image: "/image/AI 손금 분석.png",
      imageHint: "AI palm reading analysis"
    },
    {
      title: "AI 꿈 해몽",
      description: t('services.dream_interpretation.description'),
      href: "/dream-interpretation",
      icon: BrainCircuit,
      image: "/image/AI 꿈 해몽.png",
      imageHint: "AI dream interpretation"
    },
    {
      title: "테토-에겐 테스트",
      description: t('services.personality_test.description'),
      href: "/personality-test",
      icon: Users,
      image: "/image/테토-에겐 테스트.png",
      imageHint: "Teto-Egen personality test"
    },
    {
      title: "AI 로또 분석",
      description: t('services.lotto_analysis.description'),
      href: "/lotto-analysis",
      icon: Ticket,
      image: "/image/AI 로또 분석.png",
      imageHint: "AI lotto number analysis"
    },
    {
      title: "퍼스널 컬러 테스트",
      description: t('services.personal_color_test.description'),
      href: "/personal-color-test",
      icon: Palette,
      image: "/image/퍼스널 컬러 테스트.png",
      imageHint: "Personal color analysis"
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight">
          {t('home_page.title')}
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          {t('home_page.subtitle')}
        </p>
      </div>

      <div className="grid gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service.href} {...service} />
        ))}
      </div>
    </div>
  );
}
