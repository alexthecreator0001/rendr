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

export function AsciiBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Build a map of which positions have a $ character
    const charPositions: { row: number; col: number }[] = [];
    const maxCols = Math.max(...ASCII_ART.map((line) => line.length));

    for (let r = 0; r < ASCII_ART.length; r++) {
      for (let c = 0; c < ASCII_ART[r].length; c++) {
        if (ASCII_ART[r][c] === "$") {
          charPositions.push({ row: r, col: c });
        }
      }
    }

    const fontSize = 18;
    const lineHeight = fontSize * 1.2;
    const charWidth = fontSize * 0.6;

    const artWidth = maxCols * charWidth;
    const artHeight = ASCII_ART.length * lineHeight;

    // Resize canvas to parent
    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    // Each position gets its own symbol index that changes at random intervals
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

      // Center the art horizontally, position near top
      const offsetX = (canvas.width - artWidth) / 2;
      const offsetY = (canvas.height - artHeight) / 2;

      for (let i = 0; i < charPositions.length; i++) {
        const pos = charPositions[i];
        const state = symbolState[i];

        // Countdown to next symbol change
        state.nextChange -= dt;
        if (state.nextChange <= 0) {
          state.current = (state.current + 1 + Math.floor(Math.random() * (SYMBOLS.length - 1))) % SYMBOLS.length;
          state.nextChange = 1000 + Math.random() * 4000; // 1-5s between changes
        }

        const x = offsetX + pos.col * charWidth;
        const y = offsetY + pos.row * lineHeight;

        // Only draw if visible
        if (x >= -charWidth && x <= canvas.width && y >= -lineHeight && y <= canvas.height) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
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
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
