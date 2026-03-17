"use client";

import { useState } from "react";
import { Link2, HardDrive } from "lucide-react";
import { VideoDownloaderForm } from "@/components/video-downloader-form";
import { LocalMp3Converter } from "@/components/local-mp3-converter";
import { cn } from "@/lib/utils";

type Tab = "url" | "file";

export function Mp3PageClient() {
  const [tab, setTab] = useState<Tab>("url");

  return (
    <div className="flex flex-col">
      <section className="relative flex flex-col items-center justify-center px-6 pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="hero-glow" />

        <p className="text-xs font-medium text-primary uppercase tracking-[0.2em] mb-4">
          Audio Extractor
        </p>

        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-center max-w-2xl">
          Video to MP3
        </h1>

        <p className="mt-4 text-base text-muted-foreground text-center max-w-md">
          Extract audio from social media videos or convert any video file from your device.
        </p>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 mt-8 p-1 rounded-xl bg-surface border border-border">
          <button
            onClick={() => setTab("url")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150",
              tab === "url"
                ? "bg-background text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Link2 className="h-3.5 w-3.5" />
            Paste a link
          </button>
          <button
            onClick={() => setTab("file")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150",
              tab === "file"
                ? "bg-background text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <HardDrive className="h-3.5 w-3.5" />
            Upload a file
          </button>
        </div>

        <div className="w-full mt-6">
          {tab === "url" ? (
            <VideoDownloaderForm
              placeholder="Paste a TikTok, Instagram, X or Facebook link…"
              audioOnly
            />
          ) : (
            <LocalMp3Converter />
          )}
        </div>

        {/* Platform support note — only shown in URL tab */}
        {tab === "url" && (
          <p className="mt-4 text-xs text-muted-foreground">
            TikTok · Instagram · X · Facebook
          </p>
        )}

        {tab === "file" && (
          <p className="mt-4 text-xs text-muted-foreground">
            Converted entirely in your browser — nothing is uploaded to our servers
          </p>
        )}
      </section>

      {/* How it works */}
      <section className="px-6 py-16 md:py-24 border-t border-border">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-center mb-10">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(tab === "url"
              ? [
                  { n: "1", title: "Paste", desc: "Copy any video URL from TikTok, Instagram, X, or Facebook" },
                  { n: "2", title: "Extract", desc: "We extract the audio track from the video automatically" },
                  { n: "3", title: "Download", desc: "Click Download Audio to save the MP3 to your device" },
                ]
              : [
                  { n: "1", title: "Upload", desc: "Drop any MP4, MOV, AVI, MKV or WEBM file from your device" },
                  { n: "2", title: "Convert", desc: "Audio is extracted and encoded to MP3 directly in your browser" },
                  { n: "3", title: "Download", desc: "Your MP3 downloads automatically when conversion is done" },
                ]
            ).map((step) => (
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
