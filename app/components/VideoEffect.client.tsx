import { useEffect, useRef } from "react";

interface VideoEffectProps {
  videoSrc: string;
  effectType?: "pixelate" | "particles" | "glitch" | "ascii" | "vhs" | "both";
}

export const VideoEffect = ({
  videoSrc,
  effectType = "glitch",
}: VideoEffectProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let glitchOffset = 0;
    let frameCount = 0;

    // Resize canvas to match container
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetWidth * 0.5625; // 16:9
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const drawGlitch = () => {
      if (video.readyState < 2) return;

      const w = canvas.width;
      const h = canvas.height;

      // Draw base video
      ctx.drawImage(video, 0, 0, w, h);

      // RGB channel separation
      if (frameCount % 3 === 0) {
        glitchOffset = Math.random() * 10 - 5;
      }

      // Get image data for manipulation
      const imageData = ctx.getImageData(0, 0, w, h);
      const data = imageData.data;

      // RGB split effect
      const offset = Math.floor(glitchOffset);
      if (offset !== 0) {
        const tempData = new Uint8ClampedArray(data);
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const idx = (y * w + x) * 4;
            const offsetIdx = (y * w + Math.min(w - 1, Math.max(0, x + offset))) * 4;

            // Red channel shift
            data[idx] = tempData[offsetIdx];

            // Cyan shift (Green + Blue)
            const offsetIdx2 = (y * w + Math.min(w - 1, Math.max(0, x - offset))) * 4;
            data[idx + 1] = tempData[offsetIdx2 + 1];
            data[idx + 2] = tempData[offsetIdx2 + 2];
          }
        }
      }

      // Digital noise
      if (Math.random() < 0.1) {
        for (let i = 0; i < 100; i++) {
          const x = Math.floor(Math.random() * w);
          const y = Math.floor(Math.random() * h);
          const idx = (y * w + x) * 4;
          const brightness = Math.random() * 255;
          data[idx] = brightness;
          data[idx + 1] = brightness;
          data[idx + 2] = brightness;
        }
      }

      ctx.putImageData(imageData, 0, 0);

      // Scanlines
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      for (let i = 0; i < h; i += 4) {
        ctx.fillRect(0, i, w, 2);
      }

      // Random glitch blocks
      if (Math.random() < 0.05) {
        const blockX = Math.random() * w;
        const blockY = Math.random() * h;
        const blockW = Math.random() * 150 + 50;
        const blockH = Math.random() * 40 + 10;
        const blockOffset = Math.random() * 40 - 20;

        try {
          const blockData = ctx.getImageData(blockX, blockY, blockW, blockH);
          ctx.putImageData(blockData, blockX + blockOffset, blockY);
        } catch (e) {
          // Skip on error
        }
      }

      frameCount++;
    };

    const drawASCII = () => {
      if (video.readyState < 2) return;

      const w = canvas.width;
      const h = canvas.height;
      const fontSize = 8;
      const asciiChars = " .:-=+*#%@";

      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, w, h);

      // Draw video to get pixel data
      ctx.drawImage(video, 0, 0, w, h);
      const imageData = ctx.getImageData(0, 0, w, h);
      const data = imageData.data;

      // Clear and prepare for ASCII
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, w, h);
      ctx.font = `${fontSize}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const cols = Math.floor(w / fontSize);
      const rows = Math.floor(h / fontSize);

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const px = Math.floor((x / cols) * w);
          const py = Math.floor((y / rows) * h);
          const idx = (py * w + px) * 4;

          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];

          const brightness = (r + g + b) / 3;
          const charIndex = Math.floor((brightness / 255) * (asciiChars.length - 1));
          const char = asciiChars[charIndex];

          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          ctx.fillText(char, x * fontSize + fontSize / 2, y * fontSize + fontSize / 2);
        }
      }
    };

    const drawPixelate = () => {
      if (video.readyState < 2) return;

      const w = canvas.width;
      const h = canvas.height;
      const pixelSize = 8;

      ctx.drawImage(video, 0, 0, w, h);
      const imageData = ctx.getImageData(0, 0, w, h);
      const data = imageData.data;

      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, w, h);

      for (let y = 0; y < h; y += pixelSize) {
        for (let x = 0; x < w; x += pixelSize) {
          const idx = (y * w + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];

          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          ctx.fillRect(x, y, pixelSize, pixelSize);
        }
      }
    };

    const drawVHS = () => {
      if (video.readyState < 2) return;

      const w = canvas.width;
      const h = canvas.height;

      // Draw base video
      ctx.drawImage(video, 0, 0, w, h);

      // Get image data for manipulation
      const imageData = ctx.getImageData(0, 0, w, h);
      const data = imageData.data;

      // 1. Color degradation (reduce saturation, lower contrast)
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Reduce saturation
        const gray = (r + g + b) / 3;
        data[i] = r * 0.7 + gray * 0.3;
        data[i + 1] = g * 0.7 + gray * 0.3;
        data[i + 2] = b * 0.7 + gray * 0.3;

        // Lower contrast
        data[i] = data[i] * 0.8 + 30;
        data[i + 1] = data[i + 1] * 0.8 + 30;
        data[i + 2] = data[i + 2] * 0.8 + 30;
      }

      // 2. Chroma bleed (color separation)
      const chromaOffset = Math.floor(Math.random() * 3) + 1;
      const tempData = new Uint8ClampedArray(data);

      for (let y = 0; y < h; y++) {
        for (let x = chromaOffset; x < w; x++) {
          const idx = (y * w + x) * 4;
          const sourceIdx = (y * w + (x - chromaOffset)) * 4;

          // Shift red and blue channels
          data[idx] = tempData[sourceIdx]; // Red from left
          data[idx + 2] = tempData[sourceIdx + 2 + chromaOffset * 4] || tempData[sourceIdx + 2]; // Blue from right
        }
      }

      // 3. Video noise
      if (Math.random() < 0.3) {
        for (let i = 0; i < 200; i++) {
          const x = Math.floor(Math.random() * w);
          const y = Math.floor(Math.random() * h);
          const idx = (y * w + x) * 4;
          const noise = Math.random() * 100;
          data[idx] += noise;
          data[idx + 1] += noise;
          data[idx + 2] += noise;
        }
      }

      ctx.putImageData(imageData, 0, 0);

      // 4. Tracking errors (horizontal displacement)
      if (Math.random() < 0.1) {
        const errorY = Math.floor(Math.random() * h);
        const errorHeight = Math.floor(Math.random() * 30) + 10;
        const errorOffset = Math.floor(Math.random() * 40) - 20;

        try {
          const errorData = ctx.getImageData(0, errorY, w, errorHeight);
          ctx.putImageData(errorData, errorOffset, errorY);
        } catch (e) {
          // Skip on error
        }
      }

      // 5. Scanlines
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      for (let i = 0; i < h; i += 2) {
        ctx.fillRect(0, i, w, 1);
      }

      // 6. Tape wave (bottom distortion)
      if (Math.random() < 0.15) {
        const waveY = h - Math.floor(Math.random() * 100) - 50;
        const waveHeight = 40;
        const waveAmount = Math.sin(frameCount * 0.1) * 10;

        try {
          const waveData = ctx.getImageData(0, waveY, w, waveHeight);
          ctx.putImageData(waveData, waveAmount, waveY);
        } catch (e) {
          // Skip on error
        }
      }

      // 7. Random vertical jitter
      if (Math.random() < 0.05) {
        const jitter = Math.floor(Math.random() * 6) - 3;
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = w;
        tempCanvas.height = h;
        const tempCtx = tempCanvas.getContext("2d");
        if (tempCtx) {
          tempCtx.drawImage(canvas, 0, jitter);
          ctx.clearRect(0, 0, w, h);
          ctx.drawImage(tempCanvas, 0, 0);
        }
      }

      frameCount++;
    };

    const animate = () => {
      if (effectType === "glitch") {
        drawGlitch();
      } else if (effectType === "ascii") {
        drawASCII();
      } else if (effectType === "pixelate") {
        drawPixelate();
      } else if (effectType === "vhs") {
        drawVHS();
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Ensure video plays
    const startPlayback = async () => {
      try {
        await video.play();
        animate();
      } catch (error) {
        console.error("Video playback failed:", error);
      }
    };

    // Start animation when video is ready
    if (video.readyState >= 2) {
      startPlayback();
    } else {
      video.addEventListener("loadeddata", startPlayback, { once: true });
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [videoSrc, effectType]);

  return (
    <div className="w-full h-full relative">
      <canvas ref={canvasRef} className="w-full h-auto" />
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        crossOrigin="anonymous"
        className="hidden"
      />
    </div>
  );
};
