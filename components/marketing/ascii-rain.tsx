"use client";

import { useEffect, useRef } from "react";

const CHARS = ["0", "1", "·", "·", "·", " ", " ", "0", "1", " ", " "];

/** Deterministic hash → [0, 1) so characters don't flicker each frame */
function h(seed: number): number {
  let s = (seed ^ 0xdeadbeef) >>> 0;
  s = (Math.imul(s ^ (s >>> 16), 0x45d9f3b) | 0) >>> 0;
  s = (Math.imul(s ^ (s >>> 16), 0x45d9f3b) | 0) >>> 0;
  return ((s ^ (s >>> 16)) >>> 0) / 0x100000000;
}

export function AsciiRain() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    let W = 0,
      H = 0,
      raf = 0,
      t0 = 0;

    /* ── layout ─────────────────────────────────────────────────── */
    const NUM_RAYS = 130; // rays fanning out from the vanishing point
    const SPACING = 16; // px between characters along each ray
    const MIND = 45; // px from VP before first character
    const SPEED = 10; // px / second (characters scroll outward)

    /* ── resize ─────────────────────────────────────────────────── */
    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    /* ── draw loop ───────────────────────────────────────────────── */
    function draw(now: number) {
      if (!t0) t0 = now;
      const elapsed = (now - t0) / 1000;

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);

      /* Vanishing point — slightly below visual center */
      const vpx = W * 0.5;
      const vpy = H * 0.52;

      /* How far characters have scrolled outward */
      const totalScrolled = elapsed * SPEED;
      const scrollFrac = totalScrolled % SPACING;
      const scrollCycle = Math.floor(totalScrolled / SPACING);

      for (let ri = 0; ri < NUM_RAYS; ri++) {
        const angle = (ri / NUM_RAYS) * Math.PI * 2;
        const cx = Math.cos(angle);
        const cy = Math.sin(angle);

        /* Distance from VP to the screen boundary along this ray */
        let maxD = 1e9;
        if (cx > 1e-6) maxD = Math.min(maxD, (W - vpx) / cx);
        else if (cx < -1e-6) maxD = Math.min(maxD, -vpx / cx);
        if (cy > 1e-6) maxD = Math.min(maxD, (H - vpy) / cy);
        else if (cy < -1e-6) maxD = Math.min(maxD, -vpy / cy);

        /* Walk along the ray, placing one character per slot */
        let d = MIND + scrollFrac;
        let slot = 0;

        while (d <= maxD + SPACING) {
          const sx = vpx + cx * d;
          const sy = vpy + cy * d;

          if (sx > -8 && sx < W + 8 && sy > -8 && sy < H + 8) {
            /* t ∈ [0, 1]: 0 = near VP (small, dim), 1 = at edge (big, bright) */
            const t = Math.max(0, Math.min(1, (d - MIND) / (maxD - MIND)));

            const fontSize = 5 + t * 10; // 5 → 15 px
            const alpha = Math.pow(t, 0.55) * 0.24 + 0.008;

            if (alpha > 0.01) {
              /* Stable, non-flickering character identity */
              const globalSlot = scrollCycle + slot;
              const seed = ri * 9973 + (globalSlot % 997);
              const char = CHARS[Math.floor((h(seed) * 0xffff) % CHARS.length)];

              ctx.font = `${Math.round(fontSize)}px monospace`;
              ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
              ctx.fillText(char, sx, sy);
            }
          }

          d += SPACING;
          slot++;
        }
      }

      raf = requestAnimationFrame(draw);
    }

    /* ── boot ────────────────────────────────────────────────────── */
    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
