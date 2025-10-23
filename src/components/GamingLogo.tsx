/**
 * Gaming Logo Component
 * Cycles through 8 gaming themes, each with 5 unique logo styles
 * Total: 40 different logo animations
 * Theme changes every 20 seconds, logos rotate every 4 seconds within theme
 */

import { useEffect, useRef, useState } from "react";
import {
  useMatrixCycle,
  GameThemeType,
  LogoStyleType,
} from "@/hooks/useMatrixCycle";

interface GamingLogoProps {
  size?: "small" | "medium" | "large";
  showText?: boolean;
  className?: string;
}

const SIZE_CONFIG = {
  small: { container: 40, canvas: 40, text: "text-sm" },
  medium: { container: 60, canvas: 60, text: "text-base" },
  large: { container: 200, canvas: 200, text: "text-2xl" },
};

export function GamingLogo({
  size = "medium",
  showText = false,
  className = "",
}: GamingLogoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [clickEffect, setClickEffect] = useState(false);
  const matrixState = useMatrixCycle();

  const config = SIZE_CONFIG[size];
  const currentTheme = matrixState.currentTheme;
  const currentLogoStyle = matrixState.currentLogoStyle;

  const handleClick = () => {
    setClickEffect(true);
    setTimeout(() => setClickEffect(false), 600);
  };

  // ========== HELPER: DRAW STELLAR MONOGRAM LOGO ==========
  const drawLumerisLogo = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    size: number,
    color: string,
    style: "filled" | "outlined" | "glowing" = "filled"
  ) => {
    ctx.save();
    ctx.translate(centerX, centerY);

    // Stylized "L" with star theme
    ctx.font = `bold ${size}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Create gold-to-silver gradient for the "L"
    const gradient = ctx.createLinearGradient(0, -size / 2, 0, size / 2);
    gradient.addColorStop(0, "#FFD700"); // Gold top
    gradient.addColorStop(0.5, "#C0C0C0"); // Silver middle
    gradient.addColorStop(1, "#FFD700"); // Gold bottom

    if (style === "glowing") {
      // Stellar glow effect
      ctx.shadowColor = "#FFD700";
      ctx.shadowBlur = 15;
      ctx.fillStyle = gradient;
      ctx.fillText("L", 0, 0);

      // Add extra glow layers
      ctx.shadowBlur = 25;
      ctx.fillText("L", 0, 0);
    } else if (style === "outlined") {
      // Outlined with gradient stroke
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.strokeText("L", 0, 0);

      // Add subtle glow to outline
      ctx.shadowColor = "#FFD700";
      ctx.shadowBlur = 8;
      ctx.strokeText("L", 0, 0);
    } else {
      // Filled with gradient
      ctx.fillStyle = gradient;
      ctx.fillText("L", 0, 0);

      // Add subtle edge glow
      ctx.shadowColor = "#FFD700";
      ctx.shadowBlur = 5;
      ctx.fillText("L", 0, 0);
    }

    // Draw small stars around the "L" for stellar theme
    if (style === "glowing" || style === "filled") {
      const starPositions = [
        { x: -size * 0.6, y: -size * 0.5 },
        { x: size * 0.6, y: -size * 0.5 },
        { x: size * 0.7, y: size * 0.3 },
      ];

      starPositions.forEach((pos) => {
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#FFD700";
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, size * 0.05, 0, Math.PI * 2);
        ctx.fill();

        // Star sparkle
        ctx.shadowColor = "#FFD700";
        ctx.shadowBlur = 8;
        ctx.fill();
      });
    }

    ctx.shadowBlur = 0;
    ctx.restore();
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

    let animationFrameId: number;

    const animate = (time: number) => {
      ctx.clearRect(0, 0, config.canvas, config.canvas);
      drawLogoForTheme(
        ctx,
        config.canvas,
        currentTheme,
        currentLogoStyle,
        time
      );
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [currentTheme, currentLogoStyle, isHovered, clickEffect, config.canvas]);

  // ========== MAIN THEME ROUTER ==========
  const drawLogoForTheme = (
    ctx: CanvasRenderingContext2D,
    size: number,
    theme: GameThemeType,
    logoStyle: LogoStyleType,
    time: number
  ) => {
    const centerX = size / 2;
    const centerY = size / 2;

    switch (theme) {
      case "retroArcade":
        drawRetroArcadeLogo(ctx, centerX, centerY, logoStyle, time);
        break;
      case "modernGaming":
        drawModernGamingLogo(ctx, centerX, centerY, logoStyle, time);
        break;
      case "sciFiSpace":
        drawSciFiSpaceLogo(ctx, centerX, centerY, logoStyle, time);
        break;
      case "fantasyRPG":
        drawFantasyRPGLogo(ctx, centerX, centerY, logoStyle, time);
        break;
      case "racingSports":
        drawRacingSportsLogo(ctx, centerX, centerY, logoStyle, time);
        break;
      case "horrorSurvival":
        drawHorrorSurvivalLogo(ctx, centerX, centerY, logoStyle, time);
        break;
      case "cyberpunkTech":
        drawCyberpunkTechLogo(ctx, centerX, centerY, logoStyle, time);
        break;
      case "casinoGambling":
        drawCasinoGamblingLogo(ctx, centerX, centerY, logoStyle, time);
        break;
    }
  };

  // ========== RETRO ARCADE THEME (5 logos) ==========
  const drawRetroArcadeLogo = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    logoStyle: LogoStyleType,
    time: number
  ) => {
    switch (logoStyle) {
      case "style1": // Pixel Art Logo
        ctx.fillStyle = "#ff00ff";
        const pixelSize = 4;
        const pattern = [
          [0, 1, 1, 1, 0],
          [1, 0, 0, 0, 1],
          [1, 1, 1, 1, 1],
          [1, 0, 0, 0, 1],
          [1, 0, 0, 0, 1],
        ];
        for (let y = 0; y < 5; y++) {
          for (let x = 0; x < 5; x++) {
            if (pattern[y][x]) {
              ctx.fillRect(
                centerX - 10 + x * pixelSize,
                centerY - 10 + y * pixelSize,
                pixelSize,
                pixelSize
              );
            }
          }
        }
        break;

      case "style2": // Arcade Cabinet
        ctx.fillStyle = "#222";
        ctx.fillRect(centerX - 15, centerY - 20, 30, 40);
        ctx.fillStyle = "#00ffff";
        ctx.fillRect(centerX - 12, centerY - 15, 24, 20);
        ctx.fillStyle = "#ff0000";
        ctx.beginPath();
        ctx.arc(centerX, centerY + 10, 5, 0, Math.PI * 2);
        ctx.fill();
        break;

      case "style3": // Joystick
        const joyAngle = (time * 0.002) % (Math.PI * 2);
        ctx.strokeStyle = "#ffff00";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY + 10);
        ctx.lineTo(
          centerX + Math.cos(joyAngle) * 10,
          centerY - 10 + Math.sin(joyAngle) * 10
        );
        ctx.stroke();
        ctx.fillStyle = "#ff0000";
        ctx.beginPath();
        ctx.arc(
          centerX + Math.cos(joyAngle) * 10,
          centerY - 10 + Math.sin(joyAngle) * 10,
          8,
          0,
          Math.PI * 2
        );
        ctx.fill();
        break;

      case "style4": // Power-Up Coin
        const spin = (time * 0.005) % (Math.PI * 2);
        const scaleX = Math.cos(spin);
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.scale(Math.abs(scaleX), 1);
        ctx.fillStyle = "#ffd700";
        ctx.beginPath();
        ctx.arc(0, 0, 15, 0, Math.PI * 2);
        ctx.fill();
        // Draw Lumeris logo instead of "L"
        drawLumerisLogo(ctx, 0, 0, 12, "#000", "filled");
        ctx.restore();
        break;

      case "style5": // High Score Display
        const blink = Math.floor(time * 0.003) % 2;
        ctx.fillStyle = blink ? "#00ff00" : "#00ff0066";
        ctx.font = "bold 12px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("HIGH", centerX, centerY - 8);
        ctx.fillText("SCORE", centerX, centerY + 8);
        break;
    }
  };

  // ========== MODERN GAMING THEME (5 logos) ==========
  const drawModernGamingLogo = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    logoStyle: LogoStyleType,
    time: number
  ) => {
    switch (logoStyle) {
      case "style1": // Hologram Projection
        const rotation = (time * 0.002) % (Math.PI * 2);
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation);
        ctx.strokeStyle = "#00ff88";
        ctx.lineWidth = 2;
        ctx.strokeRect(-15, -15, 30, 30);
        ctx.strokeRect(-12, -12, 24, 24);
        ctx.restore();
        break;

      case "style2": // Energy Core
        const pulse = Math.sin(time * 0.005) * 5 + 15;
        const gradient = ctx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          pulse
        );
        gradient.addColorStop(0, "#00ff88");
        gradient.addColorStop(1, "#00ff8800");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, pulse, 0, Math.PI * 2);
        ctx.fill();
        break;

      case "style3": // Shield Emblem
        ctx.strokeStyle = "#0088ff";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - 20);
        ctx.lineTo(centerX + 15, centerY - 10);
        ctx.lineTo(centerX + 15, centerY + 10);
        ctx.lineTo(centerX, centerY + 20);
        ctx.lineTo(centerX - 15, centerY + 10);
        ctx.lineTo(centerX - 15, centerY - 10);
        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle = "#0088ff44";
        ctx.fill();
        break;

      case "style4": // Weapon Sight
        ctx.strokeStyle = "#ff0088";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(centerX - 20, centerY);
        ctx.lineTo(centerX - 5, centerY);
        ctx.moveTo(centerX + 5, centerY);
        ctx.lineTo(centerX + 20, centerY);
        ctx.moveTo(centerX, centerY - 20);
        ctx.lineTo(centerX, centerY - 5);
        ctx.moveTo(centerX, centerY + 5);
        ctx.lineTo(centerX, centerY + 20);
        ctx.stroke();
        break;

      case "style5": // Rank Badge
        ctx.fillStyle = "#ffd700";
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
          const x = centerX + Math.cos(angle) * 15;
          const y = centerY + Math.sin(angle) * 15;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        // Draw Lumeris logo instead of "L"
        drawLumerisLogo(ctx, centerX, centerY, 12, "#000", "filled");
        break;
    }
  };

  // ========== SCI-FI SPACE THEME (5 logos) ==========
  const drawSciFiSpaceLogo = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    logoStyle: LogoStyleType,
    time: number
  ) => {
    switch (logoStyle) {
      case "style1": // Orbital Station
        const orbitAngle = (time * 0.002) % (Math.PI * 2);
        ctx.strokeStyle = "#4444ff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "#8844ff";
        ctx.beginPath();
        ctx.arc(
          centerX + Math.cos(orbitAngle) * 15,
          centerY + Math.sin(orbitAngle) * 15,
          4,
          0,
          Math.PI * 2
        );
        ctx.fill();
        break;

      case "style2": // Warp Gate
        const warpRotation = (time * 0.003) % (Math.PI * 2);
        for (let i = 0; i < 3; i++) {
          ctx.strokeStyle = `rgba(136, 68, 255, ${1 - i * 0.3})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(
            centerX,
            centerY,
            10 + i * 5,
            warpRotation,
            warpRotation + Math.PI
          );
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(
            centerX,
            centerY,
            10 + i * 5,
            warpRotation + Math.PI,
            warpRotation + Math.PI * 2
          );
          ctx.stroke();
        }
        break;

      case "style3": // Constellation
        const stars = [
          { x: 0, y: -15 },
          { x: 10, y: -5 },
          { x: 10, y: 10 },
          { x: -10, y: 10 },
          { x: -10, y: -5 },
        ];
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;
        ctx.beginPath();
        stars.forEach((star, i) => {
          if (i === 0) ctx.moveTo(centerX + star.x, centerY + star.y);
          else ctx.lineTo(centerX + star.x, centerY + star.y);
        });
        ctx.closePath();
        ctx.stroke();
        stars.forEach((star) => {
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(centerX + star.x, centerY + star.y, 2, 0, Math.PI * 2);
          ctx.fill();
        });
        break;

      case "style4": // Black Hole
        const blackHoleGradient = ctx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          20
        );
        blackHoleGradient.addColorStop(0, "#000000");
        blackHoleGradient.addColorStop(0.7, "#4444ff");
        blackHoleGradient.addColorStop(1, "#8844ff");
        ctx.fillStyle = blackHoleGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
        ctx.fill();
        break;

      case "style5": // Satellite
        ctx.fillStyle = "#4444ff";
        ctx.fillRect(centerX - 8, centerY - 8, 16, 16);
        ctx.fillStyle = "#8844ff";
        ctx.fillRect(centerX - 15, centerY - 3, 7, 6);
        ctx.fillRect(centerX + 8, centerY - 3, 7, 6);
        const beaconBlink = Math.floor(time * 0.005) % 2;
        if (beaconBlink) {
          ctx.fillStyle = "#ff0000";
          ctx.beginPath();
          ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
    }
  };

  // ========== FANTASY RPG THEME (5 logos) ==========
  const drawFantasyRPGLogo = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    logoStyle: LogoStyleType,
    time: number
  ) => {
    switch (logoStyle) {
      case "style1": // Rune Stone
        ctx.fillStyle = "#666";
        ctx.beginPath();
        ctx.arc(centerX, centerY, 18, 0, Math.PI * 2);
        ctx.fill();
        const runeGlow = Math.sin(time * 0.005) * 0.5 + 0.5;
        ctx.strokeStyle = `rgba(255, 136, 0, ${runeGlow})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - 10);
        ctx.lineTo(centerX - 8, centerY + 10);
        ctx.lineTo(centerX + 8, centerY + 10);
        ctx.closePath();
        ctx.stroke();
        break;

      case "style2": // Crystal Shard
        const float = Math.sin(time * 0.003) * 5;
        ctx.fillStyle = "#8800ff";
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - 15 + float);
        ctx.lineTo(centerX + 8, centerY + float);
        ctx.lineTo(centerX + 5, centerY + 15 + float);
        ctx.lineTo(centerX - 5, centerY + 15 + float);
        ctx.lineTo(centerX - 8, centerY + float);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "#ff00ff";
        ctx.lineWidth = 2;
        ctx.stroke();
        break;

      case "style3": // Spell Circle
        const circleRotation = (time * 0.002) % (Math.PI * 2);
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(circleRotation);
        ctx.strokeStyle = "#ffdd00";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 15, 0, Math.PI * 2);
        ctx.stroke();
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI * 2) / 6;
          ctx.beginPath();
          ctx.moveTo(Math.cos(angle) * 10, Math.sin(angle) * 10);
          ctx.lineTo(Math.cos(angle) * 15, Math.sin(angle) * 15);
          ctx.stroke();
        }
        ctx.restore();
        break;

      case "style4": // Dragon Eye
        const eyeOpen = Math.sin(time * 0.002) > 0.9 ? 0.3 : 1;
        ctx.fillStyle = "#ff8800";
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, 15, 10 * eyeOpen, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, 6, 8 * eyeOpen, 0, 0, Math.PI * 2);
        ctx.fill();
        break;

      case "style5": // Enchanted Gem
        const gemPulse = Math.sin(time * 0.005) * 3 + 12;
        const gemGradient = ctx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          gemPulse
        );
        gemGradient.addColorStop(0, "#ffdd00");
        gemGradient.addColorStop(0.5, "#ff8800");
        gemGradient.addColorStop(1, "#8800ff");
        ctx.fillStyle = gemGradient;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI * 2) / 6;
          const x = centerX + Math.cos(angle) * gemPulse;
          const y = centerY + Math.sin(angle) * gemPulse;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        break;
    }
  };

  // ========== RACING/SPORTS THEME (5 logos) ==========
  const drawRacingSportsLogo = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    logoStyle: LogoStyleType,
    time: number
  ) => {
    switch (logoStyle) {
      case "style1": // Finish Line
        const wave = Math.sin(time * 0.005);
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            ctx.fillStyle = (i + j) % 2 === 0 ? "#ffffff" : "#000000";
            ctx.fillRect(
              centerX - 12 + i * 6,
              centerY - 12 + j * 6 + wave * 2,
              6,
              6
            );
          }
        }
        break;

      case "style2": // Turbo Boost
        for (let i = 0; i < 5; i++) {
          const x = centerX - 20 + ((time * 0.5 + i * 10) % 40);
          ctx.fillStyle = `rgba(255, 136, 0, ${1 - ((time * 0.5 + i * 10) % 40) / 40})`;
          ctx.beginPath();
          ctx.moveTo(x, centerY - 5);
          ctx.lineTo(x - 8, centerY);
          ctx.lineTo(x, centerY + 5);
          ctx.closePath();
          ctx.fill();
        }
        break;

      case "style3": // Trophy Cup
        ctx.fillStyle = "#ffd700";
        ctx.beginPath();
        ctx.moveTo(centerX - 12, centerY - 10);
        ctx.lineTo(centerX - 8, centerY + 5);
        ctx.lineTo(centerX + 8, centerY + 5);
        ctx.lineTo(centerX + 12, centerY - 10);
        ctx.closePath();
        ctx.fill();
        ctx.fillRect(centerX - 3, centerY + 5, 6, 8);
        ctx.fillRect(centerX - 8, centerY + 13, 16, 2);
        break;

      case "style4": // Pit Stop
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(centerX - 8, centerY, 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(centerX + 8, centerY, 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "#ff0000";
        ctx.fillRect(centerX - 12, centerY - 8, 24, 8);
        break;

      case "style5": // Speedometer
        const needleAngle =
          Math.sin(time * 0.003) * Math.PI * 0.8 - Math.PI * 0.4;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 15, Math.PI * 0.6, Math.PI * 2.4);
        ctx.stroke();
        ctx.strokeStyle = "#ff0000";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
          centerX + Math.cos(needleAngle) * 12,
          centerY + Math.sin(needleAngle) * 12
        );
        ctx.stroke();
        break;
    }
  };

  // ========== HORROR/SURVIVAL THEME (5 logos) ==========
  const drawHorrorSurvivalLogo = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    logoStyle: LogoStyleType,
    time: number
  ) => {
    switch (logoStyle) {
      case "style1": // Flashlight Beam
        const beamAngle = Math.sin(time * 0.002) * Math.PI * 0.3;
        const beamGradient = ctx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          25
        );
        beamGradient.addColorStop(0, "#ffff00");
        beamGradient.addColorStop(1, "#ffff0000");
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(beamAngle);
        ctx.fillStyle = beamGradient;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, 25, -Math.PI / 6, Math.PI / 6);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        break;

      case "style2": // Warning Sign
        const warningBlink = Math.floor(time * 0.005) % 2;
        ctx.strokeStyle = warningBlink ? "#ff0000" : "#880000";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - 15);
        ctx.lineTo(centerX + 15, centerY + 15);
        ctx.lineTo(centerX - 15, centerY + 15);
        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle = warningBlink ? "#ff0000" : "#880000";
        ctx.font = "bold 16px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("!", centerX, centerY + 3);
        break;

      case "style3": // Heartbeat Monitor
        ctx.strokeStyle = "#ff0000";
        ctx.lineWidth = 2;
        ctx.beginPath();
        const heartbeat = Math.sin(time * 0.01) > 0.8 ? 10 : 0;
        ctx.moveTo(centerX - 20, centerY);
        ctx.lineTo(centerX - 10, centerY);
        ctx.lineTo(centerX - 5, centerY - heartbeat);
        ctx.lineTo(centerX, centerY + heartbeat);
        ctx.lineTo(centerX + 5, centerY - heartbeat);
        ctx.lineTo(centerX + 10, centerY);
        ctx.lineTo(centerX + 20, centerY);
        ctx.stroke();
        break;

      case "style4": // Ammo Counter
        const ammoCount = Math.floor((time * 0.001) % 10);
        ctx.fillStyle = ammoCount < 3 ? "#ff0000" : "#00ff00";
        ctx.font = "bold 20px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(ammoCount.toString(), centerX, centerY);
        break;

      case "style5": // Safe Room Door
        const doorOpen = Math.sin(time * 0.002) > 0 ? 0 : 10;
        ctx.fillStyle = "#654321";
        ctx.fillRect(centerX - 15 - doorOpen, centerY - 20, 15, 40);
        ctx.fillRect(centerX + doorOpen, centerY - 20, 15, 40);
        ctx.strokeStyle = "#ff0000";
        ctx.lineWidth = 2;
        ctx.strokeRect(centerX - 15 - doorOpen, centerY - 20, 15, 40);
        ctx.strokeRect(centerX + doorOpen, centerY - 20, 15, 40);
        break;
    }
  };

  // ========== CYBERPUNK TECH THEME (5 logos) ==========
  const drawCyberpunkTechLogo = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    logoStyle: LogoStyleType,
    time: number
  ) => {
    switch (logoStyle) {
      case "style1": // Neural Link
        ctx.strokeStyle = "#00ffff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 12, 0, Math.PI * 2);
        ctx.stroke();
        for (let i = 0; i < 4; i++) {
          const angle = (i * Math.PI * 2) / 4 + time * 0.002;
          ctx.beginPath();
          ctx.moveTo(
            centerX + Math.cos(angle) * 12,
            centerY + Math.sin(angle) * 12
          );
          ctx.lineTo(
            centerX + Math.cos(angle) * 20,
            centerY + Math.sin(angle) * 20
          );
          ctx.stroke();
        }
        break;

      case "style2": // Neon Sign
        const neonFlicker = Math.random() > 0.9 ? 0.5 : 1;
        const neonColor = `rgba(255, 0, 255, ${neonFlicker})`;
        // Draw Lumeris logo with neon glow effect
        ctx.shadowColor = neonColor;
        ctx.shadowBlur = 15;
        drawLumerisLogo(ctx, centerX, centerY, 20, neonColor, "glowing");
        ctx.shadowBlur = 0;
        break;

      case "style3": // Hacking Terminal
        ctx.fillStyle = "#00ff00";
        ctx.font = "10px monospace";
        ctx.textAlign = "center";
        for (let i = 0; i < 4; i++) {
          const code = Math.random() > 0.5 ? "1" : "0";
          ctx.fillText(
            code,
            centerX - 10 + i * 7,
            centerY - 10 + ((time * 0.1 + i * 5) % 30)
          );
        }
        break;

      case "style4": // Cyber Eye
        ctx.strokeStyle = "#ff00ff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, 15, 10, 0, 0, Math.PI * 2);
        ctx.stroke();
        const pupilX = centerX + Math.sin(time * 0.003) * 5;
        ctx.fillStyle = "#00ffff";
        ctx.beginPath();
        ctx.arc(pupilX, centerY, 5, 0, Math.PI * 2);
        ctx.fill();
        break;

      case "style5": // Data Chip
        ctx.fillStyle = "#0a0a1a";
        ctx.fillRect(centerX - 12, centerY - 15, 24, 30);
        ctx.strokeStyle = "#ffff00";
        ctx.lineWidth = 2;
        ctx.strokeRect(centerX - 12, centerY - 15, 24, 30);
        for (let i = 0; i < 5; i++) {
          ctx.strokeStyle = "#00ffff";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(centerX - 12, centerY - 10 + i * 5);
          ctx.lineTo(centerX + 12, centerY - 10 + i * 5);
          ctx.stroke();
        }
        break;
    }
  };

  // ========== CASINO/GAMBLING THEME (5 logos) ==========
  const drawCasinoGamblingLogo = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    logoStyle: LogoStyleType,
    time: number
  ) => {
    switch (logoStyle) {
      case "style1": // Poker Chip
        const chipRotation = (time * 0.003) % (Math.PI * 2);
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(chipRotation);
        ctx.fillStyle = "#ff0000";
        ctx.beginPath();
        ctx.arc(0, 0, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();
        for (let i = 0; i < 8; i++) {
          const angle = (i * Math.PI * 2) / 8;
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(
            Math.cos(angle) * 12 - 1,
            Math.sin(angle) * 12 - 3,
            2,
            6
          );
        }
        ctx.restore();
        break;

      case "style2": // Dice Roll
        const diceValue = Math.floor((time * 0.001) % 6) + 1;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(centerX - 12, centerY - 12, 24, 24);
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.strokeRect(centerX - 12, centerY - 12, 24, 24);
        ctx.fillStyle = "#000";
        if (diceValue === 1) {
          ctx.beginPath();
          ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
          ctx.fill();
        } else if (diceValue === 6) {
          for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 3; j++) {
              ctx.beginPath();
              ctx.arc(
                centerX - 6 + i * 12,
                centerY - 8 + j * 8,
                2,
                0,
                Math.PI * 2
              );
              ctx.fill();
            }
          }
        }
        break;

      case "style3": // Slot Machine
        const reel1 = Math.floor((time * 0.01) % 3);
        const reel2 = Math.floor((time * 0.015) % 3);
        const reel3 = Math.floor((time * 0.02) % 3);
        const symbols = ["7", "$", "★"];
        ctx.fillStyle = "#ffd700";
        ctx.font = "bold 14px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(symbols[reel1], centerX - 12, centerY);
        ctx.fillText(symbols[reel2], centerX, centerY);
        ctx.fillText(symbols[reel3], centerX + 12, centerY);
        break;

      case "style4": // Roulette Wheel
        const rouletteRotation = (time * 0.005) % (Math.PI * 2);
        for (let i = 0; i < 12; i++) {
          const angle = (i * Math.PI * 2) / 12 + rouletteRotation;
          ctx.fillStyle = i % 2 === 0 ? "#ff0000" : "#000000";
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.arc(centerX, centerY, 15, angle, angle + Math.PI / 6);
          ctx.closePath();
          ctx.fill();
        }
        ctx.fillStyle = "#ffd700";
        ctx.beginPath();
        ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
        ctx.fill();
        break;

      case "style5": // Royal Flush
        const suits = ["♠", "♥", "♦", "♣"];
        const suitIndex = Math.floor((time * 0.002) % 4);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(centerX - 10, centerY - 15, 20, 30);
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.strokeRect(centerX - 10, centerY - 15, 20, 30);
        ctx.fillStyle = suitIndex % 2 === 0 ? "#000000" : "#ff0000";
        ctx.font = "bold 20px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(suits[suitIndex], centerX, centerY);
        break;
    }
  };

  return (
    <div
      className={`relative ${className}`}
      style={{ width: config.container, height: config.container }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <canvas
        ref={canvasRef}
        width={config.canvas}
        height={config.canvas}
        className="w-full h-full"
      />
      {showText && (
        <div className={`text-center mt-2 font-bold ${config.text}`}>
          LUMERIS
        </div>
      )}
    </div>
  );
}
