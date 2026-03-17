"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { blogPosts } from "@/lib/blog-data";
import { useI18n } from "@/hooks/use-i18n";
import { dictionaries } from "@/locales";
import { cn } from "@/lib/utils";

const POSTS_PER_PAGE = 6;

export default function BlogPage() {
  const { t, locale } = useI18n();
  const dictionary = dictionaries[locale] || dictionaries.en;
  const translatedPosts = dictionary.blog.posts;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(blogPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const visiblePosts = blogPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative px-6 pt-20 pb-12 md:pt-28 md:pb-16">
        <div className="hero-glow" />
        <div className="mx-auto max-w-content text-center">
          <p className="text-xs font-medium text-primary uppercase tracking-[0.2em] mb-3 animate-fade-in">
            {t('blog.title')}
          </p>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight animate-fade-in">
            Insights for Creators
          </h1>
          <p className="mt-4 text-base text-muted-foreground max-w-lg mx-auto animate-fade-in-delay-1">
            {t('blog.tagline')}
          </p>
        </div>
      </section>

      {/* Featured post (first post on page 1) */}
      {currentPage === 1 && visiblePosts.length > 0 && (() => {
        const featured = visiblePosts[0];
        const featuredTranslated = (translatedPosts as any)[featured.id];
        return (
          <section className="px-6 pb-12">
            <div className="mx-auto max-w-content">
              <Link href={featured.slug} className="group block">
                <div className="relative rounded-xl overflow-hidden bg-surface border border-border hover:border-border-hover transition-all duration-300">
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="relative aspect-[16/10] md:aspect-auto">
                      <Image
                        src={featured.imageUrl}
                        alt={featuredTranslated?.title || ''}
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                    <div className="flex flex-col justify-center p-6 md:p-10">
                      <span className="text-[10px] font-medium text-primary uppercase tracking-widest mb-3">
                        Featured
                      </span>
                      <h2 className="text-xl md:text-2xl font-semibold tracking-tight group-hover:text-primary transition-colors">
                        {featuredTranslated?.title}
                      </h2>
                      <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {featuredTranslated?.description}
                      </p>
                      <span className="inline-flex items-center gap-1.5 mt-5 text-sm font-medium text-primary">
                        Read article
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        );
      })()}

      {/* Blog grid */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-content">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(currentPage === 1 ? visiblePosts.slice(1) : visiblePosts).map((post) => {
              const translatedPost = (translatedPosts as any)[post.id];
              if (!translatedPost) return null;
              return (
                <Link
                  key={post.slug}
                  href={post.slug}
                  className="group block rounded-xl overflow-hidden bg-surface border border-border hover:border-border-hover transition-all duration-200"
                >
                  <div className="relative aspect-[16/10] bg-surface-2">
                    <Image
                      src={post.imageUrl}
                      alt={translatedPost.title}
                      fill
                      className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-medium tracking-tight line-clamp-2 group-hover:text-primary transition-colors">
                      {translatedPost.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {translatedPost.description}
                    </p>
                    <span className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-primary">
                      {t('blog.readMore')}
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="flex items-center justify-center gap-2 mt-12" aria-label="Blog pagination">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={cn(
                  "flex items-center justify-center h-9 w-9 rounded-lg text-sm",
                  "border border-border hover:bg-surface-2 transition-colors",
                  "disabled:opacity-30 disabled:cursor-not-allowed"
                )}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    "flex items-center justify-center h-9 w-9 rounded-lg text-sm font-medium transition-colors",
                    page === currentPage
                      ? "bg-primary text-primary-foreground"
                      : "border border-border hover:bg-surface-2"
                  )}
                  aria-label={`Page ${page}`}
                  aria-current={page === currentPage ? "page" : undefined}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={cn(
                  "flex items-center justify-center h-9 w-9 rounded-lg text-sm",
                  "border border-border hover:bg-surface-2 transition-colors",
                  "disabled:opacity-30 disabled:cursor-not-allowed"
                )}
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </nav>
          )}
        </div>
      </section>
    </div>
  );
}
