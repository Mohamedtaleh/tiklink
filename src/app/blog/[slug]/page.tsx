import { blogPosts } from '@/lib/blog-data';
import { notFound } from 'next/navigation';
import { dictionaries } from '@/locales';
import type { Metadata } from 'next';
import { BlogPostClient } from '@/components/blog-post-client';

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug.replace('/blog/', ''),
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = blogPosts.find((p) => p.slug.endsWith(params.slug));
  if (!post) return {};

  const dictionary = dictionaries.en;
  const translatedPost = (dictionary.blog.posts as any)[post.id];

  return {
    title: `${translatedPost.title} | Tiklink Blog`,
    description: translatedPost.description,
    alternates: {
      canonical: `https://tiklink.ink/blog/${params.slug}`,
    },
    openGraph: {
      title: translatedPost.title,
      description: translatedPost.description,
      url: `https://tiklink.ink/blog/${params.slug}`,
      siteName: 'Tiklink',
      type: 'article',
      publishedTime: '2025-01-15T00:00:00.000Z',
      modifiedTime: new Date().toISOString(),
      authors: ['Tiklink Team'],
      images: [
        {
          url: post.imageUrl,
          width: 1200,
          height: 630,
          alt: translatedPost.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: translatedPost.title,
      description: translatedPost.description,
      images: [post.imageUrl],
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug.endsWith(params.slug));

  if (!post) {
    notFound();
  }

  return <BlogPostClient post={post} />;
}
