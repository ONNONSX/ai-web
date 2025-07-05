"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import {
  Hand,
  Home,
  Smile,
  BrainCircuit,
  Users,
  Ticket,
  Heart,
  Palette,
} from "lucide-react";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/components/language-provider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GoogleAdsense } from './ads/google-adsense';
import { CoupangPartners } from './ads/coupang-partners';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { t, locale, setLocale } = useTranslation();

  const navItems = [
    { href: "/", label: t('sidebar.home'), icon: Home },
    { href: "/face-reading", label: t('sidebar.face_reading'), icon: Smile },
    { href: "/palm-reading", label: t('sidebar.palm_reading'), icon: Hand },
    {
      href: "/dream-interpretation",
      label: t('sidebar.dream_interpretation'),
      icon: BrainCircuit,
    },
    { href: "/personality-test", label: t('sidebar.personality_test'), icon: Users },
    { href: "/lotto-analysis", label: t('sidebar.lotto_analysis'), icon: Ticket },
    { href: "/personal-color-test", label: t('sidebar.personal_color_test'), icon: Palette },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Icons.CrystalBall className="w-8 h-8 text-primary" />
            <span className="text-lg font-semibold font-headline">
              {t('sidebar.mystic_ai')}
            </span>
          </div>
        </SidebarHeader>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={{
                  children: item.label,
                  className: "bg-primary text-primary-foreground",
                }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SidebarFooter>
          <div className="p-2">
            <Select value={locale} onValueChange={(value) => setLocale(value as any)}>
              <SelectTrigger>
                <SelectValue placeholder={t('sidebar.select_language')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ko">한국어</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ja">日本語</SelectItem>
                <SelectItem value="zh">中文</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-2 border-b md:hidden">
          <Link href="/" className="flex items-center gap-2">
            <Icons.CrystalBall className="w-6 h-6 text-primary" />
            <span className="text-md font-semibold font-headline">
              {t('sidebar.mystic_ai')}
            </span>
          </Link>
          <SidebarTrigger />
        </header>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto p-4">
            {/* 상단 광고 배너 */}
            <div className="mb-8">
              <GoogleAdsense slot="상단_광고_슬롯" />
            </div>

            {/* 기존 컨텐츠 */}
            {children}

            {/* 하단 쿠팡 파트너스 광고 */}
            <div className="mt-8">
              <CoupangPartners productId="추천_상품_ID" />
            </div>

            {/* 사이드바 광고 (데스크톱에서만 표시) */}
            <div className="fixed right-4 top-4 hidden lg:block" style={{ width: '300px' }}>
              <GoogleAdsense slot="사이드바_광고_슬롯" />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
