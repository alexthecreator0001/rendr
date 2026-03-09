"use client";

import { useState } from "react";
import { Play } from "lucide-react";

export function VideoPlayer() {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="mx-auto mt-8 max-w-4xl">
      <div className="rounded-2xl bg-gradient-to-b from-emerald-500/20 via-blue-500/10 to-transparent p-[1px]">
        <div className="overflow-hidden rounded-2xl bg-zinc-950">
          <div className="relative w-full" style={{ padding: "53.68% 0 0 0" }}>
            {playing ? (
              <iframe
                src="https://player.vimeo.com/video/1171857006?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&title=0&byline=0&portrait=0"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                className="absolute top-0 left-0 h-full w-full"
                title="How Google Sheets to PDF works"
              />
            ) : (
              <button
                onClick={() => setPlaying(true)}
                className="absolute inset-0 flex items-center justify-center bg-zinc-900 group cursor-pointer"
              >
                <img
                  src="/sheets-video-thumb.jpg"
                  alt="Convert Google Sheets to PDFs in seconds"
                  className="absolute inset-0 h-full w-full object-cover opacity-80 transition-opacity duration-300 group-hover:opacity-100"
                />
                {/* Play button */}
                <div className="relative z-10 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm border border-white/20 transition-all duration-300 group-hover:scale-110 group-hover:bg-white/25">
                  <Play className="h-7 w-7 sm:h-8 sm:w-8 text-white fill-white ml-1" />
                </div>
                <span className="absolute bottom-4 sm:bottom-6 text-xs sm:text-sm font-medium text-white/60 group-hover:text-white/80 transition-colors">
                  Watch demo — 2 min
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
