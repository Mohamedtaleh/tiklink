// src/app/blog/[slug]/page.tsx
import { blogPosts } from '@/lib/blog-data';
import { notFound } from 'next/navigation';
import { dictionaries } from '@/locales';
import type { Metadata } from 'next';
import { BlogPostClient } from '@/components/blog-post-client';

// This function generates the metadata for the page
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = blogPosts.find((p) => p.slug.endsWith(params.slug));

  if (!post) {
    return {};
  }
  
  // Use English dictionary as the canonical source for metadata
  const dictionary = dictionaries.en;
  const translatedPost = (dictionary.blog.posts as any)[post.id];

  const metadata: Metadata = {
    title: `${translatedPost.title} | Tiklink Blog`,
    description: translatedPost.description,
    alternates: {
      canonical: `/blog/${params.slug}`,
    },
    openGraph: {
      title: `${translatedPost.title} | Tiklink Blog`,
      description: translatedPost.description,
      url: `/blog/${params.slug}`,
      type: 'article',
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
      title: `${translatedPost.title} | Tiklink Blog`,
      description: translatedPost.description,
      images: [post.imageUrl],
    },
  };

  return metadata;
}

// Main Page Component (Server Component Wrapper)
export default function BlogPostPage({ params }: { params: { slug: string }}) {
    const postSlug = params.slug;
    const post = blogPosts.find((p) => p.slug.endsWith(postSlug));

    if (!post) {
        notFound();
    }
    
    // This is now a client component imported from another file
    return <BlogPostClient post={post} />;
}
