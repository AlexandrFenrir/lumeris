/**
 * Animated Wallet Button Component
 * Cycles through 8 paper-themed button styles every 30 seconds
 * Synchronized with the logo rotation system
 */

import { useEffect, useRef, useState } from "react";
import { useMatrixCycle, ButtonStyleType } from "@/hooks/useMatrixCycle";
import { Wallet } from "lucide-react";

interface AnimatedWalletButtonProps {
  onClick: () => void;
  isConnected: boolean;
  displayText: string;
  className?: string;
}

const BUTTON_STYLES: ButtonStyleType[] = [
  "sealedScroll",
  "quillInkwell",
  "coinPurse",
  "lockbox",
  "ledgerBook",
  "waxStamp",
  "compass",
  "heraldBanner",
];

export function AnimatedWalletButton({
  onClick,
  isConnected,
  displayText,
  className = "",
}: AnimatedWalletButtonProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [clickEffect, setClickEffect] = useState(false);
  const matrixState = useMatrixCycle();

  const currentButtonStyle = matrixState.currentButtonStyle;
  const currentIndex = BUTTON_STYLES.indexOf(currentButtonStyle);
  const nextButtonStyle =
    BUTTON_STYLES[(currentIndex + 1) % BUTTON_STYLES.length];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const config = {
      width: rect.width,
      height: rect.height,
    };

    let animationFrameId: number;

    const animate = (time: number) => {
      ctx.clearRect(0, 0, config.width, config.height);

      // Apply transition if transitioning
      if (matrixState.isTransitioning) {
        applyTransition(ctx, config, time);
      } else {
        drawButtonStyle(ctx, config, currentButtonStyle, time);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const applyTransition = (
      ctx: CanvasRenderingContext2D,
      config: { width: number; height: number },
      time: number
    ) => {
      const progress = matrixState.transitionProgress / 100;

      switch (matrixState.transitionType) {
        case "fade":
          // Cross-fade between styles
          ctx.globalAlpha = 1 - progress;
          drawButtonStyle(ctx, config, currentButtonStyle, time);
          ctx.globalAlpha = progress;
          drawButtonStyle(ctx, config, nextButtonStyle, time);
          ctx.globalAlpha = 1;
          break;

        case "slide":
          // Slide left to right
          ctx.save();
          ctx.translate(-config.width * progress, 0);
          drawButtonStyle(ctx, config, currentButtonStyle, time);
          ctx.restore();

          ctx.save();
          ctx.translate(config.width * (1 - progress), 0);
          drawButtonStyle(ctx, config, nextButtonStyle, time);
          ctx.restore();
          break;

        case "dissolve":
          // Dissolve into paper color
          const paperColor = `rgba(244, 232, 193, ${progress})`;
          drawButtonStyle(ctx, config, currentButtonStyle, time);
          ctx.fillStyle = paperColor;
          ctx.fillRect(0, 0, config.width, config.height);
          ctx.globalAlpha = progress;
          drawButtonStyle(ctx, config, nextButtonStyle, time);
          ctx.globalAlpha = 1;
          break;

        case "flip":
          // Page flip effect
          const scaleX = Math.cos(progress * Math.PI);
          ctx.save();
          ctx.translate(config.width / 2, 0);
          ctx.scale(Math.abs(scaleX), 1);
          ctx.translate(-config.width / 2, 0);
          if (scaleX > 0) {
            drawButtonStyle(ctx, config, currentButtonStyle, time);
          } else {
            drawButtonStyle(ctx, config, nextButtonStyle, time);
          }
          ctx.restore();
          break;
      }
    };

    const drawButtonStyle = (
      ctx: CanvasRenderingContext2D,
      config: { width: number; height: number },
      style: ButtonStyleType,
      time: number
    ) => {
      switch (style) {
        case "sealedScroll":
          drawSealedScroll(ctx, config, time);
          break;
        case "quillInkwell":
          drawQuillInkwell(ctx, config, time);
          break;
        case "coinPurse":
          drawCoinPurse(ctx, config, time);
          break;
        case "lockbox":
          drawLockbox(ctx, config, time);
          break;
        case "ledgerBook":
          drawLedgerBook(ctx, config, time);
          break;
        case "waxStamp":
          drawWaxStamp(ctx, config, time);
          break;
        case "compass":
          drawCompass(ctx, config, time);
          break;
        case "heraldBanner":
          drawHeraldBanner(ctx, config, time);
          break;
      }
    };

    // ========== BUTTON STYLE DRAWING FUNCTIONS ==========

    const drawSealedScroll = (
      ctx: CanvasRenderingContext2D,
      config: { width: number; height: number },
      time: number
    ) => {
      const centerX = config.width / 2;
      const centerY = config.height / 2;

      // Scroll paper
      const scrollWidth = config.width * 0.8;
      const scrollHeight = config.height * 0.6;

      ctx.fillStyle = "#f4e8c1";
      ctx.strokeStyle = "#8b7355";
      ctx.lineWidth = 2;

      // Rolled edges
      ctx.beginPath();
      ctx.ellipse(
        centerX - scrollWidth / 2,
        centerY,
        8,
        scrollHeight / 2,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(
        centerX + scrollWidth / 2,
        centerY,
        8,
        scrollHeight / 2,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.stroke();

      // Main scroll body
      ctx.fillRect(
        centerX - scrollWidth / 2,
        centerY - scrollHeight / 2,
        scrollWidth,
        scrollHeight
      );
      ctx.strokeRect(
        centerX - scrollWidth / 2,
        centerY - scrollHeight / 2,
        scrollWidth,
        scrollHeight
      );

      // Wax seal in center
      const sealRadius = 20;
      const sealGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        sealRadius
      );
      sealGradient.addColorStop(0, "#8b0000");
      sealGradient.addColorStop(1, "#5c0000");

      ctx.fillStyle = sealGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, sealRadius, 0, Math.PI * 2);
      ctx.fill();

      // Seal "L" emboss
      ctx.fillStyle = "#8b000044";
      ctx.font = "bold 20px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("L", centerX, centerY);

      // Hover effect: seal cracks
      if (isHovered) {
        ctx.strokeStyle = "#5c0000";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX - 10, centerY - 10);
        ctx.lineTo(centerX + 10, centerY + 10);
        ctx.moveTo(centerX + 10, centerY - 10);
        ctx.lineTo(centerX - 10, centerY + 10);
        ctx.stroke();
      }

      // Click effect: seal breaks
      if (clickEffect) {
        ctx.strokeStyle = "#8b0000";
        ctx.lineWidth = 2;
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI * 2) / 6;
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(
            centerX + Math.cos(angle) * 30,
            centerY + Math.sin(angle) * 30
          );
          ctx.stroke();
        }
      }
    };

    const drawQuillInkwell = (
      ctx: CanvasRenderingContext2D,
      config: { width: number; height: number },
      time: number
    ) => {
      const centerX = config.width / 2;
      const centerY = config.height / 2;

      // Inkwell
      const inkwellX = config.width * 0.2;
      const inkwellY = centerY + 10;
      const inkwellWidth = 30;
      const inkwellHeight = 25;

      ctx.fillStyle = "#2c2416";
      ctx.beginPath();
      ctx.ellipse(
        inkwellX,
        inkwellY - inkwellHeight / 2,
        inkwellWidth / 2,
        8,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.fillRect(
        inkwellX - inkwellWidth / 2,
        inkwellY - inkwellHeight / 2,
        inkwellWidth,
        inkwellHeight
      );
      ctx.beginPath();
      ctx.ellipse(
        inkwellX,
        inkwellY + inkwellHeight / 2,
        inkwellWidth / 2,
        8,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Ink inside
      ctx.fillStyle = "#000080";
      ctx.beginPath();
      ctx.ellipse(
        inkwellX,
        inkwellY,
        inkwellWidth / 2 - 4,
        6,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Quill pen
      const quillX = isHovered ? inkwellX + 20 : inkwellX;
      const quillY = isHovered ? inkwellY - 30 : inkwellY - 10;

      ctx.strokeStyle = "#8b7355";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";

      // Quill shaft
      ctx.beginPath();
      ctx.moveTo(quillX, quillY);
      ctx.quadraticCurveTo(quillX + 30, quillY - 10, quillX + 60, quillY - 5);
      ctx.stroke();

      // Feather barbs
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        const t = i / 5;
        const x = quillX + 30 * t;
        const y = quillY - 10 * Math.sin(t * Math.PI);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - 5, y - 8);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - 5, y + 8);
        ctx.stroke();
      }

      // Ink drip from quill tip
      if (isHovered) {
        ctx.fillStyle = "#000080";
        const dripY = quillY + ((time * 0.5) % 20);
        ctx.beginPath();
        ctx.ellipse(quillX, dripY, 2, 4, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Click effect: ink splash
      if (clickEffect) {
        ctx.fillStyle = "#00008066";
        for (let i = 0; i < 8; i++) {
          const angle = (i * Math.PI * 2) / 8;
          const dist = 20 + Math.random() * 10;
          ctx.beginPath();
          ctx.arc(
            quillX + Math.cos(angle) * dist,
            quillY + Math.sin(angle) * dist,
            3,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      }
    };

    const drawCoinPurse = (
      ctx: CanvasRenderingContext2D,
      config: { width: number; height: number },
      time: number
    ) => {
      const centerX = config.width / 2;
      const centerY = config.height / 2;

      // Purse body
      const purseWidth = 60;
      const purseHeight = 50;
      const openAmount = isHovered ? 15 : 0;

      ctx.fillStyle = "#654321";
      ctx.strokeStyle = "#3d2817";
      ctx.lineWidth = 2;

      // Bottom half
      ctx.beginPath();
      ctx.ellipse(
        centerX,
        centerY + openAmount / 2,
        purseWidth / 2,
        purseHeight / 2,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.stroke();

      // Top half (opens on hover)
      ctx.save();
      ctx.translate(centerX, centerY - openAmount / 2);
      ctx.beginPath();
      ctx.ellipse(0, 0, purseWidth / 2, purseHeight / 2, 0, 0, Math.PI, true);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Drawstring
      ctx.strokeStyle = "#8b7355";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX - purseWidth / 2, centerY);
      ctx.quadraticCurveTo(
        centerX - purseWidth / 3,
        centerY - 20,
        centerX,
        centerY - 15
      );
      ctx.quadraticCurveTo(
        centerX + purseWidth / 3,
        centerY - 20,
        centerX + purseWidth / 2,
        centerY
      );
      ctx.stroke();

      // Coins inside (visible when open)
      if (isHovered || clickEffect) {
        const coinCount = clickEffect ? 8 : 3;
        for (let i = 0; i < coinCount; i++) {
          const angle = (i * Math.PI * 2) / coinCount;
          const dist = clickEffect ? 30 + i * 5 : 10;
          const coinX = centerX + Math.cos(angle) * dist;
          const coinY = centerY + Math.sin(angle) * dist;

          const coinGradient = ctx.createRadialGradient(
            coinX,
            coinY,
            0,
            coinX,
            coinY,
            8
          );
          coinGradient.addColorStop(0, "#ffd700");
          coinGradient.addColorStop(1, "#b8860b");

          ctx.fillStyle = coinGradient;
          ctx.beginPath();
          ctx.arc(coinX, coinY, 8, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = "#b8860b";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    };

    const drawLockbox = (
      ctx: CanvasRenderingContext2D,
      config: { width: number; height: number },
      time: number
    ) => {
      const centerX = config.width / 2;
      const centerY = config.height / 2;

      const boxWidth = 80;
      const boxHeight = 50;
      const lidOpen = isHovered ? -20 : 0;

      // Box body
      ctx.fillStyle = "#654321";
      ctx.strokeStyle = "#3d2817";
      ctx.lineWidth = 2;
      ctx.fillRect(
        centerX - boxWidth / 2,
        centerY - boxHeight / 2,
        boxWidth,
        boxHeight
      );
      ctx.strokeRect(
        centerX - boxWidth / 2,
        centerY - boxHeight / 2,
        boxWidth,
        boxHeight
      );

      // Brass corners
      ctx.fillStyle = "#b8860b";
      const cornerSize = 8;
      [
        [centerX - boxWidth / 2, centerY - boxHeight / 2],
        [centerX + boxWidth / 2 - cornerSize, centerY - boxHeight / 2],
        [centerX - boxWidth / 2, centerY + boxHeight / 2 - cornerSize],
        [
          centerX + boxWidth / 2 - cornerSize,
          centerY + boxHeight / 2 - cornerSize,
        ],
      ].forEach(([x, y]) => {
        ctx.fillRect(x, y, cornerSize, cornerSize);
      });

      // Lid
      ctx.save();
      ctx.translate(centerX, centerY - boxHeight / 2);
      ctx.rotate((lidOpen * Math.PI) / 180);
      ctx.fillStyle = "#654321";
      ctx.fillRect(-boxWidth / 2, -10, boxWidth, 10);
      ctx.strokeRect(-boxWidth / 2, -10, boxWidth, 10);
      ctx.restore();

      // Keyhole
      const keyholeY = centerY;
      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.arc(centerX, keyholeY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(centerX - 2, keyholeY, 4, 12);

      // Key (appears on hover)
      if (isHovered) {
        const keyX = centerX + 30;
        const keyY = keyholeY;

        ctx.fillStyle = "#ffd700";
        ctx.strokeStyle = "#b8860b";
        ctx.lineWidth = 2;

        // Key shaft
        ctx.fillRect(keyX, keyY - 2, 25, 4);
        ctx.strokeRect(keyX, keyY - 2, 25, 4);

        // Key head
        ctx.beginPath();
        ctx.arc(keyX, keyY, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Key teeth
        ctx.fillRect(keyX + 25, keyY - 6, 3, 4);
        ctx.fillRect(keyX + 28, keyY - 4, 3, 4);
      }

      // Click effect: lock opens with light
      if (clickEffect) {
        const lightGradient = ctx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          40
        );
        lightGradient.addColorStop(0, "rgba(255, 215, 0, 0.5)");
        lightGradient.addColorStop(1, "rgba(255, 215, 0, 0)");
        ctx.fillStyle = lightGradient;
        ctx.fillRect(centerX - 40, centerY - 40, 80, 80);
      }
    };

    const drawLedgerBook = (
      ctx: CanvasRenderingContext2D,
      config: { width: number; height: number },
      time: number
    ) => {
      const centerX = config.width / 2;
      const centerY = config.height / 2;

      const bookWidth = 70;
      const bookHeight = 50;
      const openAngle = isHovered ? 30 : 0;

      // Book cover (left page)
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate((-openAngle * Math.PI) / 180);
      ctx.fillStyle = "#654321";
      ctx.strokeStyle = "#3d2817";
      ctx.lineWidth = 2;
      ctx.fillRect(-bookWidth / 2, -bookHeight / 2, bookWidth / 2, bookHeight);
      ctx.strokeRect(
        -bookWidth / 2,
        -bookHeight / 2,
        bookWidth / 2,
        bookHeight
      );

      // Gold embossing
      ctx.fillStyle = "#ffd700";
      ctx.font = "bold 12px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("L", -bookWidth / 4, 0);
      ctx.restore();

      // Book cover (right page)
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate((openAngle * Math.PI) / 180);
      ctx.fillStyle = "#654321";
      ctx.fillRect(0, -bookHeight / 2, bookWidth / 2, bookHeight);
      ctx.strokeRect(0, -bookHeight / 2, bookWidth / 2, bookHeight);
      ctx.restore();

      // Pages (visible when open)
      if (isHovered) {
        ctx.fillStyle = "#f4e8c1";
        ctx.fillRect(
          centerX - bookWidth / 4,
          centerY - bookHeight / 2 + 5,
          bookWidth / 2,
          bookHeight - 10
        );

        // Ledger lines
        ctx.strokeStyle = "#8b735544";
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
          const y = centerY - bookHeight / 2 + 10 + i * 8;
          ctx.beginPath();
          ctx.moveTo(centerX - bookWidth / 4 + 5, y);
          ctx.lineTo(centerX + bookWidth / 4 - 5, y);
          ctx.stroke();
        }
      }

      // Bookmark ribbon
      ctx.fillStyle = "#8b0000";
      ctx.fillRect(centerX - 2, centerY - bookHeight / 2, 4, bookHeight + 10);

      // Click effect: pages flutter
      if (clickEffect) {
        ctx.strokeStyle = "#f4e8c144";
        ctx.lineWidth = 2;
        for (let i = 0; i < 5; i++) {
          const offset = Math.sin(time * 0.01 + i) * 10;
          ctx.beginPath();
          ctx.moveTo(centerX + offset, centerY - bookHeight / 2);
          ctx.lineTo(centerX + offset, centerY + bookHeight / 2);
          ctx.stroke();
        }
      }
    };

    const drawWaxStamp = (
      ctx: CanvasRenderingContext2D,
      config: { width: number; height: number },
      time: number
    ) => {
      const centerX = config.width / 2;
      const centerY = config.height / 2;

      // Wax pool
      const waxRadius = 25;
      ctx.fillStyle = "#8b0000";
      ctx.beginPath();
      ctx.arc(centerX, centerY + 10, waxRadius, 0, Math.PI * 2);
      ctx.fill();

      // Wax drips
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI * 2) / 8;
        const dripX = centerX + Math.cos(angle) * waxRadius;
        const dripY = centerY + 10 + Math.sin(angle) * waxRadius;
        const dripLength = 3 + Math.sin(time * 0.001 + i) * 2;

        ctx.beginPath();
        ctx.moveTo(dripX, dripY);
        ctx.lineTo(
          dripX + Math.cos(angle) * dripLength,
          dripY + Math.sin(angle) * dripLength
        );
        ctx.strokeStyle = "#5c0000";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Stamp handle
      const stampY = isHovered ? centerY - 20 : centerY - 30;
      const stampHeight = 25;

      ctx.fillStyle = "#654321";
      ctx.fillRect(centerX - 15, stampY - stampHeight, 30, stampHeight);
      ctx.strokeStyle = "#3d2817";
      ctx.lineWidth = 2;
      ctx.strokeRect(centerX - 15, stampY - stampHeight, 30, stampHeight);

      // Stamp base (brass)
      ctx.fillStyle = "#b8860b";
      ctx.fillRect(centerX - 20, stampY, 40, 8);
      ctx.strokeRect(centerX - 20, stampY, 40, 8);

      // "L" on stamp base
      ctx.fillStyle = "#654321";
      ctx.font = "bold 14px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("L", centerX, stampY + 4);

      // Impression in wax (when pressed)
      if (isHovered || clickEffect) {
        ctx.fillStyle = "#5c000088";
        ctx.font = "bold 20px serif";
        ctx.fillText("L", centerX, centerY + 10);
      }

      // Click effect: stamp press with ink halo
      if (clickEffect) {
        const haloGradient = ctx.createRadialGradient(
          centerX,
          centerY + 10,
          0,
          centerX,
          centerY + 10,
          40
        );
        haloGradient.addColorStop(0, "rgba(139, 0, 0, 0.5)");
        haloGradient.addColorStop(1, "rgba(139, 0, 0, 0)");
        ctx.fillStyle = haloGradient;
        ctx.fillRect(centerX - 40, centerY - 30, 80, 80);
      }
    };

    const drawCompass = (
      ctx: CanvasRenderingContext2D,
      config: { width: number; height: number },
      time: number
    ) => {
      const centerX = config.width / 2;
      const centerY = config.height / 2;
      const radius = 30;

      // Compass body (brass)
      const bodyGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        radius
      );
      bodyGradient.addColorStop(0, "#d4af37");
      bodyGradient.addColorStop(1, "#b8860b");

      ctx.fillStyle = bodyGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#8b6914";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Compass face
      ctx.fillStyle = "#f4e8c1";
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius - 5, 0, Math.PI * 2);
      ctx.fill();

      // Cardinal directions
      ctx.fillStyle = "#2c2416";
      ctx.font = "bold 10px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const directions = ["N", "E", "S", "W"];
      directions.forEach((dir, i) => {
        const angle = (i * Math.PI) / 2 - Math.PI / 2;
        const x = centerX + Math.cos(angle) * (radius - 12);
        const y = centerY + Math.sin(angle) * (radius - 12);
        ctx.fillText(dir, x, y);
      });

      // Needle
      const needleAngle = isHovered ? time * 0.005 : -Math.PI / 2; // Spin when hovered, point north otherwise

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(needleAngle);

      // North pointer (red)
      ctx.fillStyle = "#8b0000";
      ctx.beginPath();
      ctx.moveTo(0, -radius + 10);
      ctx.lineTo(-4, 0);
      ctx.lineTo(4, 0);
      ctx.closePath();
      ctx.fill();

      // South pointer (white)
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.moveTo(0, radius - 10);
      ctx.lineTo(-4, 0);
      ctx.lineTo(4, 0);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      // Center pin
      ctx.fillStyle = "#8b6914";
      ctx.beginPath();
      ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
      ctx.fill();

      // Click effect: compass glows
      if (clickEffect) {
        const glowGradient = ctx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          radius + 10
        );
        glowGradient.addColorStop(0, "rgba(212, 175, 55, 0.5)");
        glowGradient.addColorStop(1, "rgba(212, 175, 55, 0)");
        ctx.fillStyle = glowGradient;
        ctx.fillRect(
          centerX - radius - 10,
          centerY - radius - 10,
          (radius + 10) * 2,
          (radius + 10) * 2
        );
      }
    };

    const drawHeraldBanner = (
      ctx: CanvasRenderingContext2D,
      config: { width: number; height: number },
      time: number
    ) => {
      const centerX = config.width / 2;
      const centerY = config.height / 2;

      const bannerWidth = 60;
      const bannerHeight = isHovered ? 50 : 30;
      const poleHeight = 60;

      // Pole
      ctx.fillStyle = "#654321";
      ctx.fillRect(centerX - 3, centerY - poleHeight / 2, 6, poleHeight);

      // Pole top (gold finial)
      ctx.fillStyle = "#ffd700";
      ctx.beginPath();
      ctx.arc(centerX, centerY - poleHeight / 2, 5, 0, Math.PI * 2);
      ctx.fill();

      // Banner fabric
      ctx.fillStyle = "#8b0000";
      ctx.strokeStyle = "#5c0000";
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY - poleHeight / 2 + 10);
      ctx.lineTo(centerX + bannerWidth, centerY - poleHeight / 2 + 10);
      ctx.lineTo(
        centerX + bannerWidth,
        centerY - poleHeight / 2 + 10 + bannerHeight
      );

      // Triangular bottom
      ctx.lineTo(
        centerX + bannerWidth / 2,
        centerY - poleHeight / 2 + 10 + bannerHeight + 10
      );
      ctx.lineTo(centerX, centerY - poleHeight / 2 + 10 + bannerHeight);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Fabric wave effect
      if (isHovered) {
        ctx.strokeStyle = "#5c000066";
        ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
          const waveY = centerY - poleHeight / 2 + 20 + i * 15;
          ctx.beginPath();
          ctx.moveTo(centerX + 5, waveY);
          for (let x = 0; x < bannerWidth - 5; x += 5) {
            const y = waveY + Math.sin((x + time * 0.1) * 0.2) * 2;
            ctx.lineTo(centerX + 5 + x, y);
          }
          ctx.stroke();
        }
      }

      // Heraldic symbol (L)
      ctx.fillStyle = "#ffd700";
      ctx.font = "bold 24px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        "L",
        centerX + bannerWidth / 2,
        centerY - poleHeight / 2 + 10 + bannerHeight / 2
      );

      // Click effect: banner unfurls with shimmer
      if (clickEffect) {
        const shimmerGradient = ctx.createLinearGradient(
          centerX,
          centerY - poleHeight / 2,
          centerX + bannerWidth,
          centerY - poleHeight / 2 + bannerHeight
        );
        shimmerGradient.addColorStop(0, "rgba(255, 215, 0, 0)");
        shimmerGradient.addColorStop(0.5, "rgba(255, 215, 0, 0.5)");
        shimmerGradient.addColorStop(1, "rgba(255, 215, 0, 0)");
        ctx.fillStyle = shimmerGradient;
        ctx.fillRect(
          centerX,
          centerY - poleHeight / 2 + 10,
          bannerWidth,
          bannerHeight + 10
        );
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [matrixState, isHovered, clickEffect, isConnected]);

  const handleClick = () => {
    setClickEffect(true);
    setTimeout(() => setClickEffect(false), 500);
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden ${className}`}
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: 0,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          color: "#2c2416",
          fontWeight: 600,
          fontSize: "14px",
          textShadow: "0 1px 2px rgba(255,255,255,0.5)",
        }}
      >
        {!isConnected && (
          <Wallet className="w-4 h-4 mr-2" style={{ display: "inline" }} />
        )}
        <span>{displayText}</span>
      </div>
    </button>
  );
}
