"use client";

import { useEffect, useRef } from "react";

const ASCII_ART = [
  "                                                                                                                                                     $$$$$$$$$                        ",
  "$$$$$$$$$$$$$$$$$$$$$$$$$    $$$$$$$$$$$$$$$$$$$$$$$                                                                                                 $$$$$$$$$                        ",
  "$$$$$$$$$$$$$$$$$$$$$$$$$    $$$$$$$$$$$$$$$$$$$$$$$$$                                                                                               $$$$$$$$$                        ",
  "$$$$$$$$$$$$$$$$$$$$$$$$$    $$$$$$$$$$$$$$$$$$$$$$$$$$$                                                                                             $$$$$$$$$                        ",
  "$$$$$$$$$$$$$$$$$$$$$$$$$    $$$$$$$$$$$$$$$$$$$$$$$$$$$$$                                                                                           $$$$$$$$$                        ",
  "$$$$$$$$$$$$$$$$$$$$$$$$$    $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$                                                                                          $$$$$$$$$                        ",
  "$$$$$$$$$$$$$$$$$$$$$$$$$    $$$$$$$$$           $$$$$$$$$$$                                                                                         $$$$$$$$$                        ",
  "$$$$$$$$$$$$$$$$$$$$$$$$$    $$$$$$$$$            $$$$$$$$$$              $$$$$$                                                                     $$$$$$$$$                        ",
  "$$$$$$$$$$$$$$$$$$$$$$$$$    $$$$$$$$$             $$$$$$$$$         $$$$$$$$$$$$$$$$          $$$$$$$$  $$$$$$$$$$$$$               $$$$$$$$$$$$$$  $$$$$$$$$     $$$$$$$$   $$$$$$$$",
  "            $$$$$$$$$$$$$    $$$$$$$$$             $$$$$$$$$      $$$$$$$$$$$$$$$$$$$$$        $$$$$$$$$$$$$$$$$$$$$$$$$           $$$$$$$$$$$$$$$$$$$$$$$$$$$     $$$$$$$$$$$$$$$$$$$",
  "            $$$$$$$$$$$$$    $$$$$$$$$            $$$$$$$$$$    $$$$$$$$$$$$$$$$$$$$$$$$$      $$$$$$$$$$$$$$$$$$$$$$$$$$$       $$$$$$$$$$$$$$$$$$$$$$$$$$$$$     $$$$$$$$$$$$$$$$$$$",
  "            $$$$$$$$$$$$$    $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$    $$$$$$$$$$$      $$$$$$$$$$     $$$$$$$$$$$$$$$$$$$$$$$$$$$$     $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$     $$$$$$$$$$$$$$$$$$$",
  "            $$$$$$$$$$$$$    $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$    $$$$$$$$$         $$$$$$$$$     $$$$$$$$$$$$     $$$$$$$$$$$     $$$$$$$$$$$$     $$$$$$$$$$$$$     $$$$$$$$$$$$$$  $$$",
  "            $$$$$$$$$$$$$    $$$$$$$$$$$$$$$$$$$$$$$$$$$$     $$$$$$$$$            $$$$$$$$    $$$$$$$$$$         $$$$$$$$$    $$$$$$$$$$          $$$$$$$$$$$     $$$$$$$$$$$        ",
  "            $$$$$$$$$$$$$    $$$$$$$$$$$$$$$$$$$$$$$$$$$      $$$$$$$$$$$$$$$$$$$$$$$$$$$$$    $$$$$$$$$           $$$$$$$$$   $$$$$$$$$             $$$$$$$$$     $$$$$$$$$          ",
  "            $$$$$$$$$$$$$    $$$$$$$$$$$$$$$$$$$$$$$$$        $$$$$$$$$$$$$$$$$$$$$$$$$$$$$    $$$$$$$$            $$$$$$$$$   $$$$$$$$              $$$$$$$$$     $$$$$$$$$          ",
  "                             $$$$$$$$$       $$$$$$$$$$       $$$$$$$$$$$$$$$$$$$$$$$$$$$$$    $$$$$$$$            $$$$$$$$$   $$$$$$$$$             $$$$$$$$$     $$$$$$$$           ",
  "                             $$$$$$$$$       $$$$$$$$$$       $$$$$$$$$$$$$$$$$$$$$$$$$$$$$    $$$$$$$$            $$$$$$$$$   $$$$$$$$$            $$$$$$$$$$     $$$$$$$$           ",
  "                             $$$$$$$$$        $$$$$$$$$$      $$$$$$$$$            $$          $$$$$$$$            $$$$$$$$$   $$$$$$$$$$          $$$$$$$$$$$     $$$$$$$$           ",
  "                             $$$$$$$$$         $$$$$$$$$$      $$$$$$$$$$        $$$$$$        $$$$$$$$            $$$$$$$$$    $$$$$$$$$$$$$  $$$$$$$$$$$$$$$     $$$$$$$$           ",
  "                             $$$$$$$$$          $$$$$$$$$$      $$$$$$$$$$$$$$$$$$$$$$$$$      $$$$$$$$            $$$$$$$$$     $$$$$$$$$$$$$$$$$$$$$$$$$$$$$     $$$$$$$$           ",
  "                             $$$$$$$$$           $$$$$$$$$$       $$$$$$$$$$$$$$$$$$$$$$       $$$$$$$$            $$$$$$$$$      $$$$$$$$$$$$$$$$$$$$$$$$$$$$     $$$$$$$$           ",
  "                             $$$$$$$$$            $$$$$$$$$$       $$$$$$$$$$$$$$$$$$$$        $$$$$$$$            $$$$$$$$$       $$$$$$$$$$$$$$$$$$$$$$$$$$$     $$$$$$$$           ",
  "                             $$$$$$$$$             $$$$$$$$$$        $$$$$$$$$$$$$$$           $$$$$$$$            $$$$$$$$$          $$$$$$$$$$$$$  $$$$$$$$$     $$$$$$$$           ",
];

const SYMBOLS = ["$", "#", "@", "%", "&", "*", "+", "=", "~", "^"];

export function FooterAsciiArt() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const charPositions: { row: number; col: number }[] = [];
    const maxCols = Math.max(...ASCII_ART.map((line) => line.length));

    for (let r = 0; r < ASCII_ART.length; r++) {
      for (let c = 0; c < ASCII_ART[r].length; c++) {
        if (ASCII_ART[r][c] === "$") {
          charPositions.push({ row: r, col: c });
        }
      }
    }

    let fontSize = 10;
    let lineHeight = fontSize * 1.15;
    let charWidth = fontSize * 0.6;

    const resize = () => {
      const w = container.clientWidth;
      // Scale font so the art fills 70% of the container width
      const baseCharWidth = 0.6;
      fontSize = (w * 0.7) / (maxCols * baseCharWidth);
      // Clamp to reasonable range
      fontSize = Math.max(4, Math.min(fontSize, 20));
      lineHeight = fontSize * 1.15;
      charWidth = fontSize * 0.6;

      const artHeight = ASCII_ART.length * lineHeight;
      canvas.width = w;
      canvas.height = artHeight;
      container.style.height = `${artHeight}px`;
    };

    resize();
    window.addEventListener("resize", resize);

    const symbolState = charPositions.map(() => ({
      current: Math.floor(Math.random() * SYMBOLS.length),
      nextChange: Math.random() * 3000,
    }));

    let lastTime = 0;
    let animId: number;

    const draw = (time: number) => {
      const dt = time - lastTime;
      lastTime = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px monospace`;
      ctx.textBaseline = "top";

      const artWidth = maxCols * charWidth;
      const offsetX = (canvas.width - artWidth) / 2;

      for (let i = 0; i < charPositions.length; i++) {
        const pos = charPositions[i];
        const state = symbolState[i];

        state.nextChange -= dt;
        if (state.nextChange <= 0) {
          state.current = (state.current + 1 + Math.floor(Math.random() * (SYMBOLS.length - 1))) % SYMBOLS.length;
          state.nextChange = 1000 + Math.random() * 4000;
        }

        const x = offsetX + pos.col * charWidth;
        const y = pos.row * lineHeight;

        if (x >= -charWidth && x <= canvas.width) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
          ctx.fillText(SYMBOLS[state.current], x, y);
        }
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">
      {/* Top fade so it blends from footer content */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[25%] bg-gradient-to-b from-zinc-950 to-transparent" />
      <canvas
        ref={canvasRef}
        className="block w-full"
        aria-hidden="true"
      />
    </div>
  );
}
