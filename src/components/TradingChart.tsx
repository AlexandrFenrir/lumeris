import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  Target,
  Brain,
} from "lucide-react";
import { BitcoinMountainScore } from "./BitcoinMountainScore";
import { HolographicCard } from "./HolographicCard";

interface CandlestickData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  rsi?: number;
  macd?: number;
  signal?: number;
  ma20?: number;
  ma50?: number;
}

interface TradingSignal {
  type: "BUY" | "SELL" | "HOLD";
  confidence: number;
  reason: string;
  timestamp: string;
}

interface TradingChartProps {
  pair?: string;
  onSignalGenerated?: (signal: TradingSignal) => void;
}

const TradingChart = ({
  pair = "Lumeris/ETH",
  onSignalGenerated,
}: TradingChartProps) => {
  const [timeframe, setTimeframe] = useState<
    "1m" | "5m" | "15m" | "1h" | "4h" | "1d"
  >("15m");
  const [chartData, setChartData] = useState<CandlestickData[]>([]);
  const [currentSignal, setCurrentSignal] = useState<TradingSignal | null>(
    null
  );
  const [indicators, setIndicators] = useState({
    rsi: true,
    macd: true,
    ma: true,
  });

  // Generate realistic candlestick data with technical indicators
  const generateChartData = (timeframe: string): CandlestickData[] => {
    const dataPoints = 50;
    const data: CandlestickData[] = [];
    let basePrice = 100;

    for (let i = 0; i < dataPoints; i++) {
      const volatility = 0.02;
      const trend = Math.sin(i / 10) * 0.01;

      const open = basePrice;
      const close =
        basePrice * (1 + (Math.random() - 0.5) * volatility + trend);
      const high = Math.max(open, close) * (1 + Math.random() * volatility);
      const low = Math.min(open, close) * (1 - Math.random() * volatility);
      const volume = Math.random() * 1000000 + 500000;

      // Calculate RSI (simplified)
      const rsi = 30 + Math.random() * 40;

      // Calculate MACD (simplified)
      const macd = (Math.random() - 0.5) * 2;
      const signal = macd * 0.9;

      // Calculate Moving Averages
      const ma20 = basePrice * (1 + (Math.random() - 0.5) * 0.01);
      const ma50 = basePrice * (1 + (Math.random() - 0.5) * 0.015);

      const timeLabel = getTimeLabel(i, timeframe);

      data.push({
        time: timeLabel,
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        volume: parseFloat(volume.toFixed(0)),
        rsi: parseFloat(rsi.toFixed(2)),
        macd: parseFloat(macd.toFixed(4)),
        signal: parseFloat(signal.toFixed(4)),
        ma20: parseFloat(ma20.toFixed(2)),
        ma50: parseFloat(ma50.toFixed(2)),
      });

      basePrice = close;
    }

    return data;
  };

  const getTimeLabel = (index: number, timeframe: string): string => {
    const now = new Date();
    const intervals: Record<string, number> = {
      "1m": 60000,
      "5m": 300000,
      "15m": 900000,
      "1h": 3600000,
      "4h": 14400000,
      "1d": 86400000,
    };

    const time = new Date(now.getTime() - (50 - index) * intervals[timeframe]);

    if (timeframe === "1d") {
      return time.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
    return time.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // AI-powered trading signal generation
  const generateTradingSignal = (data: CandlestickData[]): TradingSignal => {
    const latest = data[data.length - 1];
    const previous = data[data.length - 2];

    let score = 0;
    const reasons: string[] = [];

    // RSI Analysis
    if (latest.rsi && latest.rsi < 30) {
      score += 2;
      reasons.push("RSI oversold");
    } else if (latest.rsi && latest.rsi > 70) {
      score -= 2;
      reasons.push("RSI overbought");
    }

    // MACD Analysis
    if (latest.macd && latest.signal && latest.macd > latest.signal) {
      score += 1.5;
      reasons.push("MACD bullish crossover");
    } else if (latest.macd && latest.signal && latest.macd < latest.signal) {
      score -= 1.5;
      reasons.push("MACD bearish crossover");
    }

    // Moving Average Analysis
    if (
      latest.close > (latest.ma20 || 0) &&
      latest.close > (latest.ma50 || 0)
    ) {
      score += 1;
      reasons.push("Price above MAs");
    } else if (
      latest.close < (latest.ma20 || 0) &&
      latest.close < (latest.ma50 || 0)
    ) {
      score -= 1;
      reasons.push("Price below MAs");
    }

    // Price Action
    if (latest.close > previous.close) {
      score += 0.5;
      reasons.push("Bullish candle");
    } else {
      score -= 0.5;
      reasons.push("Bearish candle");
    }

    // Determine signal type and confidence
    let type: "BUY" | "SELL" | "HOLD";
    let confidence: number;

    if (score >= 2) {
      type = "BUY";
      confidence = Math.min(95, 60 + score * 8);
    } else if (score <= -2) {
      type = "SELL";
      confidence = Math.min(95, 60 + Math.abs(score) * 8);
    } else {
      type = "HOLD";
      confidence = 50 + Math.random() * 20;
    }

    return {
      type,
      confidence: parseFloat(confidence.toFixed(1)),
      reason: reasons.slice(0, 3).join(", "),
      timestamp: new Date().toISOString(),
    };
  };

  useEffect(() => {
    const data = generateChartData(timeframe);
    setChartData(data);

    const signal = generateTradingSignal(data);
    setCurrentSignal(signal);

    if (onSignalGenerated) {
      onSignalGenerated(signal);
    }
  }, [timeframe]);

  // Real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newData = generateChartData(timeframe);
      setChartData(newData);

      const signal = generateTradingSignal(newData);
      setCurrentSignal(signal);

      if (onSignalGenerated) {
        onSignalGenerated(signal);
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [timeframe]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-card-gold border border-yellow-400/30 rounded-lg p-3 shadow-lg backdrop-blur-xl">
          <p className="text-sm font-semibold mb-2 text-gradient-gold">
            {data.time}
          </p>
          <div className="space-y-1 text-xs">
            <p className="flex justify-between gap-4">
              <span className="text-foreground/60">Open:</span>
              <span className="font-medium">${data.open}</span>
            </p>
            <p className="flex justify-between gap-4">
              <span className="text-foreground/60">High:</span>
              <span className="font-medium text-green-400">${data.high}</span>
            </p>
            <p className="flex justify-between gap-4">
              <span className="text-foreground/60">Low:</span>
              <span className="font-medium text-red-400">${data.low}</span>
            </p>
            <p className="flex justify-between gap-4">
              <span className="text-foreground/60">Close:</span>
              <span className="font-medium text-gradient-silver">
                ${data.close}
              </span>
            </p>
            <p className="flex justify-between gap-4">
              <span className="text-foreground/60">Volume:</span>
              <span className="font-medium text-purple-400">
                {(data.volume / 1000).toFixed(0)}K
              </span>
            </p>
            {indicators.rsi && (
              <p className="flex justify-between gap-4">
                <span className="text-foreground/60">RSI:</span>
                <span className="font-medium text-yellow-400">{data.rsi}</span>
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const getSignalColor = (type: string) => {
    switch (type) {
      case "BUY":
        return "text-green-400";
      case "SELL":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getSignalIcon = (type: string) => {
    switch (type) {
      case "BUY":
        return <TrendingUp className="w-5 h-5 text-green-400" />;
      case "SELL":
        return <TrendingDown className="w-5 h-5 text-red-400" />;
      default:
        return <Activity className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Bitcoin Mountain Score - NEW! */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Trading Signal Card */}
        {currentSignal && (
          <HolographicCard theme="purple" className="lg:col-span-2">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${
                      currentSignal.type === "BUY"
                        ? "bg-green-500/20"
                        : currentSignal.type === "SELL"
                          ? "bg-red-500/20"
                          : "bg-gray-500/20"
                    }`}
                  >
                    {getSignalIcon(currentSignal.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-purple-400" />
                      <span className="text-sm font-semibold">
                        AI Trading Signal
                      </span>
                    </div>
                    <p
                      className={`text-2xl font-bold ${getSignalColor(
                        currentSignal.type
                      )}`}
                    >
                      {currentSignal.type}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 justify-end mb-1">
                    <Target className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-foreground/60">
                      Confidence
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gradient-gold">
                    {currentSignal.confidence}%
                  </p>
                </div>
              </div>
              <p className="text-sm text-foreground/60 mt-3">
                {currentSignal.reason}
              </p>
            </div>
          </HolographicCard>
        )}

        {/* Bitcoin Mountain Score Widget */}
        <div className="lg:col-span-1">
          <BitcoinMountainScore />
        </div>
      </div>

      {/* Main Chart Card */}
      <HolographicCard theme="gold">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h3 className="text-xl font-bold text-gradient-gold">
              {pair} Trading Chart
            </h3>

            {/* Timeframe Selector */}
            <div className="flex gap-2">
              {(["1m", "5m", "15m", "1h", "4h", "1d"] as const).map((tf) => (
                <Button
                  key={tf}
                  variant={timeframe === tf ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeframe(tf)}
                  className={`min-w-[50px] ${
                    timeframe === tf
                      ? "bg-yellow-500/20 text-yellow-400 border-yellow-400/30"
                      : "glass-card border-gray-400/20"
                  }`}
                >
                  {tf}
                </Button>
              ))}
            </div>
          </div>
          <Tabs defaultValue="candlestick" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4 glass-card-silver border border-gray-400/30">
              <TabsTrigger value="candlestick">Candlestick</TabsTrigger>
              <TabsTrigger value="indicators">Indicators</TabsTrigger>
              <TabsTrigger value="volume">Volume</TabsTrigger>
            </TabsList>

            {/* Candlestick Chart */}
            <TabsContent value="candlestick" className="space-y-4">
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="time"
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12 }}
                    domain={["auto", "auto"]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />

                  {/* Price Line */}
                  <Line
                    type="monotone"
                    dataKey="close"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                    name="Price"
                  />

                  {/* Moving Averages */}
                  {indicators.ma && (
                    <>
                      <Line
                        type="monotone"
                        dataKey="ma20"
                        stroke="hsl(var(--accent))"
                        strokeWidth={1}
                        dot={false}
                        strokeDasharray="5 5"
                        name="MA20"
                      />
                      <Line
                        type="monotone"
                        dataKey="ma50"
                        stroke="hsl(var(--defi))"
                        strokeWidth={1}
                        dot={false}
                        strokeDasharray="5 5"
                        name="MA50"
                      />
                    </>
                  )}

                  {/* High/Low Area */}
                  <Area
                    type="monotone"
                    dataKey="high"
                    stroke="none"
                    fill="hsl(var(--accent) / 0.1)"
                    name="High"
                  />
                  <Area
                    type="monotone"
                    dataKey="low"
                    stroke="none"
                    fill="hsl(var(--destructive) / 0.1)"
                    name="Low"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </TabsContent>

            {/* Technical Indicators */}
            <TabsContent value="indicators" className="space-y-4">
              {/* RSI Chart */}
              {indicators.rsi && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">
                    RSI (Relative Strength Index)
                  </h4>
                  <ResponsiveContainer width="100%" height={150}>
                    <LineChart data={chartData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(var(--border))"
                      />
                      <XAxis
                        dataKey="time"
                        stroke="hsl(var(--muted-foreground))"
                        tick={{ fontSize: 10 }}
                      />
                      <YAxis
                        domain={[0, 100]}
                        stroke="hsl(var(--muted-foreground))"
                        tick={{ fontSize: 10 }}
                      />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="rsi"
                        stroke="hsl(var(--gaming))"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey={() => 70}
                        stroke="hsl(var(--destructive))"
                        strokeWidth={1}
                        strokeDasharray="3 3"
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey={() => 30}
                        stroke="hsl(var(--accent))"
                        strokeWidth={1}
                        strokeDasharray="3 3"
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* MACD Chart */}
              {indicators.macd && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">MACD</h4>
                  <ResponsiveContainer width="100%" height={150}>
                    <BarChart data={chartData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(var(--border))"
                      />
                      <XAxis
                        dataKey="time"
                        stroke="hsl(var(--muted-foreground))"
                        tick={{ fontSize: 10 }}
                      />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        tick={{ fontSize: 10 }}
                      />
                      <Tooltip />
                      <Bar dataKey="macd" fill="hsl(var(--defi))" />
                      <Line
                        type="monotone"
                        dataKey="signal"
                        stroke="hsl(var(--gaming))"
                        strokeWidth={2}
                        dot={false}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </TabsContent>

            {/* Volume Chart */}
            <TabsContent value="volume">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="time"
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="volume"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>

          {/* Indicator Toggles */}
          <div className="flex gap-4 mt-4 pt-4 border-t border-gray-400/20">
            <Button
              variant={indicators.rsi ? "default" : "outline"}
              size="sm"
              onClick={() =>
                setIndicators({ ...indicators, rsi: !indicators.rsi })
              }
              className={
                indicators.rsi
                  ? "bg-purple-500/20 text-purple-400 border-purple-400/30"
                  : "glass-card border-gray-400/20"
              }
            >
              RSI
            </Button>
            <Button
              variant={indicators.macd ? "default" : "outline"}
              size="sm"
              onClick={() =>
                setIndicators({ ...indicators, macd: !indicators.macd })
              }
              className={
                indicators.macd
                  ? "bg-yellow-500/20 text-yellow-400 border-yellow-400/30"
                  : "glass-card border-gray-400/20"
              }
            >
              MACD
            </Button>
            <Button
              variant={indicators.ma ? "default" : "outline"}
              size="sm"
              onClick={() =>
                setIndicators({ ...indicators, ma: !indicators.ma })
              }
              className={
                indicators.ma
                  ? "bg-green-500/20 text-green-400 border-green-400/30"
                  : "glass-card border-gray-400/20"
              }
            >
              Moving Averages
            </Button>
          </div>
        </div>
      </HolographicCard>
    </div>
  );
};

export default TradingChart;
