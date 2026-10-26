"use client";

import { gsap } from "gsap";
import React, { useEffect, useRef } from "react";

interface CrowdCanvasProps {
  src?: string;
  rows?: number;
  cols?: number;
  className?: string;
}

const CrowdCanvas = ({
  src = "/peeps-sprite.png",
  rows = 15,
  cols = 7,
  className = "absolute bottom-0 h-[85vh] w-full",
}: CrowdCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const config = {
      src: src || "https://cdn.21st.dev/assets/localized/abdb8990a7bef8c2f5af3e45f0a3c969c4b0603fba8be92e81347de4ea4e1ed7.png",
      rows,
      cols,
    };

    // UTILS
    const randomRange = (min: number, max: number) =>
      min + Math.random() * (max - min);
    const randomIndex = (array: any[]) => randomRange(0, array.length) | 0;
    const removeFromArray = (array: any[], i: number) => array.splice(i, 1)[0];
    const removeItemFromArray = (array: any[], item: any) =>
      removeFromArray(array, array.indexOf(item));
    const removeRandomFromArray = (array: any[]) =>
      removeFromArray(array, randomIndex(array));
    const getRandomFromArray = (array: any[]) => array[randomIndex(array) | 0];

    // TWEEN FACTORIES
    const resetPeep = ({ stage, peep }: { stage: any; peep: any }) => {
      const direction = Math.random() > 0.5 ? 1 : -1;
      const offsetY = 100 - 250 * gsap.parseEase("power2.in")(Math.random());
      const startY = stage.height - peep.height + offsetY;
      let startX: number;
      let endX: number;

      if (direction === 1) {
        startX = -peep.width;
        endX = stage.width;
        peep.scaleX = 1;
      } else {
        startX = stage.width + peep.width;
        endX = 0;
        peep.scaleX = -1;
      }

      peep.x = startX;
      peep.y = startY;
      peep.anchorY = startY;

      return {
        startX,
        startY,
        endX,
      };
    };

    const normalWalk = ({ peep, props }: { peep: any; props: any }) => {
      const { startY, endX } = props;
      const xDuration = 10;
      const yDuration = 0.25;

      const tl = gsap.timeline();
      tl.timeScale(randomRange(0.5, 1.5));
      tl.to(
        peep,
        {
          duration: xDuration,
          x: endX,
          ease: "none",
        },
        0,
      );
      tl.to(
        peep,
        {
          duration: yDuration,
          repeat: xDuration / yDuration,
          yoyo: true,
          y: startY - 10,
        },
        0,
      );

      return tl;
    };

    const walks = [normalWalk];

    // TYPES
    type Peep = {
      image: HTMLImageElement;
      rect: number[];
      width: number;
      height: number;
      drawArgs: any[];
      x: number;
      y: number;
      anchorY: number;
      scaleX: number;
      walk: any;
      setRect: (rect: number[]) => void;
      render: (ctx: CanvasRenderingContext2D) => void;
    };

    // FACTORY FUNCTIONS
    const createPeep = ({
      image,
      rect,
    }: {
      image: HTMLImageElement;
      rect: number[];
    }): Peep => {
      const peep: Peep = {
        image,
        rect: [],
        width: 0,
        height: 0,
        drawArgs: [],
        x: 0,
        y: 0,
        anchorY: 0,
        scaleX: 1,
        walk: null,
        setRect: (rect: number[]) => {
          peep.rect = rect;
          peep.width = rect[2];
          peep.height = rect[3];
          peep.drawArgs = [peep.image, ...rect, 0, 0, peep.width, peep.height];
        },
        render: (ctx: CanvasRenderingContext2D) => {
          ctx.save();
          ctx.translate(peep.x, peep.y);
          ctx.scale(peep.scaleX, 1);
          ctx.drawImage(
            peep.image,
            peep.rect[0],
            peep.rect[1],
            peep.rect[2],
            peep.rect[3],
            0,
            0,
            peep.width,
            peep.height,
          );
          ctx.restore();
        },
      };

      peep.setRect(rect);
      return peep;
    };

    // MAIN
    const img = document.createElement("img");
    img.crossOrigin = "anonymous";
    const stage = {
      width: 0,
      height: 0,
    };

    const allPeeps: Peep[] = [];
    const availablePeeps: Peep[] = [];
    const crowd: Peep[] = [];

    const createPeeps = () => {
      const { rows, cols } = config;
      const { naturalWidth: width, naturalHeight: height } = img;
      if (!width || !height) return;
      const total = rows * cols;
      const rectWidth = width / rows;
      const rectHeight = height / cols;

      for (let i = 0; i < total; i++) {
        allPeeps.push(
          createPeep({
            image: img,
            rect: [
              (i % rows) * rectWidth,
              ((i / rows) | 0) * rectHeight,
              rectWidth,
              rectHeight,
            ],
          }),
        );
      }
    };

    const initCrowd = () => {
      while (availablePeeps.length) {
        const added = addPeepToCrowd();
        if (added && added.walk) {
          added.walk.progress(Math.random());
        }
      }
    };

    const addPeepToCrowd = () => {
      if (availablePeeps.length === 0) return null;
      const peep = removeRandomFromArray(availablePeeps);
      const walk = getRandomFromArray(walks)({
        peep,
        props: resetPeep({
          peep,
          stage,
        }),
      }).eventCallback("onComplete", () => {
        removePeepFromCrowd(peep);
        addPeepToCrowd();
      });

      peep.walk = walk;

      crowd.push(peep);
      crowd.sort((a, b) => a.anchorY - b.anchorY);

      return peep;
    };

    const removePeepFromCrowd = (peep: Peep) => {
      removeItemFromArray(crowd, peep);
      availablePeeps.push(peep);
    };

    const render = () => {
      if (!canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      const dpr = window.devicePixelRatio || 1;
      ctx.scale(dpr, dpr);

      crowd.forEach((peep) => {
        peep.render(ctx);
      });

      ctx.restore();
    };

    const resize = () => {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      stage.width = canvas.clientWidth || window.innerWidth;
      stage.height = canvas.clientHeight || window.innerHeight;
      canvas.width = stage.width * dpr;
      canvas.height = stage.height * dpr;

      crowd.forEach((peep) => {
        if (peep.walk) peep.walk.kill();
      });

      crowd.length = 0;
      availablePeeps.length = 0;
      availablePeeps.push(...allPeeps);

      initCrowd();
    };

    let initialized = false;
    const init = () => {
      if (initialized) return;
      initialized = true;
      createPeeps();
      resize();
      gsap.ticker.add(render);
    };

    img.onload = init;
    img.onerror = () => {
      if (img.src !== "/peeps-sprite.png") {
        img.src = "/peeps-sprite.png";
      }
    };
    img.src = config.src;
    if (img.complete && img.naturalWidth > 0) {
      init();
    }

    const handleResize = () => resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      gsap.ticker.remove(render);
      crowd.forEach((peep) => {
        if (peep.walk) peep.walk.kill();
      });
    };
  }, [src, rows, cols]);

  return (
    <canvas ref={canvasRef} className={className} />
  );
};

interface Skiper39Props {
  badge?: string;
  title?: string;
  subtitle?: string;
  showOverlay?: boolean;
}

const Skiper39 = ({
  badge = "Crowd Canvas",
  title = "Veritas AI",
  subtitle = "Real-time Fake News & Misinformation Detection in the Era of Digital Crowds",
  showOverlay = true,
}: Skiper39Props) => {
  return (
    <div className="relative h-full w-full bg-slate-950 text-white overflow-hidden">
      {showOverlay && (
        <div className="top-16 absolute left-1/2 z-10 grid -translate-x-1/2 content-start justify-items-center gap-4 text-center px-4 w-full max-w-4xl">
          <span className="relative max-w-[14ch] text-xs uppercase tracking-widest text-indigo-400 font-semibold px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30">
            {badge}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">
            {title}
          </h1>
          <p className="text-sm text-slate-300 max-w-xl">
            {subtitle}
          </p>
        </div>
      )}
      <div className="absolute bottom-0 h-full w-screen">
        <CrowdCanvas
          src="/peeps-sprite.png"
          rows={15}
          cols={7}
          className="absolute bottom-0 h-[85vh] w-full"
        />
      </div>
    </div>
  );
};

// Silence unused React warning if any
void React;

export { CrowdCanvas, Skiper39 };
export default Skiper39;
