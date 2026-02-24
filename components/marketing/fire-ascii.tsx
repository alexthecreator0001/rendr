"use client";

import { useEffect, useRef } from "react";

const FIRE_ART = [
  "                                              .,_>                                 ",
  "                                           .?rzzI                                  ",
  "                                        ,{zXXXz+                                   ",
  "                                     '1vXXXXXXj'                                   ",
  "                                   !xXXXXXXXXX?                                    ",
  "                                 +vXXXXXXXXXXXi                                    ",
  "                               >zXXXXXXXXXXXXX>                                    ",
  "                             'fXXXXXXXXXXXXXXX}                                    ",
  "                            ~zXXXXXXXXXXXXXXXXr\"                                   ",
  "                           -zXXXXXXXXXXXXXXXXXX}                                   ",
  "                          }XXXXXXXXXXXXXXXXXXXXX{.                                  ",
  "                         ~zXXXXXXXXXXXXXXXXXXXXXXf\"                                ",
  "                        `uXXXXXXXXXXXXXXXXXXXXXXXXX{`                              ",
  "                        )XXXXXXXXXXXXXXXXXXXXXXXXXXXc|`                            ",
  "                       ^XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXrI.                         ",
  "                       <XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXc(`                       ",
  "                       -XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx!.                    ",
  "                       +XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXv-                   ",
  "                       ;XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX>                  ",
  "                        fXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/                ",
  "                        \"cXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXv;              ",
  "                         ?zXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXu,             ",
  "                         .tXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXz\"            ",
  "                          .rXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXf`           ",
  "                           ,uXXXXXXXXXXXXXznXXXXXXXXXXXXXXXXXXXXXXXXXXz+           ",
  "            :               -zXXXXXXXXXXXn|zXXXXXXXXXXXXXXXXXXXXXXXXXXXj           ",
  "          :n).              .uXXXXXXXXXXj1rXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\"          ",
  "         [zX(.               -XXXXXXXXXf11uXXXXXXXXXXXXXXXXXXXXXXXXXXXXX+          ",
  "       \"nXXXj.               lXXXXXXXXn111uXXXXXXXXXXXXXXXXXXXXXXXXXXXXX?          ",
  "      !vXXXXXl               ~XXXXXXXX)111jXXXXXXXXXXXXXXXXXXXXXXXXXXXXX<          ",
  "     +XXXXXXXc^              jXXXXXXXt1111)zXXXXXXXXXXXXXXXXXXXXXXXXXXXz'          ",
  "    [XXXXXXXXXr,            -zXXXXXXc)11111\\XXXXXXXXXXXXXXXXXXXXXXXXXXX|           ",
  "   ?XXXXXXXXXXXX]`        .]XXXXXXXXn1111111rXXXXXXXXXXXXXXXXXXXXXXXXXvl           ",
  "  [XXXXXXXXXXXXXXzx}I. ^</zXXXXXXXXXx11111111nXXXXXXXXXXXXXXXXXXXXXXXX-            ",
  " ~cXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXr111111111xXXXXXXXXXXXXXXXXXXXXXz+             ",
  "^vXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXr1111111111jXXXXXXXXXXXXXXXXXXXz+              ",
  ".uXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXr11111111111|cXXXXXXXXXXXXXXXXzi               ",
  "1XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx111111111111)xXXXXXXXXXXXXXXc!                ",
  "IuXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx11111111111111(cXXXXXXXXXXXX{   'fr<'        ",
  ")XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXr111111111111111)xXXXXXXXXXXX:    +XXXj!      ",
  "^XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXj11111111111111111tzXXXXXXXXX.   \"XXXXXzi    ",
  ")XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXz/111111111111111111fXXXXXXXXX:   \"XXXXXXXj`  ",
  "`cXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXc(1111111111111111111rXXXXXXXX\\' ]XXXXXXXXc< ",
  ">zXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXt111111111111111111111uXXXXXXXXv- [zXXXXXXXXXz_",
  "]zXXXXXXXXXXXXXXXXXXXXXczXXXXXXXXXXXXXXj1111111111111111111111/zXXXXXXXXXXXXXXXXXXXXXX]",
  ")XXXXXXXXXXXXXXXXXXXz(fXXXXXXXXXXXXXXf11111111}_{111111111111(vXXXXXXXXXXXXXXXXXXXXXci",
  ".|XXXXXXXXXXXXXXXXXXz)11/zXXXXXXXXXzn11111111{+>}11111111111111uXXXXXXXXXXXXXXXXXXXXXXr'",
  ".|XXXXXXXXXXXXXXXXXz/11111|xzXXXzx\\)11111111->i>111111111111111xXXXXXXXXXXXXXXXXXXXXXXX}",
  " )XXXXXXXXXXXXXXXXXn1111111111111111111111{~iiii{11111111111111xXXXXXXXXXXXXXXXXXXXXXXXX^",
  " [XXXXXXXXXXXXXXXXX|111111111111111111111}>iiiii_11111111111111xXXXXXXXXXXXXXfvXXXXXXXXXX+",
  " <zXXXXXXXXXXXXXXXn111111111111111111111}<iiiiii>]1111111111111jXXXXXXXXXXXXv1/zXXXXXXXXXX)",
  " \"cXXXXXXXXXXXXXXX\\111111111111111111111~iiiiiiii>[111111111111(XXXXXXXXXXXv(1)uXXXXXXXXXX\\.",
  "  /XXXXXXXXXXXXXXc)11111111111111111111_iiiiiiiiiii_{11111111111(vXXXXXXXzf1111fXXXXXXXXXX/.",
  "  IXXXXXXXXXXXXXXu11111111111111111111}<iiiiiiiiiii><}111111111111)\\fxr/(111111(XXXXXXXXXXXXXX\\",
  "   /XXXXXXXXXXXXXn11111111111111111111?>iiiiiiiiiiiiii+{111111111111111111111111XXXXXXXXXXXXXX}",
  "   !cXXXXXXXXXXXXn11111111111111111111_iiiiiiiiiiiiiiii>_{1111111111111111111111cXXXXXXXXXXXXX!",
  "   .|XXXXXXXXXXXXu11111111111111111111+iiiiiiiiiiiiiiiiii>]111111111111111111111zXXXXXXXXXXXXu",
  "    `cXXXXXXXXXXXc)1111111111?-1111111_iiiiiiiiiiiiiiiiiiii<}111111111111111111)XXXXXXXXXXXXX!",
  "     ,cXXXXXXXXXXX\\1111111111~i~{11111?>iiiiiiiiiiiiiiiiiiii>?11111111111111111/XXXXXXXXXXXX).",
  "      <cXXXXXXXXXXv1111111111>ii>~}111{<iiiiiiiiiiiiiiiiiiiiii_1111111111111111nXXXXXXXXXXXx,",
  "       <zXXXXXXXXXXt111111111>iiiii><_]?>iiiiiiiiiiiiiiiiiiiii>?11111111111111\\zXXXXXXXXXXc:",
  "        IuXXXXXXXXXc|11111111<iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii>{1111111111111uXXXXXXXXXXn,",
  "         \"xXXXXXXXXXu11111111_iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii-111111111111nXXXXXXXXXXr\"",
  "           ?zXXXXXXXXu1111111}>iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii+1111111111)nXXXXXXXXXz?",
  "            \"rXXXXXXXXn)111111+iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii-111111111(vXXXXXXXXXx,",
  "              lnXXXXXXXc(11111[<iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii}11111111fzXXXXXXXXnl",
  "                ;jXXXXXXzf11111[>iiiiiiiiiiiiiiiiiiiiiiiiiiiii>_1111111|cXXXXXXXXj:",
  "                  ^}cXXXXXc\\1111[<iiiiiiiiiiiiiiiiiiiiiiiiiiii~{11111(vXXXXXXXc?^",
  "                     ,|cXXXXv|111}<iiiiiiiiiiiiiiiiiiiiiiiii>+1111)/cXXXXXXu1`",
  "                        \"+xXXXzj)11]>iiiiiiiiiiiiiiiiiiiiii<[111\\uXXXXXXt>`",
  "                            '<\\xczj|)]<>iiiiiiiiiiiiiiii><]1(fcXXXcr)!",
  "                                 ',l_1/t1_>iiiiiiiiii>_1fuczr)+I\".",
  "                                              .`^\"^^'                ",
];

const FIRE_CHARS = ["X", "x", "z", "v", "c", "r", "n", "f", "u", "t", "j"];

export function FireAscii() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const charPositions: { row: number; col: number }[] = [];
    const maxCols = Math.max(...FIRE_ART.map((line) => line.length));
    const totalRows = FIRE_ART.length;

    for (let r = 0; r < totalRows; r++) {
      for (let c = 0; c < FIRE_ART[r].length; c++) {
        if (FIRE_ART[r][c] !== " ") {
          charPositions.push({ row: r, col: c });
        }
      }
    }

    // Distance from bottom-center for upward flame wave
    const distances = charPositions.map((p) => {
      const nr = p.row / totalRows;
      const nc = (p.col - maxCols / 2) / maxCols;
      return Math.sqrt(nr * nr + nc * nc * 0.3);
    });

    let fontSize = 3;
    let lineHeight = fontSize * 1.1;
    let charWidth = fontSize * 0.6;

    const resize = () => {
      const targetHeight = container.parentElement?.clientHeight || 250;
      const baseCharWidth = 0.6;
      const baseLineHeight = 1.1;
      // Scale to fit the target height
      fontSize = targetHeight / (totalRows * baseLineHeight);
      fontSize = Math.max(2, Math.min(fontSize, 6));
      lineHeight = fontSize * baseLineHeight;
      charWidth = fontSize * baseCharWidth;

      const artWidth = maxCols * charWidth;
      const artHeight = totalRows * lineHeight;
      canvas.width = Math.ceil(artWidth);
      canvas.height = Math.ceil(artHeight);
      container.style.width = `${canvas.width}px`;
      container.style.height = `${canvas.height}px`;
    };

    resize();
    window.addEventListener("resize", resize);

    let animId: number;

    const draw = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px monospace`;
      ctx.textBaseline = "top";

      const t = time * 0.001;

      for (let i = 0; i < charPositions.length; i++) {
        const pos = charPositions[i];
        const x = pos.col * charWidth;
        const y = pos.row * lineHeight;

        const wave = t * 2 + distances[i] * 6;
        const idx = Math.floor(Math.abs(Math.sin(wave) * FIRE_CHARS.length)) % FIRE_CHARS.length;

        // Brighter at bottom (higher row), dimmer at top
        const verticalFade = 0.15 + (pos.row / totalRows) * 0.25;
        const pulse = verticalFade + Math.sin(t * 1.5 + distances[i] * 4) * 0.05;

        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.05, pulse)})`;
        ctx.fillText(FIRE_CHARS[idx], x, y);
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
    <div ref={containerRef} className="relative shrink-0">
      <canvas ref={canvasRef} className="block" aria-hidden="true" />
    </div>
  );
}
