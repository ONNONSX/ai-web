"use client";

import Link from "next/link";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/components/language-provider";

interface ServiceCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  image: string;
  imageHint: string;
}

export default function ServiceCard({
  title,
  description,
  href,
  icon: Icon,
  image,
  imageHint,
}: ServiceCardProps) {
  const { t } = useTranslation();
  return (
    <Link href={href} className="group block">
      <Card className="flex flex-col overflow-hidden transition-all duration-300 h-full border-2 border-transparent group-hover:border-primary group-hover:shadow-2xl group-hover:-translate-y-1">
        <CardHeader className="p-0 relative aspect-[3/2] w-full">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            data-ai-hint={imageHint}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4">
             <h3 className="font-bold text-lg text-white">{title}</h3>
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardDescription className="text-sm text-muted-foreground">{description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
