import type { Metadata } from "next";
import { Mp3PageClient } from "./client";

export const metadata: Metadata = {
  title: "Video to MP3 Converter — Extract Audio Free | Tiklink",
  description:
    "Extract audio from TikTok, Instagram, X, and Facebook videos. Or convert any MP4 file from your device to MP3. Free, no signup required.",
  alternates: { canonical: "https://www.tiklink.ink/mp3" },
  openGraph: {
    title: "Video to MP3 Converter — Extract Audio Free | Tiklink",
    description:
      "Extract audio from TikTok, Instagram, X, and Facebook videos. Or upload an MP4 and convert it to MP3 instantly.",
    url: "https://www.tiklink.ink/mp3",
  },
};

export default function MP3Page() {
  return <Mp3PageClient />;
}
