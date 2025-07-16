// src/app/page.tsx
"use client";

import { VideoDownloaderForm } from "@/components/video-downloader-form";
import { Star, Zap, Shield, Globe, Download, TrendingUp, Users, Heart, ClipboardPaste, BrainCircuit, MousePointerClick, ArrowUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from 'next/image';
import { Badge } from "@/components/ui/badge";
import { AnimatedCounter } from "@/components/animated-counter";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/use-i18n";

const mostDownloaded = [
  {
    username: "@dancequeen",
    captionKey: "home.mostDownloaded.video1.caption",
    imageUrl: "https://images.pexels.com/photos/3771814/pexels-photo-3771814.jpeg",
    aiHint: "tiktok dance",
    badgeKey: "home.mostDownloaded.video1.badge",
    badgeVariant: "default"
  },
  {
    username: "@funnyguy",
    captionKey: "home.mostDownloaded.video2.caption",
    imageUrl: "https://images.pexels.com/photos/4252131/pexels-photo-4252131.jpeg",
    aiHint: "funny moment",
    badgeKey: "home.mostDownloaded.video2.badge",
    badgeVariant: "secondary"
  },
  {
    username: "@nomadlife",
    captionKey: "home.mostDownloaded.video3.caption",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    aiHint: "travel sunset",
    badgeKey: "home.mostDownloaded.video3.badge",
    badgeVariant: "secondary"
  },
  {
    username: "@styledbyme",
    captionKey: "home.mostDownloaded.video4.caption",
    imageUrl: "https://images.pexels.com/photos/2065201/pexels-photo-2065201.jpeg",
    aiHint: "street fashion",
    badgeKey: "home.mostDownloaded.video4.badge",
    badgeVariant: "default"
  },
];

const testimonials = [
    {
      name: "Sarah J.",
      avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
      reviewKey: "home.testimonials.user1"
    },
    {
      name: "Omar K.",
      avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
      reviewKey: "home.testimonials.user2"
    },
    {
      name: "Anika P.",
      avatarUrl: "https://randomuser.me/api/portraits/women/65.jpg",
      reviewKey: "home.testimonials.user3"
    },
];

export default function Home() {
  const { t } = useI18n();

  const handleScrollToTop = () => {
    const downloaderElement = document.getElementById('downloader');
    if (downloaderElement) {
      downloaderElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col items-center pb-24 md:pb-0">
      {/* Hero Section */}
      <section id="downloader" className="w-full">
        <div className="container mx-auto px-4 text-center pt-12 md:pt-20 pb-16 md:pb-24">
          <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4 tracking-tighter">{t('home.hero.title')}</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            {t('home.hero.tagline')}
          </p>
          
          <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Star className="w-5 h-5 text-accent" />
                <span><AnimatedCounter from={4.5} to={4.9} precision={1} className="font-bold text-foreground" />/5 {t('home.hero.stats.rating')}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Download className="w-5 h-5 text-accent" />
                <span><AnimatedCounter from={1100000} to={1200000} className="font-bold text-foreground" />+ {t('home.hero.stats.downloads')}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Users className="w-5 h-5 text-accent" />
                <span><AnimatedCounter from={450000} to={500000} className="font-bold text-foreground" />+ {t('home.hero.stats.users')}</span>
              </div>
          </div>
          
          <VideoDownloaderForm />
        </div>
      </section>

      {/* Why Choose Tiklink Section */}
      <section className="w-full bg-background">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">{t('home.why.title')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <Card className="text-center bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                  <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                      <Heart className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="font-headline">{t('home.why.features.noWatermark.title')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                  <p className="text-muted-foreground">{t('home.why.features.noWatermark.text')}</p>
                  </CardContent>
              </Card>
              <Card className="text-center bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                  <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                      <Zap className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="font-headline">{t('home.why.features.fast.title')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                  <p className="text-muted-foreground">{t('home.why.features.fast.text')}</p>
                  </CardContent>
              </Card>
              <Card className="text-center bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                  <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                      <Shield className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="font-headline">{t('home.why.features.privacy.title')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                  <p className="text-muted-foreground">{t('home.why.features.privacy.text')}</p>
                  </CardContent>
              </Card>
              <Card className="text-center bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                  <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                      <Globe className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="font-headline">{t('home.why.features.multilang.title')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                  <p className="text-muted-foreground">{t('home.why.features.multilang.text')}</p>
                  </CardContent>
              </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full">
         <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">{t('home.how.title')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="flex flex-col items-center text-center p-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                    <ClipboardPaste className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-headline font-semibold">{t('home.how.steps.paste.title')}</h3>
                  <p className="text-muted-foreground mt-2">{t('home.how.steps.paste.text')}</p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                    <BrainCircuit className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-headline font-semibold">{t('home.how.steps.process.title')}</h3>
                  <p className="text-muted-foreground mt-2">{t('home.how.steps.process.text')}</p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                    <MousePointerClick className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-headline font-semibold">{t('home.how.steps.download.title')}</h3>
                  <p className="text-muted-foreground mt-2">{t('home.how.steps.download.text')}</p>
              </div>
          </div>
        </div>
      </section>
      
      {/* Most Downloaded Section */}
        <section className="w-full bg-background">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold font-headline">{t('home.mostDownloaded.title')}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {mostDownloaded.map((video, i) => (
                    <Card key={i} className="overflow-hidden group relative">
                        <div className="aspect-[9/16] relative">
                            <img 
                                src={video.imageUrl} 
                                alt={t(video.captionKey)} 
                                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" 
                                data-ai-hint={video.aiHint}
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>
                        <div className="absolute bottom-0 left-0 p-4 text-white">
                            <p className="font-bold text-sm">{video.username}</p>
                            <p className="text-xs">{t(video.captionKey)}</p>
                        </div>
                        <Badge variant={video.badgeVariant as any} className="absolute top-2 right-2 shadow-lg">{t(video.badgeKey)}</Badge>
                    </Card>
                ))}
            </div>
          </div>
        </section>

      {/* Testimonials Section */}
      <section className="w-full">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">{t('home.testimonials.title')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {testimonials.map((testimonial, i) => (
                  <Card key={i} className="bg-card/50 backdrop-blur-sm">
                      <CardContent className="pt-6">
                          <div className="flex items-center mb-4">
                              <Avatar>
                                  <AvatarImage src={testimonial.avatarUrl} alt={t('home.testimonials.userAvatarAlt', { name: testimonial.name })} data-ai-hint="user portrait" />
                                  <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="ml-4">
                                  <p className="font-semibold">{testimonial.name}</p>
                                  <div className="flex text-accent">
                                      <Star className="w-4 h-4 fill-current" />
                                      <Star className="w-4 h-4 fill-current" />
                                      <Star className="w-4 h-4 fill-current" />
                                      <Star className="w-4 h-4 fill-current" />
                                      <Star className="w-4 h-4 fill-current" />
                                  </div>
                              </div>
                          </div>
                          <p className="text-muted-foreground">"{t(testimonial.reviewKey)}"</p>
                      </CardContent>
                  </Card>
              ))}
          </div>
        </div>
      </section>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm border-t md:hidden z-50">
        <div className="container mx-auto flex items-center justify-between gap-4">
            <p className="text-sm font-semibold text-foreground truncate">{t('home.stickyCta.text')}</p>
            <Button onClick={handleScrollToTop} className="bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold shadow-lg flex-shrink-0">
                {t('home.stickyCta.button')}
            </Button>
        </div>
      </div>
    </div>
  );
}
