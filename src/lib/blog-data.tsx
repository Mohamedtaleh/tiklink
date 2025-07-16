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
];
