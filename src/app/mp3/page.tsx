import type { Metadata } from "next";
import { VideoDownloaderForm } from "@/components/video-downloader-form";

export const metadata: Metadata = {
  title: "Video to MP3 Converter — Extract Audio Free | Tiklink",
  description: "Extract audio from TikTok, Instagram, YouTube, and other videos. Convert any video to MP3 for free. No signup required.",
  alternates: { canonical: "/mp3" },
  openGraph: {
    title: "Video to MP3 Converter — Extract Audio Free | Tiklink",
    description: "Extract audio from TikTok, Instagram, YouTube, and other videos. Convert any video to MP3 for free.",
    url: "/mp3",
  },
};

export default function MP3Page() {
  return (
    <div className="flex flex-col">
      <section className="relative flex flex-col items-center justify-center px-6 pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="hero-glow" />

        <p className="text-xs font-medium text-primary uppercase tracking-[0.2em] mb-4 animate-fade-in">
          Audio Extractor
        </p>

        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-center max-w-2xl animate-fade-in">
          Video to MP3
        </h1>

        <p className="mt-4 text-base text-muted-foreground text-center max-w-md animate-fade-in-delay-1">
          Extract audio from any social media video. Paste a link and download the audio track.
        </p>

        <div className="w-full mt-10 animate-fade-in-delay-2">
          <VideoDownloaderForm placeholder="Paste a video link to extract audio..." audioOnly />
        </div>
      </section>

      {/* Info section */}
      <section className="px-6 py-16 md:py-24 border-t border-border">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-center mb-10">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: "1", title: "Paste", desc: "Copy any video URL from TikTok, Instagram, YouTube, or Twitter" },
              { n: "2", title: "Extract", desc: "We extract the audio track from the video automatically" },
              { n: "3", title: "Download", desc: "Click Download Audio to save the MP3 to your device" },
            ].map((step) => (
              <div key={step.n} className="text-center">
                <span className="inline-block text-3xl font-semibold text-primary mb-3">{step.n}</span>
                <h3 className="text-base font-medium mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
