import React, { useEffect, useRef, useState } from "react";
import { useMatrixCycle, getNextLogo } from "../hooks/useMatrixCycle";
import type { MatrixLogoType } from "../hooks/useMatrixCycle";

interface MatrixLogoProps {
  size?: "small" | "medium" | "large";
  showText?: boolean;
  className?: string;
}

const SIZE_CONFIG = {
  small: { container: 40, canvas: 40, text: "text-sm" },
  medium: { container: 60, canvas: 60, text: "text-base" },
  large: { container: 200, canvas: 200, text: "text-2xl" },
};

export const MatrixLogo: React.FC<MatrixLogoProps> = ({
  size = "medium",
  showText = false,
  className = "",
}) => {
  const { currentLogo, isTransitioning, transitionType, transitionProgress } =
    useMatrixCycle();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [clickEffect, setClickEffect] = useState(false);

  const config = SIZE_CONFIG[size];
  const nextLogo = getNextLogo(currentLogo);

  // Handle click effects
  const handleClick = () => {
    setClickEffect(true);
    setTimeout(() => setClickEffect(false), 600);
  };

  // Get time-based color for ink/wax
  const getTimeBasedColor = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return { primary: "#000000", name: "black" }; // Morning
    if (hour >= 12 && hour < 18) return { primary: "#0066cc", name: "blue" }; // Afternoon
    if (hour >= 18 && hour < 24) return { primary: "#cc0000", name: "red" }; // Evening
    return { primary: "#6600cc", name: "purple" }; // Night
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = config.canvas * dpr;
    canvas.height = config.canvas * dpr;
    ctx.scale(dpr, dpr);

    let animationId: number;

    // ============================================
    // LOGO 1: INK STAMP
    // ============================================
    const drawInkStamp = (time: number) => {
      ctx.clearRect(0, 0, config.canvas, config.canvas);
      const centerX = config.canvas / 2;
      const centerY = config.canvas / 2;
      const radius = config.canvas * 0.35;
      const color = getTimeBasedColor();

      // Stamp circle border
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = color.primary;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Inner circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.85, 0, Math.PI * 2);
      ctx.strokeStyle = color.primary;
      ctx.lineWidth = 2;
      ctx.stroke();

      // "LUMERIS" text curved on top
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(-Math.PI / 2);

      const text = "LUMERIS";
      ctx.font = `bold ${config.canvas * 0.12}px serif`;
      ctx.fillStyle = color.primary;
      ctx.textAlign = "center";

      for (let i = 0; i < text.length; i++) {
        const angle = (i - text.length / 2) * 0.25;
        ctx.save();
        ctx.rotate(angle);
        ctx.fillText(text[i], 0, -radius * 0.6);
        ctx.restore();
      }
      ctx.restore();

      // "L" monogram in center
      ctx.font = `bold ${config.canvas * 0.25}px serif`;
      ctx.fillStyle = color.primary;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("L", centerX, centerY);

      // Ink texture (random dots for authenticity)
      if (!isTransitioning) {
        ctx.fillStyle = color.primary;
        for (let i = 0; i < 30; i++) {
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * radius;
          const x = centerX + Math.cos(angle) * dist;
          const y = centerY + Math.sin(angle) * dist;
          const size = Math.random() * 1.5;
          ctx.globalAlpha = Math.random() * 0.3;
          ctx.fillRect(x, y, size, size);
        }
        ctx.globalAlpha = 1;
      }

      // Hover effect: stamp press
      if (isHovered) {
        ctx.fillStyle = `${color.primary}15`;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 1.1, 0, Math.PI * 2);
        ctx.fill();
      }

      // Click effect: ink splash
      if (clickEffect) {
        ctx.strokeStyle = color.primary;
        ctx.lineWidth = 2;
        for (let i = 0; i < 8; i++) {
          const angle = (i * Math.PI * 2) / 8;
          const splashDist = radius * (1 + transitionProgress / 50);
          ctx.beginPath();
          ctx.arc(
            centerX + Math.cos(angle) * splashDist,
            centerY + Math.sin(angle) * splashDist,
            3,
            0,
            Math.PI * 2
          );
          ctx.stroke();
        }
      }
    };

    // ============================================
    // LOGO 2: WAX SEAL
    // ============================================
    const drawWaxSeal = (time: number) => {
      ctx.clearRect(0, 0, config.canvas, config.canvas);
      const centerX = config.canvas / 2;
      const centerY = config.canvas / 2;
      const radius = config.canvas * 0.38;

      // Time-based wax color
      const hour = new Date().getHours();
      let waxColor;
      if (hour >= 6 && hour < 12)
        waxColor = "#d4af37"; // Gold
      else if (hour >= 12 && hour < 18)
        waxColor = "#8b0000"; // Red
      else if (hour >= 18 && hour < 24)
        waxColor = "#000080"; // Blue
      else waxColor = "#006400"; // Green

      // Wax seal base with 3D effect
      const gradient = ctx.createRadialGradient(
        centerX - radius * 0.2,
        centerY - radius * 0.2,
        0,
        centerX,
        centerY,
        radius
      );
      gradient.addColorStop(0, waxColor + "ff");
      gradient.addColorStop(0.7, waxColor + "dd");
      gradient.addColorStop(1, waxColor + "88");

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Wax drips at edges
      for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI * 2) / 12;
        const dripX = centerX + Math.cos(angle) * radius;
        const dripY = centerY + Math.sin(angle) * radius;
        const dripLength = 5 + Math.sin(time * 0.001 + i) * 3;

        ctx.beginPath();
        ctx.moveTo(dripX, dripY);
        ctx.lineTo(
          dripX + Math.cos(angle) * dripLength,
          dripY + Math.sin(angle) * dripLength
        );
        ctx.strokeStyle = waxColor + "aa";
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.stroke();
      }

      // Embossed "L" symbol
      ctx.save();
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 5;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      ctx.font = `bold ${config.canvas * 0.35}px serif`;
      ctx.fillStyle = waxColor + "44";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("L", centerX, centerY);
      ctx.restore();

      // Highlight shine
      const shineGradient = ctx.createRadialGradient(
        centerX - radius * 0.3,
        centerY - radius * 0.3,
        0,
        centerX - radius * 0.3,
        centerY - radius * 0.3,
        radius * 0.5
      );
      shineGradient.addColorStop(0, "rgba(255, 255, 255, 0.4)");
      shineGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.beginPath();
      ctx.arc(
        centerX - radius * 0.3,
        centerY - radius * 0.3,
        radius * 0.5,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = shineGradient;
      ctx.fill();

      // Hover effect: wax melts
      if (isHovered) {
        ctx.fillStyle = "rgba(255, 100, 0, 0.2)";
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 1.05, 0, Math.PI * 2);
        ctx.fill();
      }

      // Click effect: seal stamp
      if (clickEffect) {
        ctx.strokeStyle = waxColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(
          centerX,
          centerY,
          radius * (1 - transitionProgress / 200),
          0,
          Math.PI * 2
        );
        ctx.stroke();
      }
    };

    // ============================================
    // LOGO 3: CALLIGRAPHY
    // ============================================
    const drawCalligraphy = (time: number) => {
      ctx.clearRect(0, 0, config.canvas, config.canvas);
      const centerX = config.canvas / 2;
      const centerY = config.canvas / 2;

      // Time-based ink color
      const hour = new Date().getHours();
      let inkColor;
      if (hour >= 6 && hour < 12)
        inkColor = "#000000"; // Black
      else if (hour >= 12 && hour < 18)
        inkColor = "#d4af37"; // Gold
      else if (hour >= 18 && hour < 24)
        inkColor = "#c0c0c0"; // Silver
      else inkColor = "#ffffff"; // White

      // Draw "L" with brush stroke effect
      ctx.save();
      ctx.translate(centerX, centerY);

      // Brush stroke path for "L"
      const strokeProgress = (time * 0.0005) % 1;

      ctx.strokeStyle = inkColor;
      ctx.lineWidth = config.canvas * 0.08;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Vertical stroke
      ctx.beginPath();
      ctx.moveTo(-config.canvas * 0.1, -config.canvas * 0.25);
      ctx.lineTo(-config.canvas * 0.1, config.canvas * 0.25);
      ctx.stroke();

      // Horizontal stroke
      ctx.beginPath();
      ctx.moveTo(-config.canvas * 0.1, config.canvas * 0.25);
      ctx.lineTo(config.canvas * 0.15, config.canvas * 0.25);
      ctx.stroke();

      // Ink flow effect (shimmer)
      const shimmer = Math.sin(time * 0.003) * 0.3 + 0.7;
      ctx.globalAlpha = shimmer;

      // Brush texture
      ctx.strokeStyle = inkColor + "88";
      ctx.lineWidth = config.canvas * 0.06;
      ctx.beginPath();
      ctx.moveTo(-config.canvas * 0.1, -config.canvas * 0.25);
      ctx.lineTo(-config.canvas * 0.1, config.canvas * 0.25);
      ctx.lineTo(config.canvas * 0.15, config.canvas * 0.25);
      ctx.stroke();

      ctx.globalAlpha = 1;
      ctx.restore();

      // Ink drips
      if (!isTransitioning) {
        ctx.fillStyle = inkColor + "66";
        for (let i = 0; i < 3; i++) {
          const dripX = centerX - config.canvas * 0.1 + i * 10;
          const dripY =
            centerY + config.canvas * 0.25 + ((time * 0.5 + i * 100) % 20);
          ctx.beginPath();
          ctx.ellipse(dripX, dripY, 2, 4, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Hover effect: ink flows
      if (isHovered) {
        ctx.strokeStyle = inkColor + "33";
        ctx.lineWidth = config.canvas * 0.12;
        ctx.beginPath();
        ctx.moveTo(
          centerX - config.canvas * 0.1,
          centerY - config.canvas * 0.25
        );
        ctx.lineTo(
          centerX - config.canvas * 0.1,
          centerY + config.canvas * 0.25
        );
        ctx.lineTo(
          centerX + config.canvas * 0.15,
          centerY + config.canvas * 0.25
        );
        ctx.stroke();
      }

      // Click effect: brush splash
      if (clickEffect) {
        ctx.strokeStyle = inkColor;
        ctx.lineWidth = 2;
        for (let i = 0; i < 12; i++) {
          const angle = (i * Math.PI * 2) / 12;
          const dist = config.canvas * 0.3 * (transitionProgress / 100);
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(
            centerX + Math.cos(angle) * dist,
            centerY + Math.sin(angle) * dist
          );
          ctx.stroke();
        }
      }
    };

    // ============================================
    // LOGO 4: ORIGAMI
    // ============================================
    const drawOrigami = (time: number) => {
      ctx.clearRect(0, 0, config.canvas, config.canvas);
      const centerX = config.canvas / 2;
      const centerY = config.canvas / 2;
      const size = config.canvas * 0.3;

      // Time-based paper color
      const hour = new Date().getHours();
      let paperColor, foldColor;
      if (hour >= 6 && hour < 12) {
        paperColor = "#ffffff";
        foldColor = "#d4af37";
      } else if (hour >= 12 && hour < 18) {
        paperColor = "#f4e8c1";
        foldColor = "#ff8c00";
      } else if (hour >= 18 && hour < 24) {
        paperColor = "#d4c4a8";
        foldColor = "#8b4513";
      } else {
        paperColor = "#c9b896";
        foldColor = "#c0c0c0";
      }

      // Rotation animation
      const rotation = (time * 0.001) % (Math.PI * 2);

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);

      // Draw origami crane shape (simplified)
      // Body
      ctx.fillStyle = paperColor;
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(size * 0.8, 0);
      ctx.lineTo(0, size * 0.5);
      ctx.lineTo(-size * 0.8, 0);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = foldColor;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Fold lines
      ctx.strokeStyle = foldColor + "88";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(0, size * 0.5);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-size * 0.8, 0);
      ctx.lineTo(size * 0.8, 0);
      ctx.stroke();

      // Wing
      ctx.fillStyle = paperColor + "dd";
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(size * 0.6, -size * 0.3);
      ctx.lineTo(size * 0.8, 0);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = foldColor;
      ctx.lineWidth = 2;
      ctx.stroke();

      // "L" mark on body
      ctx.font = `bold ${config.canvas * 0.15}px serif`;
      ctx.fillStyle = foldColor;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("L", 0, 0);

      ctx.restore();

      // Shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.beginPath();
      ctx.ellipse(
        centerX,
        centerY + size * 0.8,
        size * 0.6,
        size * 0.2,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Hover effect: unfolds slightly
      if (isHovered) {
        ctx.strokeStyle = foldColor + "44";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(centerX, centerY, size * 1.3, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Click effect: paper flutter
      if (clickEffect) {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.scale(1 + transitionProgress / 100, 1 + transitionProgress / 100);
        ctx.globalAlpha = 1 - transitionProgress / 100;
        ctx.strokeStyle = foldColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, size * 1.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    };

    // ============================================
    // LOGO 5: TYPEWRITER
    // ============================================
    const drawTypewriter = (time: number) => {
      ctx.clearRect(0, 0, config.canvas, config.canvas);
      const centerX = config.canvas / 2;
      const centerY = config.canvas / 2;

      // Time-based ribbon color
      const hour = new Date().getHours();
      let ribbonColor;
      if (hour >= 6 && hour < 12)
        ribbonColor = "#000000"; // Black
      else if (hour >= 12 && hour < 18)
        ribbonColor = "#0066cc"; // Blue
      else if (hour >= 18 && hour < 24)
        ribbonColor = "#cc0000"; // Red
      else ribbonColor = "#6600cc"; // Purple

      // Typing animation
      const text = "LUMERIS";
      const typingSpeed = 3000; // 3 seconds to type full word
      const charIndex = Math.floor(
        (time % typingSpeed) / (typingSpeed / text.length)
      );
      const displayText = text.substring(0, charIndex + 1);

      // Typewriter font
      ctx.font = `bold ${config.canvas * 0.12}px "Courier New", monospace`;
      ctx.fillStyle = ribbonColor;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Draw typed text
      ctx.fillText(displayText, centerX, centerY);

      // Cursor blink
      if (charIndex === text.length - 1 && Math.floor(time / 500) % 2 === 0) {
        ctx.fillRect(
          centerX + ctx.measureText(displayText).width / 2 + 2,
          centerY - config.canvas * 0.06,
          2,
          config.canvas * 0.12
        );
      }

      // Ink ribbon texture
      ctx.globalAlpha = 0.3;
      for (let i = 0; i < displayText.length; i++) {
        const charX =
          centerX -
          ctx.measureText(displayText).width / 2 +
          ctx.measureText(displayText.substring(0, i + 1)).width -
          ctx.measureText(displayText[i]).width / 2;

        // Random ink density
        for (let j = 0; j < 5; j++) {
          const offsetX = (Math.random() - 0.5) * 3;
          const offsetY = (Math.random() - 0.5) * 3;
          ctx.fillStyle = ribbonColor;
          ctx.globalAlpha = Math.random() * 0.1;
          ctx.fillRect(charX + offsetX, centerY + offsetY, 1, 1);
        }
      }
      ctx.globalAlpha = 1;

      // Paper feed lines
      ctx.strokeStyle = "#cccccc";
      ctx.lineWidth = 1;
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        ctx.moveTo(0, centerY + i * config.canvas * 0.15);
        ctx.lineTo(config.canvas, centerY + i * config.canvas * 0.15);
        ctx.stroke();
      }

      // Hover effect: paper highlight
      if (isHovered) {
        ctx.fillStyle = "rgba(255, 255, 0, 0.1)";
        ctx.fillRect(
          0,
          centerY - config.canvas * 0.1,
          config.canvas,
          config.canvas * 0.2
        );
      }

      // Click effect: carriage return
      if (clickEffect) {
        const returnProgress = transitionProgress / 100;
        ctx.save();
        ctx.translate(centerX * (1 - returnProgress), centerY);
        ctx.globalAlpha = 1 - returnProgress;
        ctx.fillStyle = ribbonColor;
        ctx.fillText(text, 0, 0);
        ctx.restore();
      }
    };

    // ============================================
    // MAIN ANIMATION LOOP
    // ============================================
    const animate = (time: number) => {
      // Apply transition effects
      if (isTransitioning) {
        applyTransitionEffect(time);
      } else {
        // Draw current logo
        switch (currentLogo) {
          case "inkStamp":
            drawInkStamp(time);
            break;
          case "waxSeal":
            drawWaxSeal(time);
            break;
          case "calligraphy":
            drawCalligraphy(time);
            break;
          case "origami":
            drawOrigami(time);
            break;
          case "typewriter":
            drawTypewriter(time);
            break;
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    // ============================================
    // TRANSITION EFFECTS
    // ============================================
    const applyTransitionEffect = (time: number) => {
      const progress = transitionProgress / 100;

      switch (transitionType) {
        case "fade":
          // Simple fade transition
          ctx.globalAlpha = 1 - progress;
          switch (currentLogo) {
            case "inkStamp":
              drawInkStamp(time);
              break;
            case "waxSeal":
              drawWaxSeal(time);
              break;
            case "calligraphy":
              drawCalligraphy(time);
              break;
            case "origami":
              drawOrigami(time);
              break;
            case "typewriter":
              drawTypewriter(time);
              break;
          }
          ctx.globalAlpha = progress;
          switch (nextLogo) {
            case "inkStamp":
              drawInkStamp(time);
              break;
            case "waxSeal":
              drawWaxSeal(time);
              break;
            case "calligraphy":
              drawCalligraphy(time);
              break;
            case "origami":
              drawOrigami(time);
              break;
            case "typewriter":
              drawTypewriter(time);
              break;
          }
          ctx.globalAlpha = 1;
          break;

        case "slide":
          // Slide transition
          ctx.save();
          ctx.translate(-config.canvas * progress, 0);
          switch (currentLogo) {
            case "inkStamp":
              drawInkStamp(time);
              break;
            case "waxSeal":
              drawWaxSeal(time);
              break;
            case "calligraphy":
              drawCalligraphy(time);
              break;
            case "origami":
              drawOrigami(time);
              break;
            case "typewriter":
              drawTypewriter(time);
              break;
          }
          ctx.restore();

          ctx.save();
          ctx.translate(config.canvas * (1 - progress), 0);
          switch (nextLogo) {
            case "inkStamp":
              drawInkStamp(time);
              break;
            case "waxSeal":
              drawWaxSeal(time);
              break;
            case "calligraphy":
              drawCalligraphy(time);
              break;
            case "origami":
              drawOrigami(time);
              break;
            case "typewriter":
              drawTypewriter(time);
              break;
          }
          ctx.restore();
          break;

        case "dissolve":
          // Dissolve with paper texture
          if (progress < 0.5) {
            switch (currentLogo) {
              case "inkStamp":
                drawInkStamp(time);
                break;
              case "waxSeal":
                drawWaxSeal(time);
                break;
              case "calligraphy":
                drawCalligraphy(time);
                break;
              case "origami":
                drawOrigami(time);
                break;
              case "typewriter":
                drawTypewriter(time);
                break;
            }
            // Overlay dissolving effect
            ctx.fillStyle = `rgba(244, 232, 193, ${progress * 2})`;
            ctx.fillRect(0, 0, config.canvas, config.canvas);
          } else {
            ctx.globalAlpha = (progress - 0.5) * 2;
            switch (nextLogo) {
              case "inkStamp":
                drawInkStamp(time);
                break;
              case "waxSeal":
                drawWaxSeal(time);
                break;
              case "calligraphy":
                drawCalligraphy(time);
                break;
              case "origami":
                drawOrigami(time);
                break;
              case "typewriter":
                drawTypewriter(time);
                break;
            }
            ctx.globalAlpha = 1;
          }
          break;

        case "flip":
          // Page flip effect
          const centerX = config.canvas / 2;
          const centerY = config.canvas / 2;

          if (progress < 0.5) {
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.scale(1 - progress * 2, 1);
            ctx.translate(-centerX, -centerY);
            switch (currentLogo) {
              case "inkStamp":
                drawInkStamp(time);
                break;
              case "waxSeal":
                drawWaxSeal(time);
                break;
              case "calligraphy":
                drawCalligraphy(time);
                break;
              case "origami":
                drawOrigami(time);
                break;
              case "typewriter":
                drawTypewriter(time);
                break;
            }
            ctx.restore();
          } else {
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.scale((progress - 0.5) * 2, 1);
            ctx.translate(-centerX, -centerY);
            switch (nextLogo) {
              case "inkStamp":
                drawInkStamp(time);
                break;
              case "waxSeal":
                drawWaxSeal(time);
                break;
              case "calligraphy":
                drawCalligraphy(time);
                break;
              case "origami":
                drawOrigami(time);
                break;
              case "typewriter":
                drawTypewriter(time);
                break;
            }
            ctx.restore();
          }
          break;
      }
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [
    currentLogo,
    isTransitioning,
    transitionType,
    transitionProgress,
    isHovered,
    clickEffect,
    config,
    nextLogo,
  ]);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className="relative cursor-pointer"
        style={{ width: config.container, height: config.container }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        <canvas
          ref={canvasRef}
          width={config.canvas}
          height={config.canvas}
          style={{ width: config.container, height: config.container }}
          className="block"
        />
      </div>
      {showText && (
        <span
          className={`font-bold tracking-wider ${config.text}`}
          style={{
            color: "#2c2416",
            fontFamily: "serif",
          }}
        >
          LUMERIS
        </span>
      )}
    </div>
  );
};
