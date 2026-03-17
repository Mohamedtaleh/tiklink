"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, Music, Loader2, Download, X, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "idle" | "decoding" | "encoding" | "done" | "error";

function float32ToInt16(float32: Float32Array): Int16Array {
  const int16 = new Int16Array(float32.length);
  for (let i = 0; i < float32.length; i++) {
    const s = Math.max(-1, Math.min(1, float32[i]));
    int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return int16;
}

export function LocalMp3Converter() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [outputName, setOutputName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (selectedFile: File) => {
    setFile(selectedFile);
    setStatus("decoding");
    setProgress(0);
    setDownloadUrl(null);
    setErrorMsg("");

    const name = selectedFile.name.replace(/\.[^.]+$/, ".mp3");
    setOutputName(name);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();

      const audioCtx = new AudioContext();
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
      await audioCtx.close();

      setStatus("encoding");

      const { Mp3Encoder } = await import("lamejs");
      const channels = audioBuffer.numberOfChannels;
      const sampleRate = audioBuffer.sampleRate;
      const encoder = new Mp3Encoder(channels === 1 ? 1 : 2, sampleRate, 128);

      const BLOCK = 1152;
      const left = float32ToInt16(audioBuffer.getChannelData(0));
      const right = channels > 1 ? float32ToInt16(audioBuffer.getChannelData(1)) : null;

      const mp3Chunks: Uint8Array[] = [];

      for (let i = 0; i < left.length; i += BLOCK) {
        const leftChunk = left.subarray(i, i + BLOCK);
        const rightChunk = right ? right.subarray(i, i + BLOCK) : leftChunk;
        const chunk = right
          ? encoder.encodeBuffer(leftChunk, rightChunk)
          : encoder.encodeBuffer(leftChunk);
        if (chunk.length > 0) mp3Chunks.push(new Uint8Array(chunk));

        // Update progress and yield to UI every 100 blocks
        if (i % (BLOCK * 100) === 0) {
          setProgress(Math.round((i / left.length) * 95));
          await new Promise((r) => setTimeout(r, 0));
        }
      }

      const end = encoder.flush();
      if (end.length > 0) mp3Chunks.push(new Uint8Array(end));

      const mp3Blob = new Blob(mp3Chunks, { type: "audio/mpeg" });
      const url = URL.createObjectURL(mp3Blob);
      setDownloadUrl(url);
      setProgress(100);
      setStatus("done");

      // Auto-trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      a.click();
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Could not read audio from this file."
      );
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) processFile(dropped);
    },
    [processFile]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) processFile(selected);
  };

  const reset = () => {
    setFile(null);
    setStatus("idle");
    setProgress(0);
    setDownloadUrl(null);
    setErrorMsg("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {status === "idle" ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "relative flex flex-col items-center justify-center gap-3",
            "h-40 rounded-xl border-2 border-dashed cursor-pointer",
            "transition-all duration-200",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-surface"
          )}
        >
          <Upload className="h-7 w-7 text-muted-foreground" />
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              Drop a video file here, or <span className="text-primary">browse</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              MP4, MOV, AVI, MKV, WEBM — converted to MP3 in your browser
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="video/*,audio/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <div className="rounded-xl bg-surface border border-border p-6">
          {/* File name + reset */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3 min-w-0">
              <Music className="h-5 w-5 text-primary shrink-0" />
              <span className="text-sm font-medium truncate">{file?.name}</span>
            </div>
            {(status === "done" || status === "error") && (
              <button
                onClick={reset}
                className="text-muted-foreground hover:text-foreground transition-colors ml-3 shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Progress / status */}
          {(status === "decoding" || status === "encoding") && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {status === "decoding" ? "Reading audio track…" : `Converting to MP3… ${progress}%`}
                </span>
              </div>
              <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300 rounded-full"
                  style={{ width: `${status === "decoding" ? 5 : progress}%` }}
                />
              </div>
            </div>
          )}

          {status === "done" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-green-500">
                <CheckCircle className="h-4 w-4" />
                <span>Conversion complete</span>
              </div>
              <a
                href={downloadUrl!}
                download={outputName}
                className={cn(
                  "flex items-center justify-center gap-2 w-full h-10 rounded-lg",
                  "bg-primary text-primary-foreground text-sm font-medium",
                  "hover:opacity-90 transition-opacity"
                )}
              >
                <Download className="h-4 w-4" />
                Download {outputName}
              </a>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-3">
              <p className="text-sm text-destructive">{errorMsg}</p>
              <button
                onClick={reset}
                className="text-sm text-primary hover:underline"
              >
                Try a different file
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
