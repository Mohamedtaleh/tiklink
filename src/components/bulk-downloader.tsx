"use client";

import { useState, useCallback, useRef } from "react";
import { Download, CheckCircle2, XCircle, Loader2, PackageOpen, Layers, Archive } from "lucide-react";
import JSZip from "jszip";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

const MAX_VIDEOS = 10;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const isTikTokUrl = (s: string) =>
  /tiktok\.com\/.+\/video\/|vm\.tiktok\.com\/|vt\.tiktok\.com\//.test(s.trim());

type BulkStatus = "pending" | "loading" | "success" | "error";

interface BulkVideo {
  url: string;
  status: BulkStatus;
  downloadUrl?: string;
  audioUrl?: string;
  cover?: string;
  title?: string;
  author?: string;
  duration?: number;
}

function StatusBadge({
  status,
  labels,
}: {
  status: BulkStatus;
  labels: { fetching: string; ready: string; failed: string; waiting: string };
}) {
  if (status === "loading")
    return (
      <span className="flex items-center gap-1 text-[11px] font-medium text-primary uppercase tracking-wide">
        <Loader2 className="h-3 w-3 animate-spin" />
        {labels.fetching}
      </span>
    );
  if (status === "success")
    return (
      <span className="flex items-center gap-1 text-[11px] font-medium text-success uppercase tracking-wide">
        <CheckCircle2 className="h-3 w-3" />
        {labels.ready}
      </span>
    );
  if (status === "error")
    return (
      <span className="flex items-center gap-1 text-[11px] font-medium text-destructive uppercase tracking-wide">
        <XCircle className="h-3 w-3" />
        {labels.failed}
      </span>
    );
  return (
    <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
      {labels.waiting}
    </span>
  );
}

function VideoCard({
  item,
  index,
  onDownload,
  saveLabel,
  statusLabels,
}: {
  item: BulkVideo;
  index: number;
  onDownload: (item: BulkVideo) => void;
  saveLabel: string;
  statusLabels: { fetching: string; ready: string; failed: string; waiting: string };
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-surface transition-colors">
      <div className="w-12 h-16 rounded-lg bg-surface-2 overflow-hidden shrink-0 flex items-center justify-center">
        {item.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.cover} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-muted-foreground text-xl">▶</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate leading-snug">
          {item.title || item.url}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[11px] text-muted-foreground">#{index + 1}</span>
          {item.author && (
            <span className="text-[11px] text-muted-foreground">@{item.author}</span>
          )}
          {item.duration && (
            <span className="text-[11px] text-muted-foreground">{item.duration}s</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <StatusBadge status={item.status} labels={statusLabels} />
        {item.status === "success" && item.downloadUrl && (
          <Button size="sm" onClick={() => onDownload(item)} className="h-8 px-3 text-xs">
            <Download className="h-3 w-3 mr-1" />
            {saveLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

export function BulkDownloader() {
  const { t } = useI18n();

  const [input, setInput] = useState("");
  const [videos, setVideos] = useState<BulkVideo[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const abortRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [zipping, setZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState({ done: 0, total: 0 });

  const limit = MAX_VIDEOS;

  const parsedUrls = input
    .split("\n")
    .map((l) => l.trim())
    .filter(isTikTokUrl);

  const urlCount = parsedUrls.length;
  const readyCount = videos.filter((v) => v.status === "success").length;
  const errorCount = videos.filter((v) => v.status === "error").length;
  const isOverLimit = urlCount > limit;

  const statusLabels = {
    fetching: t("bulk.statusFetching"),
    ready: t("bulk.statusReady"),
    failed: t("bulk.statusFailed"),
    waiting: t("bulk.statusWaiting"),
  };

  const setVideoStatus = (index: number, status: BulkStatus, data?: Partial<BulkVideo>) => {
    setVideos((prev) => prev.map((v, i) => (i === index ? { ...v, status, ...data } : v)));
  };

  const proxyUrl = (url: string, filename: string) =>
    `/api/download-proxy?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;

  const downloadSingle = (item: BulkVideo) => {
    if (!item.downloadUrl) return;
    const filename = `tiklink_${item.author || "video"}_${Date.now()}.mp4`;
    const a = document.createElement("a");
    a.href = proxyUrl(item.downloadUrl, filename);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadAll = async () => {
    const ready = videos.filter((v) => v.status === "success" && v.downloadUrl);
    if (ready.length === 0) return;

    setZipping(true);
    setZipProgress({ done: 0, total: ready.length });

    const zip = new JSZip();
    for (let i = 0; i < ready.length; i++) {
      const item = ready[i];
      const filename = `tiklink_${item.author || "video"}_${i + 1}.mp4`;
      try {
        const res = await fetch(proxyUrl(item.downloadUrl!, filename));
        if (res.ok) zip.file(filename, await res.blob());
      } catch {
        // skip failed, continue
      }
      setZipProgress({ done: i + 1, total: ready.length });
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(zipBlob);
    a.download = `tiklink_bulk_${Date.now()}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);

    setZipping(false);
    setZipProgress({ done: 0, total: 0 });
  };

  const handleStop = useCallback(() => {
    abortRef.current = true;
    abortControllerRef.current?.abort();
    setProcessing(false);
  }, []);

  const handleProcess = useCallback(async () => {
    const urls = parsedUrls.slice(0, limit);
    if (urls.length === 0) return;

    abortRef.current = false;
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setProcessing(true);
    setProgress({ done: 0, total: urls.length });
    setVideos(urls.map((url) => ({ url, status: "pending" as BulkStatus })));

    for (let i = 0; i < urls.length; i++) {
      if (abortRef.current) break;
      setVideoStatus(i, "loading");

      try {
        const res = await fetch("/api/bulk-resolve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: urls[i] }),
          signal: controller.signal,
        });
        const data = await res.json();
        if (!res.ok || !data.downloadUrl) throw new Error(data.error || "Failed");
        setVideoStatus(i, "success", {
          downloadUrl: data.downloadUrl,
          audioUrl: data.audioUrl,
          cover: data.cover,
          title: data.title,
          author: data.author,
          duration: data.duration,
        });
      } catch (e) {
        if ((e as Error)?.name === "AbortError") break;
        setVideoStatus(i, "error");
      }

      setProgress((p) => ({ ...p, done: i + 1 }));
      if (i < urls.length - 1) await sleep(600);
    }

    setProcessing(false);
  }, [parsedUrls, limit]);

  const countToProcess = Math.min(urlCount, limit);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Input card */}
      <div className="rounded-xl bg-surface border border-border p-5 mb-4">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("bulk.placeholder")}
          rows={6}
          disabled={processing}
          className="font-mono text-sm resize-none bg-surface-2 border-border focus-visible:ring-primary/20"
        />

        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-muted-foreground">
            <span className={cn(isOverLimit && "text-amber-500 font-medium")}>{urlCount}</span>{" "}
            {urlCount === 1 ? t("bulk.urlDetected") : t("bulk.urlsDetected")}
            {isOverLimit && ` — ${t("bulk.overLimit").replace("{{limit}}", String(limit))}`}
          </span>
          <span className="text-xs text-muted-foreground">
            {t("bulk.maxPerZip").replace("{{max}}", String(MAX_VIDEOS))}
          </span>
        </div>

        <Button
          onClick={processing ? handleStop : handleProcess}
          disabled={!processing && urlCount === 0}
          variant={processing ? "destructive" : "default"}
          className="w-full mt-4 h-11 text-sm font-semibold"
        >
          {processing ? (
            `■  ${t("bulk.stopBtn")}`
          ) : (
            <>
              <Layers className="h-4 w-4 mr-2" />
              {urlCount > 0
                ? `${t("bulk.processBtn")} (${countToProcess})`
                : t("bulk.processBtn")}
            </>
          )}
        </Button>
      </div>

      {/* Progress bar */}
      {progress.total > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>
              {processing ? t("bulk.processing") : t("bulk.complete")} — {progress.done}/{progress.total}
            </span>
            <span>
              {readyCount} {t("bulk.ready")}
              {errorCount > 0 && ` · ${errorCount} ${t("bulk.failed")}`}
            </span>
          </div>
          <Progress value={(progress.done / progress.total) * 100} className="h-1" />
        </div>
      )}

      {/* Download All → ZIP */}
      {readyCount > 1 && !processing && (
        <Button
          onClick={downloadAll}
          disabled={zipping}
          variant="outline"
          className="w-full mb-4 h-11 text-sm font-semibold border-success/50 text-success hover:bg-success/10 hover:border-success disabled:opacity-60"
        >
          {zipping ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {t("bulk.buildingZip")} {zipProgress.done}/{zipProgress.total}
            </>
          ) : (
            <>
              <Archive className="h-4 w-4 mr-2" />
              {t("bulk.downloadAllZip").replace("{{count}}", String(readyCount))}
            </>
          )}
        </Button>
      )}

      {/* Video list or empty state */}
      {videos.length > 0 ? (
        <div className="flex flex-col gap-2">
          {videos.map((item, i) => (
            <VideoCard
              key={i}
              item={item}
              index={i}
              onDownload={downloadSingle}
              saveLabel={t("bulk.saveBtn")}
              statusLabels={statusLabels}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
          <PackageOpen className="h-10 w-10 mb-4 opacity-30" />
          <p className="text-sm font-medium mb-1">{t("bulk.emptyTitle")}</p>
          <p className="text-xs opacity-70">
            {t("bulk.emptyDesc").replace("{{max}}", String(MAX_VIDEOS))}
          </p>
        </div>
      )}
    </div>
  );
}
