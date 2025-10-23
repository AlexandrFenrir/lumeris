/**
 * Lumeris Particle System
 * Space/Cosmic themed particle effects with canvas rendering
 */

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

export class ParticleSystem {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animationId: number | null = null;
  private theme: "gold" | "silver";
  private mouseX: number = 0;
  private mouseY: number = 0;
  private mouseMoveHandler: (e: MouseEvent) => void;

  constructor(canvas: HTMLCanvasElement, theme: "gold" | "silver" = "gold") {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.theme = theme;
    this.mouseMoveHandler = this.handleMouseMove.bind(this);
    this.resize();
    this.initParticles();
    this.setupMouseTracking();
  }

  private resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  private handleMouseMove(e: MouseEvent) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
  }

  private setupMouseTracking() {
    window.addEventListener("mousemove", this.mouseMoveHandler);
  }

  private initParticles() {
    const particleCount = 150;
    const colors =
      this.theme === "gold"
        ? ["#FFD700", "#FFA500", "#FFED4E", "#FFC107", "#FFB300"]
        : ["#C0C0C0", "#E8E8E8", "#A8A8A8", "#D3D3D3", "#B8B8B8"];

    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
        maxLife: 1,
      });
    }
  }

  private drawNebula() {
    const gradient = this.ctx.createRadialGradient(
      this.canvas.width / 2,
      this.canvas.height / 2,
      0,
      this.canvas.width / 2,
      this.canvas.height / 2,
      this.canvas.width / 2
    );

    if (this.theme === "gold") {
      gradient.addColorStop(0, "rgba(255, 215, 0, 0.03)");
      gradient.addColorStop(0.5, "rgba(255, 165, 0, 0.02)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    } else {
      gradient.addColorStop(0, "rgba(192, 192, 192, 0.03)");
      gradient.addColorStop(0.5, "rgba(232, 232, 232, 0.02)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    }

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private drawConnections() {
    const maxDistance = 120;

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.15;
          this.ctx.strokeStyle =
            this.theme === "gold"
              ? `rgba(255, 215, 0, ${opacity})`
              : `rgba(192, 192, 192, ${opacity})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }

  private updateParticles() {
    this.particles.forEach((particle) => {
      // Mouse interaction
      const dx = this.mouseX - particle.x;
      const dy = this.mouseY - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
        const force = (100 - distance) / 100;
        particle.vx -= (dx / distance) * force * 0.02;
        particle.vy -= (dy / distance) * force * 0.02;
      }

      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Boundary check
      if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

      // Keep particles in bounds
      particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
      particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));

      // Damping
      particle.vx *= 0.99;
      particle.vy *= 0.99;
    });
  }

  private drawParticles() {
    this.particles.forEach((particle) => {
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = particle.color;
      this.ctx.globalAlpha = particle.opacity;
      this.ctx.fill();

      // Glow effect
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = particle.color;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
      this.ctx.globalAlpha = 1;
    });
  }

  public animate() {
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawNebula();
    this.updateParticles();
    this.drawConnections();
    this.drawParticles();

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  public start() {
    if (!this.animationId) {
      this.animate();
    }
  }

  public stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  public setTheme(theme: "gold" | "silver") {
    this.theme = theme;
    this.particles = [];
    this.initParticles();
  }

  public addBurst(x: number, y: number, count: number = 20) {
    const colors =
      this.theme === "gold"
        ? ["#FFD700", "#FFA500", "#FFED4E"]
        : ["#C0C0C0", "#E8E8E8", "#A8A8A8"];

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = Math.random() * 3 + 2;

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3 + 1,
        opacity: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
        maxLife: 1,
      });
    }
  }

  public destroy() {
    this.stop();
    window.removeEventListener("mousemove", this.mouseMoveHandler);
    this.particles = [];
  }
}

export default ParticleSystem;
