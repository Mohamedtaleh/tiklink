// src/components/blog-post-client.tsx
"use client";

import { type BlogPost, blogPosts } from '@/lib/blog-data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/hooks/use-i18n';
import { dictionaries } from '@/locales';
import Script from 'next/script';

export function BlogPostClient({ post }: { post: BlogPost }) {
  const { t, locale } = useI18n();
  
  // Get translated content
  const dictionary = dictionaries[locale] || dictionaries.en;
  const translatedPost = (dictionary.blog.posts as any)[post.id];

  if (!translatedPost) {
    notFound();
  }

  const relatedPosts = blogPosts.filter(p => p.slug !== post.slug).slice(0, 2);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://tiklink.com${post.slug}`,
    },
    headline: translatedPost.title,
    description: translatedPost.description,
    image: post.imageUrl,
    author: {
      '@type': 'Organization',
      name: 'Tiklink',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Tiklink',
      logo: {
        '@type': 'ImageObject',
        url: 'https://tiklink.com/og-image.png',
      },
    },
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
  };

  return (
    <>
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="container mx-auto px-4 py-12 md:py-20">
        <header className="mb-12 text-center max-w-4xl mx-auto">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-8 shadow-2xl shadow-primary/10">
            <Image
              src={post.imageUrl}
              alt={translatedPost.title}
              fill
              className="object-cover"
              priority
              data-ai-hint={post.aiHint}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4 tracking-tight">{translatedPost.title}</h1>
          <p className="text-lg text-muted-foreground">{translatedPost.description}</p>
        </header>

        <div className="prose prose-lg dark:prose-invert max-w-3xl mx-auto prose-h2:font-headline prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-12 prose-h3:font-headline prose-h3:text-2xl prose-p:text-muted-foreground prose-a:text-primary hover:prose-a:underline prose-strong:text-foreground prose-blockquote:border-primary prose-blockquote:text-muted-foreground">
          {translatedPost.content.map((block: any, index: number) => {
            switch (block.type) {
              case 'h2':
                return <h2 key={index}>{block.text}</h2>;
              case 'p':
                return <p key={index}>{block.text}</p>;
              case 'blockquote':
                return <blockquote key={index}>{block.text}</blockquote>;
              case 'ul':
                return (
                  <ul key={index}>
                    {block.items.map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                );
              case 'ol':
                  return (
                      <ol key={index}>
                      {block.items.map((item: string, i: number) => (
                          <li key={i}>{item}</li>
                      ))}
                      </ol>
                  );
              default:
                return null;
            }
          })}
        </div>
        
        <div className="max-w-3xl mx-auto mt-16">
          <Card>
              <CardHeader>
                  <CardTitle className="font-headline text-2xl">{t('blog.relatedArticles')}</CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {relatedPosts.map(related => {
                          const relatedTranslated = (dictionary.blog.posts as any)[related.id];
                          return (
                              <Link href={related.slug} key={related.slug} className="group">
                                  <div className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                                      <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                                          <Image src={related.imageUrl} alt={relatedTranslated.title} fill className="object-cover" data-ai-hint={related.aiHint} />
                                      </div>
                                      <div>
                                          <h4 className="font-bold font-headline text-md group-hover:text-primary transition-colors">{relatedTranslated.title}</h4>
                                          <p className="text-sm text-muted-foreground line-clamp-2">{relatedTranslated.description}</p>
                                      </div>
                                  </div>
                              </Link>
                          )
                      })}
                  </div>
              </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <Button asChild>
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('blog.backToBlog')}
            </Link>
          </Button>
        </div>
      </article>
    </>
  );
}
