import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  DollarSign,
  Flame,
  Trophy,
  Target,
} from "lucide-react";
import { toast } from "sonner";

interface BettingEvent {
  id: string;
  title: string;
  category: "crypto" | "sports" | "esports" | "prediction";
  endTime: Date;
  totalPool: number;
  participants: number;
  options: BettingOption[];
  status: "live" | "ending-soon" | "closed";
  multiplier: number;
}

interface BettingOption {
  id: string;
  label: string;
  odds: number;
  percentage: number;
  totalBet: number;
}

interface UserBet {
  eventId: string;
  optionId: string;
  amount: number;
  timestamp: Date;
}

export function LiveBettingSystem() {
  const [events, setEvents] = useState<BettingEvent[]>([]);
  const [userBets, setUserBets] = useState<UserBet[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState<number>(10);

  useEffect(() => {
    // Initialize with mock events
    const mockEvents: BettingEvent[] = [
      {
        id: "1",
        title: "BTC Price in 1 Hour",
        category: "crypto",
        endTime: new Date(Date.now() + 3600000),
        totalPool: 15420,
        participants: 234,
        status: "live",
        multiplier: 2.5,
        options: [
          {
            id: "1a",
            label: "Above $45,000",
            odds: 1.8,
            percentage: 55,
            totalBet: 8481,
          },
          {
            id: "1b",
            label: "Below $45,000",
            odds: 2.2,
            percentage: 45,
            totalBet: 6939,
          },
        ],
      },
      {
        id: "2",
        title: "ETH vs BTC Performance (24h)",
        category: "crypto",
        endTime: new Date(Date.now() + 86400000),
        totalPool: 28750,
        participants: 456,
        status: "live",
        multiplier: 3.2,
        options: [
          {
            id: "2a",
            label: "ETH Outperforms",
            odds: 2.1,
            percentage: 48,
            totalBet: 13800,
          },
          {
            id: "2b",
            label: "BTC Outperforms",
            odds: 1.9,
            percentage: 52,
            totalBet: 14950,
          },
        ],
      },
      {
        id: "3",
        title: "Next Altcoin to 10x",
        category: "prediction",
        endTime: new Date(Date.now() + 1800000),
        totalPool: 9200,
        participants: 128,
        status: "ending-soon",
        multiplier: 5.0,
        options: [
          { id: "3a", label: "SOL", odds: 3.5, percentage: 30, totalBet: 2760 },
          {
            id: "3b",
            label: "AVAX",
            odds: 4.2,
            percentage: 25,
            totalBet: 2300,
          },
          { id: "3c", label: "DOT", odds: 5.1, percentage: 20, totalBet: 1840 },
          {
            id: "3d",
            label: "MATIC",
            odds: 4.8,
            percentage: 25,
            totalBet: 2300,
          },
        ],
      },
      {
        id: "4",
        title: "Esports: Team Alpha vs Team Beta",
        category: "esports",
        endTime: new Date(Date.now() + 7200000),
        totalPool: 42100,
        participants: 892,
        status: "live",
        multiplier: 2.8,
        options: [
          {
            id: "4a",
            label: "Team Alpha Wins",
            odds: 1.7,
            percentage: 60,
            totalBet: 25260,
          },
          {
            id: "4b",
            label: "Team Beta Wins",
            odds: 2.5,
            percentage: 40,
            totalBet: 16840,
          },
        ],
      },
    ];

    setEvents(mockEvents);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setEvents((prev) =>
        prev.map((event) => ({
          ...event,
          totalPool: event.totalPool + Math.random() * 100,
          participants: event.participants + Math.floor(Math.random() * 3),
          options: event.options.map((option) => ({
            ...option,
            totalBet: option.totalBet + Math.random() * 50,
            percentage: Math.max(
              10,
              Math.min(90, option.percentage + (Math.random() - 0.5) * 2)
            ),
          })),
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const placeBet = (eventId: string, optionId: string) => {
    const event = events.find((e) => e.id === eventId);
    const option = event?.options.find((o) => o.id === optionId);

    if (!event || !option) return;

    const newBet: UserBet = {
      eventId,
      optionId,
      amount: betAmount,
      timestamp: new Date(),
    };

    setUserBets((prev) => [...prev, newBet]);

    toast.success(`Bet Placed!`, {
      description: `${betAmount} LUMERIS on "${
        option.label
      }" - Potential win: ${(betAmount * option.odds).toFixed(2)} LUMERIS`,
    });

    // Update event pool
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId
          ? {
              ...e,
              totalPool: e.totalPool + betAmount,
              participants: e.participants + 1,
            }
          : e
      )
    );
  };

  const getTimeRemaining = (endTime: Date) => {
    const diff = endTime.getTime() - Date.now();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "crypto":
        return "text-gradient-gold";
      case "sports":
        return "text-gradient-silver";
      case "esports":
        return "text-blue-400";
      case "prediction":
        return "text-purple-400";
      default:
        return "text-foreground";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "crypto":
        return <TrendingUp className="w-4 h-4" />;
      case "sports":
        return <Trophy className="w-4 h-4" />;
      case "esports":
        return <Target className="w-4 h-4" />;
      case "prediction":
        return <Flame className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gradient-gold mb-2">
            Live Betting Arena
          </h2>
          <p className="text-foreground/60">
            Place bets on live events and win big!
          </p>
        </div>
        <div className="glass-card-gold px-6 py-3 rounded-lg">
          <div className="text-sm text-foreground/60">Your Balance</div>
          <div className="text-2xl font-bold text-gradient-gold">
            1,250 LUMERIS
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg gradient-gold flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="text-sm text-foreground/60">Total Pool</div>
              <div className="text-xl font-bold text-gradient-gold">
                {events.reduce((sum, e) => sum + e.totalPool, 0).toFixed(0)}{" "}
                LUMERIS
              </div>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg gradient-silver flex items-center justify-center">
              <Users className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="text-sm text-foreground/60">Active Bettors</div>
              <div className="text-xl font-bold text-gradient-silver">
                {events.reduce((sum, e) => sum + e.participants, 0)}
              </div>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-sm text-foreground/60">Your Bets</div>
              <div className="text-xl font-bold text-green-400">
                {userBets.length}
              </div>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Flame className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-sm text-foreground/60">Live Events</div>
              <div className="text-xl font-bold text-purple-400">
                {events.length}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Betting Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {events.map((event) => (
          <Card
            key={event.id}
            className={`glass-card-gold p-6 transition-all hover:scale-[1.02] ${
              event.status === "ending-soon" ? "animate-pulse-glow-gold" : ""
            }`}
          >
            {/* Event Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={getCategoryColor(event.category)}>
                    {getCategoryIcon(event.category)}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-foreground/60">
                    {event.category}
                  </span>
                  {event.status === "ending-soon" && (
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full animate-pulse">
                      Ending Soon!
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gradient-gold mb-2">
                  {event.title}
                </h3>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gradient-gold">
                  {event.multiplier}x
                </div>
                <div className="text-xs text-foreground/60">Max Multiplier</div>
              </div>
            </div>

            {/* Event Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-black/20 rounded-lg">
              <div>
                <div className="flex items-center gap-1 text-foreground/60 text-xs mb-1">
                  <Clock className="w-3 h-3" />
                  Time Left
                </div>
                <div className="font-bold text-sm">
                  {getTimeRemaining(event.endTime)}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-foreground/60 text-xs mb-1">
                  <DollarSign className="w-3 h-3" />
                  Total Pool
                </div>
                <div className="font-bold text-sm">
                  {event.totalPool.toFixed(0)} LUMERIS
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-foreground/60 text-xs mb-1">
                  <Users className="w-3 h-3" />
                  Participants
                </div>
                <div className="font-bold text-sm">{event.participants}</div>
              </div>
            </div>

            {/* Betting Options */}
            <div className="space-y-3">
              {event.options.map((option) => (
                <div key={option.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{option.label}</span>
                      <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                        {option.odds}x
                      </span>
                    </div>
                    <Button
                      size="sm"
                      className="btn-gold text-xs"
                      onClick={() => placeBet(event.id, option.id)}
                    >
                      Bet {betAmount} LUMERIS
                    </Button>
                  </div>
                  <div className="space-y-1">
                    <Progress value={option.percentage} className="h-2" />
                    <div className="flex justify-between text-xs text-foreground/60">
                      <span>{option.percentage.toFixed(1)}% of pool</span>
                      <span>{option.totalBet.toFixed(0)} LUMERIS</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Bet Amount Selector */}
      <Card className="glass-card p-6">
        <h3 className="text-lg font-bold mb-4">Quick Bet Amount</h3>
        <div className="flex gap-2 flex-wrap">
          {[10, 25, 50, 100, 250, 500].map((amount) => (
            <Button
              key={amount}
              variant={betAmount === amount ? "default" : "outline"}
              className={betAmount === amount ? "btn-gold" : ""}
              onClick={() => setBetAmount(amount)}
            >
              {amount} LUMERIS
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default LiveBettingSystem;
