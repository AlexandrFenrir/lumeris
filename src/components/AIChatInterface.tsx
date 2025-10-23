/**
 * 🤖 SENTIENT SPACE STATION - AI CHAT
 * Features: Holographic AI Avatar, Neural Network Patterns, Voice Visualization, Space Station Interior
 */

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

type AIEmotion = "neutral" | "happy" | "thinking" | "excited" | "confused";

export function AIChatInterface() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      content:
        "Greetings, Commander. I am ARIA, your AI assistant aboard the Lumeris Space Station. How may I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [emotion, setEmotion] = useState<AIEmotion>("neutral");
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 200, y: 150 });

  // Canvas animation for AI avatar
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 300;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2 - 20;
    let rotation = 0;
    let pulsePhase = 0;
    let thoughtWave = 0;

    // Neural network nodes
    const nodes: { x: number; y: number; connections: number[] }[] = [];
    for (let i = 0; i < 20; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        connections: [],
      });
    }

    // Create connections
    nodes.forEach((node, i) => {
      const numConnections = 2 + Math.floor(Math.random() * 3);
      for (let j = 0; j < numConnections; j++) {
        const targetIndex = Math.floor(Math.random() * nodes.length);
        if (targetIndex !== i && !node.connections.includes(targetIndex)) {
          node.connections.push(targetIndex);
        }
      }
    });

    // Draw AI avatar
    const drawAvatar = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      pulsePhase += 0.05;
      thoughtWave += 0.1;
      const pulse = Math.sin(pulsePhase) * 0.2 + 1;

      // Space station window background
      ctx.fillStyle = "rgba(0, 10, 30, 0.3)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stars outside window
      for (let i = 0; i < 30; i++) {
        const x = (i * 47) % canvas.width;
        const y = (i * 83) % canvas.height;
        const twinkle = Math.sin(pulsePhase + i) * 0.3 + 0.5;
        ctx.fillStyle = `rgba(255, 255, 255, ${twinkle})`;
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }

      // Neural network background
      ctx.strokeStyle = "rgba(0, 255, 255, 0.1)";
      ctx.lineWidth = 1;
      nodes.forEach((node, i) => {
        node.connections.forEach((targetIndex) => {
          const target = nodes[targetIndex];
          const alpha = 0.1 + Math.sin(thoughtWave + i * 0.5) * 0.1;
          ctx.strokeStyle = `rgba(0, 255, 255, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(target.x, target.y);
          ctx.stroke();
        });
      });

      // Draw nodes
      nodes.forEach((node, i) => {
        const nodeAlpha = 0.3 + Math.sin(thoughtWave + i * 0.3) * 0.2;
        ctx.fillStyle = `rgba(0, 255, 255, ${nodeAlpha})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // AI Avatar outer glow
      const glowGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        40,
        centerX,
        centerY,
        100 * pulse
      );
      const emotionColor = getEmotionColor(emotion);
      glowGradient.addColorStop(0, emotionColor + "60");
      glowGradient.addColorStop(0.5, emotionColor + "30");
      glowGradient.addColorStop(1, "transparent");
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 100 * pulse, 0, Math.PI * 2);
      ctx.fill();

      // Holographic rings (ENHANCED - 5 rings with pulse effect)
      for (let i = 0; i < 5; i++) {
        const ringRotation = rotation + (i * (Math.PI * 2)) / 5;
        const ringRadius = 60 + i * 8 + Math.sin(pulsePhase + i * 0.5) * 3;
        const ringAlpha = 0.5 - i * 0.08;

        ctx.strokeStyle =
          emotionColor +
          Math.floor(ringAlpha * 255)
            .toString(16)
            .padStart(2, "0");
        ctx.lineWidth = 2 + Math.sin(pulsePhase + i) * 0.5;
        ctx.beginPath();
        ctx.ellipse(
          centerX,
          centerY,
          ringRadius,
          ringRadius * 0.3,
          ringRotation,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      }

      // Holographic scan lines
      ctx.strokeStyle = emotionColor + "20";
      ctx.lineWidth = 1;
      for (let y = 0; y < canvas.height; y += 4) {
        const scanAlpha = Math.sin(pulsePhase + y * 0.1) * 0.3 + 0.3;
        ctx.strokeStyle =
          emotionColor +
          Math.floor(scanAlpha * 255)
            .toString(16)
            .padStart(2, "0");
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // AI Head (geometric)
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(Math.sin(rotation) * 0.1);

      // Head outline
      const headGradient = ctx.createRadialGradient(-10, -10, 10, 0, 0, 50);
      headGradient.addColorStop(0, emotionColor + "CC");
      headGradient.addColorStop(0.5, emotionColor + "88");
      headGradient.addColorStop(1, emotionColor + "44");
      ctx.fillStyle = headGradient;

      // Hexagonal head
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI * 2) / 6;
        const x = Math.cos(angle) * 40;
        const y = Math.sin(angle) * 40;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.fill();

      // Inner geometric pattern
      ctx.strokeStyle = emotionColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI * 2) / 6;
        const x = Math.cos(angle) * 30;
        const y = Math.sin(angle) * 30;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.stroke();

      // Eyes (tracking mouse)
      const eyeOffsetX = (mouseRef.current.x - centerX) * 0.05;
      const eyeOffsetY = (mouseRef.current.y - centerY) * 0.05;

      // Left eye
      ctx.fillStyle = emotionColor;
      ctx.beginPath();
      ctx.arc(-15 + eyeOffsetX, -5 + eyeOffsetY, 5, 0, Math.PI * 2);
      ctx.fill();

      // Right eye
      ctx.beginPath();
      ctx.arc(15 + eyeOffsetX, -5 + eyeOffsetY, 5, 0, Math.PI * 2);
      ctx.fill();

      // Eye glow
      ctx.fillStyle = emotionColor + "40";
      ctx.beginPath();
      ctx.arc(-15 + eyeOffsetX, -5 + eyeOffsetY, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(15 + eyeOffsetX, -5 + eyeOffsetY, 8, 0, Math.PI * 2);
      ctx.fill();

      // Mouth (changes with emotion)
      ctx.strokeStyle = emotionColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      if (emotion === "happy" || emotion === "excited") {
        ctx.arc(0, 5, 15, 0.2, Math.PI - 0.2);
      } else if (emotion === "confused") {
        ctx.moveTo(-10, 15);
        ctx.lineTo(10, 15);
      } else if (emotion === "thinking") {
        ctx.arc(0, 10, 10, 0, Math.PI, true);
      } else {
        ctx.moveTo(-12, 15);
        ctx.lineTo(12, 15);
      }
      ctx.stroke();

      ctx.restore();

      // Particle hair (flowing)
      if (isTyping) {
        for (let i = 0; i < 3; i++) {
          const angle = rotation * 2 + (i * (Math.PI * 2)) / 3;
          const radius = 50 + Math.sin(pulsePhase + i) * 10;
          const px = centerX + Math.cos(angle) * radius;
          const py = centerY - 40 + Math.sin(angle) * radius;

          ctx.fillStyle = emotionColor + "AA";
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Voice wave visualization (when typing)
      if (isTyping) {
        ctx.strokeStyle = emotionColor + "80";
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x += 5) {
          const y =
            canvas.height -
            30 +
            Math.sin((x + thoughtWave * 10) * 0.05) * 10 +
            Math.sin((x + thoughtWave * 15) * 0.1) * 5;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      // Thought bubbles (when thinking)
      if (emotion === "thinking") {
        for (let i = 0; i < 3; i++) {
          const bubbleX = centerX + 60 + i * 15;
          const bubbleY = centerY - 50 - i * 10;
          const bubbleSize = 5 + i * 2;
          const bubbleAlpha = 0.6 - i * 0.2;

          ctx.fillStyle =
            emotionColor +
            Math.floor(bubbleAlpha * 255)
              .toString(16)
              .padStart(2, "0");
          ctx.beginPath();
          ctx.arc(bubbleX, bubbleY, bubbleSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      rotation += 0.02;

      // Update particles
      updateParticles(ctx);
    };

    // Update and draw particles
    const updateParticles = (ctx: CanvasRenderingContext2D) => {
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const alpha = p.life / p.maxLife;
        ctx.fillStyle =
          p.color +
          Math.floor(alpha * 255)
            .toString(16)
            .padStart(2, "0");
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    const animate = () => {
      drawAvatar();
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [emotion, isTyping]);

  // Get emotion color
  const getEmotionColor = (emotion: AIEmotion): string => {
    switch (emotion) {
      case "happy":
        return "#00FF00";
      case "excited":
        return "#FFD700";
      case "thinking":
        return "#9C27B0";
      case "confused":
        return "#FF6600";
      default:
        return "#00FFFF";
    }
  };

  // Create reaction particles (ENHANCED - 50+ particles with emotion-specific effects)
  const createReactionParticles = (emotion: AIEmotion) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2 - 20;
    const particles = particlesRef.current;
    const color = getEmotionColor(emotion);

    // Main burst (30 particles)
    for (let i = 0; i < 30; i++) {
      const angle = (Math.PI * 2 * i) / 30;
      const speed = 2 + Math.random() * 2;
      particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 30 + Math.random() * 20,
        maxLife: 50,
        color: color,
        size: 2 + Math.random() * 2,
      });
    }

    // Emotion-specific effects
    if (emotion === "happy" || emotion === "excited") {
      // Happy sparkles (20 particles)
      for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 2;
        particles.push({
          x: centerX,
          y: centerY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2,
          life: 40 + Math.random() * 30,
          maxLife: 70,
          color: "#FFD700",
          size: 1 + Math.random() * 2,
        });
      }
    } else if (emotion === "thinking") {
      // Thought bubbles (15 particles)
      for (let i = 0; i < 15; i++) {
        particles.push({
          x: centerX + 60,
          y: centerY - 50,
          vx: Math.random() * 0.5 - 0.25,
          vy: -1 - Math.random(),
          life: 50 + Math.random() * 30,
          maxLife: 80,
          color: color,
          size: 3 + Math.random() * 3,
        });
      }
    }
  };

  // Send message
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInput("");
    setIsTyping(true);
    setEmotion("thinking");
    createReactionParticles("thinking");

    // Simulate AI response (replace with actual API call)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const responses = [
      "Fascinating query, Commander. Based on my analysis of the quantum data streams, I recommend proceeding with caution.",
      "I've processed your request through my neural networks. The probability of success is 87.3%.",
      "Excellent question! Let me access the galactic database... Ah yes, here's what I found.",
      "Commander, I detect unusual energy signatures in your query. This requires deeper analysis.",
      "Your strategic thinking impresses me. I've calculated three optimal solutions for you.",
    ];

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "ai",
      content: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMessage]);
    setIsTyping(false);
    setEmotion("happy");
    createReactionParticles("happy");

    // Return to neutral after 2 seconds
    setTimeout(() => setEmotion("neutral"), 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="relative bg-black/40 backdrop-blur-xl border-cyan-500/30 p-6 max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent mb-2">
            🤖 ARIA - AI ASSISTANT
          </h1>
          <p className="text-gray-400 text-sm">
            Sentient Space Station Intelligence
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* AI Avatar */}
          <div className="flex flex-col items-center">
            <canvas
              ref={canvasRef}
              className="rounded-lg border border-cyan-500/30 mb-4"
              style={{
                background:
                  "radial-gradient(circle, rgba(0,30,60,0.8) 0%, rgba(0,0,0,0.9) 100%)",
              }}
            />
            <div className="text-center">
              <p className="text-sm text-gray-400">
                Status: {isTyping ? "Processing..." : "Online"}
              </p>
              <p className="text-sm text-gray-400">
                Emotion:{" "}
                <span style={{ color: getEmotionColor(emotion) }}>
                  {emotion.toUpperCase()}
                </span>
              </p>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="flex flex-col h-[400px]">
            <ScrollArea className="flex-1 pr-4 mb-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.role === "user"
                          ? "bg-blue-600/30 border border-blue-500/50"
                          : "bg-cyan-600/30 border border-cyan-500/50"
                      }`}
                    >
                      <p className="text-sm text-white">{message.content}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-cyan-600/30 border border-cyan-500/50 p-3 rounded-lg">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask ARIA anything..."
                className="flex-1 bg-black/50 border-cyan-500/30 text-white placeholder:text-gray-500"
                disabled={isTyping}
              />
              <Button
                onClick={handleSend}
                disabled={isTyping || !input.trim()}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
              >
                Send
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { label: "Market Analysis", icon: "📊" },
            { label: "Game Strategy", icon: "🎮" },
            { label: "Portfolio Tips", icon: "💼" },
            { label: "News Update", icon: "📰" },
          ].map((action) => (
            <Button
              key={action.label}
              variant="outline"
              className="bg-black/30 border-cyan-500/30 hover:bg-cyan-600/20 text-sm"
              onClick={() => setInput(action.label)}
            >
              {action.icon} {action.label}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
}
