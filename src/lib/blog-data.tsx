import type { ReactNode } from "react";

export interface BlogPost {
  id: string;
  slug: string;
  imageUrl: string;
  aiHint: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "guide",
    slug: "/blog/ultimate-guide-downloading-tiktok",
    imageUrl: "https://images.unsplash.com/photo-1584433144859-1fc3ab64a957?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    aiHint: "guide book",
  },
  {
    id: "watermarks",
    slug: "/blog/why-remove-watermarks",
    imageUrl: "https://images.pexels.com/photos/7174413/pexels-photo-7174413.jpeg",
    aiHint: "video creator",
  },
  {
    id: "repurposing",
    slug: "/blog/repurposing-tiktok-content",
    imageUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    aiHint: "social media",
  },
  {
    id: "viral-secrets",
    slug: "/blog/viral-secrets-tiktok-algorithm",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    aiHint: "viral trending",
  },
  {
    id: "tiktok-marketing",
    slug: "/blog/tiktok-marketing-strategies-2024",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    aiHint: "marketing strategy",
  },
  {
    id: "monetization",
    slug: "/blog/how-to-monetize-tiktok",
    imageUrl: "https://images.unsplash.com/photo-1553729459-uj8n9e7e3e4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    aiHint: "money earnings",
  },
  {
    id: "hashtag-strategy",
    slug: "/blog/hashtag-strategy-for-growth",
    imageUrl: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    aiHint: "hashtag trending",
  },
  {
    id: "content-ideas",
    slug: "/blog/tiktok-content-ideas-any-niche",
    imageUrl: "https://images.unsplash.com/photo-1542744094-3a31f272c490?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    aiHint: "creative ideas",
  },
  {
    id: "best-tools",
    slug: "/blog/best-tools-for-tiktok-creators",
    imageUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    aiHint: "tools apps",
  },
];
