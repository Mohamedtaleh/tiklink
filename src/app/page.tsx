// src/app/page.tsx
"use client";

import Link from "next/link";
import { VideoDownloaderForm } from "@/components/video-downloader-form";
import { Star, Zap, Shield, Globe, Download, TrendingUp, Users, Heart, ClipboardPaste, BrainCircuit, MousePointerClick, ArrowRight, DollarSign, Flame, Hash, User, Sparkles, Play, Trophy, Verified, Crown, Rocket } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from 'next/image';
import { Badge } from "@/components/ui/badge";
import { AnimatedCounter } from "@/components/animated-counter";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

const TOOLS = [
  {
    id: "money-calculator",
    href: "/tools/money-calculator",
    icon: DollarSign,
    gradient: "from-green-500 to-emerald-500",
    bgGradient: "from-green-500/10 to-emerald-500/5",
    popular: true,
  },
  {
    id: "viral-predictor",
    href: "/tools/viral-predictor",
    icon: Flame,
    gradient: "from-orange-500 to-red-500",
    bgGradient: "from-orange-500/10 to-red-500/5",
    popular: true,
  },
  {
    id: "hashtag-generator",
    href: "/tools/hashtag-generator",
    icon: Hash,
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-500/10 to-cyan-500/5",
    popular: true,
  },
  {
    id: "bio-generator",
    href: "/tools/bio-generator",
    icon: User,
    gradient: "from-pink-500 to-rose-500",
    bgGradient: "from-pink-500/10 to-rose-500/5",
    popular: true,
  },
];

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
      reviewKey: "home.testimonials.user1",
      role: "Content Creator"
    },
    {
      name: "Omar K.",
      avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
      reviewKey: "home.testimonials.user2",
      role: "Social Media Manager"
    },
    {
      name: "Anika P.",
      avatarUrl: "https://randomuser.me/api/portraits/women/65.jpg",
      reviewKey: "home.testimonials.user3",
      role: "TikTok Influencer"
    },
];

const trustedBy = [
  { name: "10M+", label: "Monthly Views" },
  { name: "500K+", label: "Happy Users" },
  { name: "150+", label: "Countries" },
  { name: "4.9", label: "User Rating" },
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
    <div className="flex flex-col items-center pb-24 md:pb-0 overflow-hidden">
      {/* Premium Hero Section */}
      <section id="downloader" className="w-full relative">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute inset-0 bg-dot-pattern opacity-30" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="container relative mx-auto px-4 text-center pt-16 md:pt-28 pb-20 md:pb-32">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 shadow-premium animate-float">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-background" />
              ))}
            </div>
            <span className="text-sm font-medium">
              <span className="text-gradient font-bold">500K+</span> {t('home.hero.stats.users')}
            </span>
            <Verified className="w-4 h-4 text-primary" />
          </div>
          
          {/* Main headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-headline mb-6 tracking-tight">
            <span className="text-gradient-animated">{t('home.hero.title').split(' ').slice(0, 2).join(' ')}</span>
            <br />
            <span className="text-foreground">{t('home.hero.title').split(' ').slice(2).join(' ')}</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            {t('home.hero.tagline')}
          </p>
          
          {/* Stats row */}
          <div className="mb-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {trustedBy.map((stat, i) => (
              <div key={i} className="glass rounded-2xl p-4 shadow-premium hover:shadow-premium-lg transition-all duration-300 hover:-translate-y-1">
                <div className="text-2xl md:text-3xl font-bold text-gradient">{stat.name}</div>
                <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
          
          {/* Download form with premium styling */}
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-2xl blur-lg opacity-30 animate-gradient" />
            <div className="relative glass-strong rounded-2xl p-1">
              <VideoDownloaderForm />
            </div>
          </div>
          
          {/* Feature highlights */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {[
              { icon: Zap, text: t('home.why.features.fast.title') },
              { icon: Heart, text: t('home.why.features.noWatermark.title') },
              { icon: Shield, text: t('home.why.features.privacy.title') },
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <feature.icon className="w-4 h-4 text-primary" />
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free Tools Section - Premium Design */}
      <section className="w-full relative">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-background" />
        <div className="container relative mx-auto px-4 py-20 md:py-28">
          <div className="text-center mb-16">
            <Badge className="mb-6 px-4 py-2 text-sm bg-gradient-to-r from-primary to-accent text-white border-0 shadow-lg animate-pulse-glow">
              <Sparkles className="w-4 h-4 mr-2" />
              {t('tools.page.aiPowered')}
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold font-headline mb-6">
              <span className="text-gradient">{t('home.tools.title')}</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('home.tools.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {TOOLS.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <Link key={tool.id} href={tool.href}>
                  <Card className={cn(
                    "h-full relative border-0 transition-all duration-500 hover:shadow-premium-xl hover:-translate-y-3 cursor-pointer group overflow-hidden",
                    "glass shadow-premium-lg"
                  )}>
                    {tool.popular && (
                      <div className="absolute top-0 right-0 bg-gradient-to-l from-accent to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                        <Crown className="w-3 h-3 inline mr-1" />
                        Popular
                      </div>
                    )}
                    <div className={cn(
                      "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                      tool.bgGradient
                    )} />
                    <CardHeader className="relative pb-2">
                      <div className={cn(
                        "w-16 h-16 rounded-2xl bg-gradient-to-br shadow-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300",
                        tool.gradient
                      )}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-xl font-headline group-hover:text-primary transition-colors">
                        {t(`tools.${tool.id}.title`)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative">
                      <CardDescription className="line-clamp-2 mb-6 text-base">
                        {t(`tools.${tool.id}.shortDesc`)}
                      </CardDescription>
                      <div className="flex items-center text-primary font-semibold group-hover:gap-3 transition-all">
                        <span>{t("tools.page.tryNow")}</span>
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/tools">
              <Button size="lg" className="gap-3 px-8 py-6 text-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-premium-lg hover:shadow-premium-xl transition-all hover:-translate-y-1">
                {t('home.tools.viewAll')}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Tiklink Section - Premium Redesign */}
      <section className="w-full relative bg-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="container relative mx-auto px-4 py-20 md:py-28">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-6 px-4 py-2">
              <Trophy className="w-4 h-4 mr-2" />
              Why Creators Love Us
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold font-headline">{t('home.why.title')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { icon: Heart, titleKey: 'home.why.features.noWatermark.title', textKey: 'home.why.features.noWatermark.text', gradient: 'from-pink-500 to-rose-500' },
              { icon: Zap, titleKey: 'home.why.features.fast.title', textKey: 'home.why.features.fast.text', gradient: 'from-yellow-500 to-orange-500' },
              { icon: Shield, titleKey: 'home.why.features.privacy.title', textKey: 'home.why.features.privacy.text', gradient: 'from-green-500 to-emerald-500' },
              { icon: Globe, titleKey: 'home.why.features.multilang.title', textKey: 'home.why.features.multilang.text', gradient: 'from-blue-500 to-cyan-500' },
            ].map((feature, i) => (
              <Card key={i} className="text-center glass border-0 shadow-premium-lg hover:shadow-premium-xl transition-all duration-300 hover:-translate-y-2 group">
                <CardHeader>
                  <div className={cn(
                    "mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform",
                    feature.gradient
                  )}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="font-headline mt-4">{t(feature.titleKey)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{t(feature.textKey)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section - Premium Timeline */}
      <section className="w-full relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-muted/30" />
        <div className="container relative mx-auto px-4 py-20 md:py-28">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-6 px-4 py-2">
              <Rocket className="w-4 h-4 mr-2" />
              3 Simple Steps
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold font-headline">{t('home.how.title')}</h2>
          </div>
          
          <div className="relative max-w-5xl mx-auto">
            {/* Connection line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary rounded-full transform -translate-y-1/2 opacity-30" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: ClipboardPaste, step: '01', titleKey: 'home.how.steps.paste.title', textKey: 'home.how.steps.paste.text', gradient: 'from-blue-500 to-cyan-500' },
                { icon: BrainCircuit, step: '02', titleKey: 'home.how.steps.process.title', textKey: 'home.how.steps.process.text', gradient: 'from-purple-500 to-pink-500' },
                { icon: MousePointerClick, step: '03', titleKey: 'home.how.steps.download.title', textKey: 'home.how.steps.download.text', gradient: 'from-green-500 to-emerald-500' },
              ].map((step, i) => (
                <div key={i} className="relative flex flex-col items-center text-center p-6 group">
                  <div className="relative mb-6">
                    <div className={cn(
                      "w-20 h-20 rounded-3xl bg-gradient-to-br flex items-center justify-center shadow-premium-lg group-hover:shadow-premium-xl transition-all group-hover:scale-110",
                      step.gradient
                    )}>
                      <step.icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-foreground text-background text-sm font-bold flex items-center justify-center shadow-lg">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-headline font-bold mb-3">{t(step.titleKey)}</h3>
                  <p className="text-muted-foreground">{t(step.textKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Most Downloaded Section - Premium Gallery */}
      <section className="w-full bg-background relative">
        <div className="absolute inset-0 bg-dot-pattern opacity-20" />
        <div className="container relative mx-auto px-4 py-20 md:py-28">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-6 px-4 py-2">
              <TrendingUp className="w-4 h-4 mr-2" />
              Trending Now
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold font-headline">{t('home.mostDownloaded.title')}</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {mostDownloaded.map((video, i) => (
              <Card key={i} className="overflow-hidden group relative border-0 shadow-premium-lg hover:shadow-premium-xl transition-all duration-500 hover:-translate-y-2">
                <div className="aspect-[9/16] relative">
                  <img 
                    src={video.imageUrl} 
                    alt={t(video.captionKey)} 
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" 
                    data-ai-hint={video.aiHint}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Play className="w-8 h-8 text-white fill-white" />
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <p className="font-bold text-sm flex items-center gap-1">
                    {video.username}
                    <Verified className="w-4 h-4 text-primary" />
                  </p>
                  <p className="text-xs text-white/80">{t(video.captionKey)}</p>
                </div>
                <Badge 
                  variant={video.badgeVariant as any} 
                  className={cn(
                    "absolute top-3 right-3 shadow-lg",
                    video.badgeVariant === 'default' && "bg-gradient-to-r from-primary to-accent border-0"
                  )}
                >
                  {t(video.badgeKey)}
                </Badge>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Premium Cards */}
      <section className="w-full relative">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-background" />
        <div className="container relative mx-auto px-4 py-20 md:py-28">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-6 px-4 py-2">
              <Star className="w-4 h-4 mr-2 fill-current" />
              Loved by Creators
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold font-headline">{t('home.testimonials.title')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, i) => (
              <Card key={i} className="glass border-0 shadow-premium-lg hover:shadow-premium-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
                <CardContent className="relative pt-8 pb-6">
                  <div className="flex items-center mb-6">
                    <div className="relative">
                      <Avatar className="w-14 h-14 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
                        <AvatarImage src={testimonial.avatarUrl} alt={t('home.testimonials.userAvatarAlt', { name: testimonial.name })} data-ai-hint="user portrait" />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-lg">{testimonial.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <Verified className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="font-bold text-lg">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex text-accent mb-4 gap-0.5">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-lg leading-relaxed italic">"{t(testimonial.reviewKey)}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full relative py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10" />
        <div className="absolute inset-0 bg-dot-pattern opacity-20" />
        <div className="container relative mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold font-headline mb-6">
              Ready to <span className="text-gradient">Download</span> Your Favorite TikToks?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join over 500,000 creators who trust Tiklink for their video downloads. No watermarks, no hassle.
            </p>
            <Button 
              onClick={handleScrollToTop} 
              size="lg" 
              className="gap-3 px-10 py-7 text-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-premium-xl hover:shadow-xl transition-all hover:-translate-y-1 animate-pulse-glow"
            >
              Start Downloading Free
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 glass border-t md:hidden z-50">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <p className="text-sm font-semibold text-foreground truncate">{t('home.stickyCta.text')}</p>
          </div>
          <Button onClick={handleScrollToTop} className="bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold shadow-lg flex-shrink-0 gap-2">
            {t('home.stickyCta.button')}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
