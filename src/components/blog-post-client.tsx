"use client";

import { type BlogPost, blogPosts } from '@/lib/blog-data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useI18n } from '@/hooks/use-i18n';
import { dictionaries } from '@/locales';
import Script from 'next/script';
import { cn } from '@/lib/utils';

export function BlogPostClient({ post }: { post: BlogPost }) {
  const { t, locale } = useI18n();

  const dictionary = dictionaries[locale] || dictionaries.en;
  const translatedPost = (dictionary.blog.posts as any)[post.id];

  if (!translatedPost) {
    notFound();
  }

  const relatedPosts = blogPosts.filter(p => p.slug !== post.slug).slice(0, 3);

  // Premium structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.tiklink.ink${post.slug}`,
    },
    headline: translatedPost.title,
    description: translatedPost.description,
    image: {
      '@type': 'ImageObject',
      url: post.imageUrl,
      width: 1200,
      height: 630,
    },
    author: {
      '@type': 'Organization',
      name: 'Tiklink',
      url: 'https://www.tiklink.ink',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Tiklink',
      url: 'https://www.tiklink.ink',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.tiklink.ink/og-image.png',
        width: 1200,
        height: 630,
      },
    },
    datePublished: '2025-01-15T00:00:00.000Z',
    dateModified: new Date().toISOString(),
    inLanguage: locale,
  };

  // BreadcrumbList structured data
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.tiklink.ink',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://www.tiklink.ink/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: translatedPost.title,
        item: `https://www.tiklink.ink${post.slug}`,
      },
    ],
  };

  return (
    <>
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <article className="flex flex-col">
        {/* Hero image */}
        <div className="relative w-full aspect-[21/9] max-h-[400px] bg-surface-2">
          <Image
            src={post.imageUrl}
            alt={translatedPost.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative px-6 -mt-20 md:-mt-28">
          <div className="mx-auto max-w-3xl">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-foreground transition-colors">{t('blog.title')}</Link>
              <span>/</span>
              <span className="text-foreground truncate max-w-[200px]">{translatedPost.title}</span>
            </nav>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight">
              {translatedPost.title}
            </h1>

            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              {translatedPost.description}
            </p>

            <div className="flex items-center gap-3 mt-6 pb-8 border-b border-border">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">T</span>
              </div>
              <div>
                <p className="text-sm font-medium">Tiklink Team</p>
                <p className="text-xs text-muted-foreground">Content Creator Tools</p>
              </div>
            </div>

            {/* Article body */}
            <div className="mt-10 space-y-6">
              {translatedPost.content.map((block: any, index: number) => {
                switch (block.type) {
                  case 'h2':
                    return (
                      <h2 key={index} className="text-2xl md:text-3xl font-semibold tracking-tight mt-12 mb-4">
                        {block.text}
                      </h2>
                    );
                  case 'p':
                    return (
                      <p key={index} className="text-base text-muted-foreground leading-[1.8]">
                        {block.text}
                      </p>
                    );
                  case 'blockquote':
                    return (
                      <blockquote key={index} className="border-l-2 border-primary pl-5 py-1 my-6 text-base italic text-muted-foreground">
                        {block.text}
                      </blockquote>
                    );
                  case 'ul':
                    return (
                      <ul key={index} className="space-y-2 my-4">
                        {block.items.map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-2.5 text-base text-muted-foreground leading-[1.8]">
                            <span className="mt-2.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    );
                  case 'ol':
                    return (
                      <ol key={index} className="space-y-2 my-4 counter-reset-list">
                        {block.items.map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-2.5 text-base text-muted-foreground leading-[1.8]">
                            <span className="mt-0.5 text-sm font-semibold text-primary shrink-0 w-5">
                              {i + 1}.
                            </span>
                            {item}
                          </li>
                        ))}
                      </ol>
                    );
                  default:
                    return null;
                }
              })}
            </div>

            {/* CTA */}
            <div className="mt-16 p-6 rounded-xl bg-surface border border-border text-center">
              <h3 className="text-lg font-semibold mb-2">Ready to download videos?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Download TikTok, Instagram, and more — no watermark, no signup.
              </p>
              <Link
                href="/"
                className={cn(
                  "inline-flex items-center gap-2 h-10 px-6 rounded-lg text-sm font-medium",
                  "bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                )}
              >
                Try Tiklink Free
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Related articles */}
            <div className="mt-16 pt-10 border-t border-border">
              <h2 className="text-xl font-semibold mb-6">{t('blog.relatedArticles')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedPosts.map(related => {
                  const relatedTranslated = (dictionary.blog.posts as any)[related.id];
                  if (!relatedTranslated) return null;
                  return (
                    <Link
                      href={related.slug}
                      key={related.slug}
                      className="group block rounded-xl overflow-hidden bg-surface border border-border hover:border-border-hover transition-all duration-200"
                    >
                      <div className="relative aspect-[16/10] bg-surface-2">
                        <Image
                          src={related.imageUrl}
                          alt={relatedTranslated.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                          {relatedTranslated.title}
                        </h4>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Back to blog */}
            <div className="mt-10 pb-16">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                {t('blog.backToBlog')}
              </Link>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
