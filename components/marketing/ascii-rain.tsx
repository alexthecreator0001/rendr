"use client";

import { useEffect, useRef } from "react";

const CHARS = ["0", "1", "·", "·", "·", " ", " ", "0", "1", " "];

export function AsciiRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    let W = 0;
    let H = 0;
    let raf: number;

    type Column = {
      x: number;
      y: number;
      speed: number;
      fontSize: number;
      maxOpacity: number;
      numRows: number;
    };

    let columns: Column[] = [];

    function setup() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);

      columns = [];
      const spacing = 20;
      const numCols = Math.ceil(W / spacing) + 2;

      for (let i = 0; i < numCols; i++) {
        const x = i * spacing;
        const cx = W / 2;
        // 0 at center, 1 at edge
        const d = Math.min(Math.abs(x - cx) / cx, 1);

        columns.push({
          x,
          y: -Math.random() * H * 2,
          speed: 0.2 + (1 - d) * 0.2,
          fontSize: 10 + d * 9,        // 10px at center → 19px at edges
          maxOpacity: 0.06 + d * 0.28, // very dim at center, brighter at edges
          numRows: Math.ceil(H / ((10 + d * 9) * 1.7)) + 4,
        });
      }
    }

    function animate() {
      // Semi-transparent black layer for trail effect
      ctx.fillStyle = "rgba(0,0,0,0.055)";
      ctx.fillRect(0, 0, W, H);

      for (const col of columns) {
        const lineH = col.fontSize * 1.7;

        for (let row = 0; row < col.numRows; row++) {
          let ry = col.y + row * lineH;
          // wrap around
          const span = col.numRows * lineH;
          ry = ((ry % (H + span)) + H + span) % (H + span) - span * 0.3;

          if (ry < -col.fontSize || ry > H + col.fontSize) continue;

          // fade at top and bottom edges
          const yFade = Math.sin(Math.PI * Math.max(0, Math.min(ry / H, 1)));

          // head glow
          const isHead = row === 0;
          const alpha = col.maxOpacity * yFade * (isHead ? 2.8 : 1);
          if (alpha < 0.008) continue;

          ctx.fillStyle = `rgba(255,255,255,${Math.min(alpha, 1)})`;
          ctx.font = `${col.fontSize}px monospace`;
          ctx.fillText(
            CHARS[Math.floor(Math.random() * CHARS.length)],
            col.x,
            ry,
          );
        }

        col.y += col.speed;
        // reset when head has moved well past bottom
        const span = col.numRows * col.fontSize * 1.7;
        if (col.y > H + span * 0.4) {
          col.y = -span * (0.6 + Math.random() * 0.8);
        }
      }

      raf = requestAnimationFrame(animate);
    }

    let resizeTO: ReturnType<typeof setTimeout>;
    function onResize() {
      clearTimeout(resizeTO);
      resizeTO = setTimeout(setup, 200);
    }

    setup();
    animate();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTO);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}
