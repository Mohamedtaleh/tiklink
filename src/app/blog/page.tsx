// src/app/blog/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { blogPosts } from "@/lib/blog-data";
import { useI18n } from "@/hooks/use-i18n";
import { dictionaries } from "@/locales";

export default function BlogPage() {
  const { t, locale } = useI18n();
  const dictionary = dictionaries[locale] || dictionaries.en;
  const translatedPosts = dictionary.blog.posts;

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">{t('blog.title')}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t('blog.tagline')}
        </p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => {
          const translatedPost = (translatedPosts as any)[post.id];
          return (
            <Card key={post.slug} className="overflow-hidden group flex flex-col bg-card/50 backdrop-blur-sm">
              <Link href={post.slug} className="block">
                <div className="relative aspect-video">
                  <Image 
                    src={post.imageUrl} 
                    alt={translatedPost.title} 
                    fill 
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={post.aiHint}
                  />
                </div>
              </Link>
              <CardHeader>
                <CardTitle className="font-headline text-xl">
                  <Link href={post.slug} className="hover:text-primary transition-colors">
                    {translatedPost.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <p className="text-muted-foreground flex-grow">{translatedPost.description}</p>
                <Button asChild variant="link" className="p-0 h-auto justify-start mt-4">
                    <Link href={post.slug} className="text-primary">
                      {t('blog.readMore')} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  );
}
