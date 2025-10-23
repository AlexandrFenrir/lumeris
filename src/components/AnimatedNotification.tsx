import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Sparkles,
  Trophy,
  Coins,
  Star,
  Zap,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface NotificationProps {
  type: "achievement" | "trade" | "signal" | "reward" | "level";
  title: string;
  message: string;
  icon?: React.ReactNode;
  duration?: number;
  onClose?: () => void;
}

const AnimatedNotification = ({
  type,
  title,
  message,
  icon,
  duration = 5000,
  onClose,
}: NotificationProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const getTypeStyles = () => {
    switch (type) {
      case "achievement":
        return {
          bg: "bg-gradient-to-r from-gaming/20 to-nft/20",
          border: "border-gaming",
          icon: icon || <Trophy className="w-6 h-6 text-gaming" />,
          glow: "shadow-gaming",
        };
      case "trade":
        return {
          bg: "bg-gradient-to-r from-defi/20 to-primary/20",
          border: "border-defi",
          icon: icon || <TrendingUp className="w-6 h-6 text-defi" />,
          glow: "shadow-defi",
        };
      case "signal":
        return {
          bg: "bg-gradient-to-r from-primary/20 to-accent/20",
          border: "border-primary",
          icon: icon || <Zap className="w-6 h-6 text-primary" />,
          glow: "shadow-primary",
        };
      case "reward":
        return {
          bg: "bg-gradient-to-r from-nft/20 to-gaming/20",
          border: "border-nft",
          icon: icon || <Coins className="w-6 h-6 text-nft" />,
          glow: "shadow-nft",
        };
      case "level":
        return {
          bg: "bg-gradient-to-r from-accent/20 to-primary/20",
          border: "border-accent",
          icon: icon || <Star className="w-6 h-6 text-accent" />,
          glow: "shadow-primary",
        };
      default:
        return {
          bg: "bg-gradient-to-r from-primary/20 to-secondary/20",
          border: "border-primary",
          icon: icon || <Sparkles className="w-6 h-6 text-primary" />,
          glow: "shadow-primary",
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div
      className={`fixed top-20 right-4 z-50 transition-all duration-300 ${
        isExiting
          ? "translate-x-full opacity-0"
          : "translate-x-0 opacity-100 animate-in slide-in-from-right"
      }`}
    >
      <Card
        className={`${styles.bg} ${styles.glow} border-2 ${styles.border} p-4 min-w-[320px] max-w-md backdrop-blur-md`}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 animate-bounce">{styles.icon}</div>
          <div className="flex-1">
            <h4 className="font-semibold text-lg mb-1">{title}</h4>
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
          <button
            onClick={() => {
              setIsExiting(true);
              setTimeout(() => {
                setIsVisible(false);
                onClose?.();
              }, 300);
            }}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1 bg-secondary rounded-full overflow-hidden">
          <div
            className={`h-full ${
              type === "achievement"
                ? "bg-gaming"
                : type === "trade"
                ? "bg-defi"
                : type === "signal"
                ? "bg-primary"
                : type === "reward"
                ? "bg-nft"
                : "bg-accent"
            }`}
            style={{
              animation: `shrink ${duration}ms linear`,
            }}
          />
        </div>
      </Card>

      <style>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

export default AnimatedNotification;
