import React, { useState } from "react";
import { usePerformance, QualityLevel } from "../contexts/PerformanceContext";
import { Settings, Monitor, Zap, Eye, EyeOff } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export const PerformanceSettings: React.FC = () => {
  const {
    settings,
    setQuality,
    updateSettings,
    currentFPS,
    deviceCapability,
    autoOptimize,
    setAutoOptimize,
  } = usePerformance();

  const [isOpen, setIsOpen] = useState(false);

  const qualityOptions: {
    value: QualityLevel;
    label: string;
    description: string;
  }[] = [
    {
      value: "low",
      label: "Low",
      description: "Best performance, minimal effects",
    },
    {
      value: "medium",
      label: "Medium",
      description: "Balanced performance and visuals",
    },
    {
      value: "high",
      label: "High",
      description: "Great visuals, good performance",
    },
    {
      value: "ultra",
      label: "Ultra",
      description: "Maximum quality, high-end GPUs",
    },
  ];

  const getFPSColor = (fps: number) => {
    if (fps >= 55) return "text-green-500";
    if (fps >= 30) return "text-yellow-500";
    return "text-red-500";
  };

  const getDeviceCapabilityBadge = () => {
    const colors = {
      low: "bg-orange-500/20 text-orange-500",
      medium: "bg-blue-500/20 text-blue-500",
      high: "bg-green-500/20 text-green-500",
    };

    return (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${colors[deviceCapability]}`}
      >
        {deviceCapability.toUpperCase()} DEVICE
      </span>
    );
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 z-50 bg-black/80 border-cyan-500/50 hover:bg-cyan-500/20 hover:border-cyan-500 transition-all duration-300"
          title="Performance Settings"
        >
          <Settings className="h-5 w-5 text-cyan-500" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-96 bg-black/95 border-cyan-500/50 backdrop-blur-xl"
        align="end"
        side="top"
      >
        <Card className="border-0 bg-transparent">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-cyan-500 flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Performance Settings
              </CardTitle>
              {getDeviceCapabilityBadge()}
            </div>
            <CardDescription className="text-gray-400">
              Optimize your 3D experience
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* FPS Monitor */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-900/50 border border-gray-800">
              <div className="flex items-center gap-2">
                <Monitor className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-300">Current FPS</span>
              </div>
              <span className={`text-lg font-bold ${getFPSColor(currentFPS)}`}>
                {currentFPS}
              </span>
            </div>

            {/* Quality Preset */}
            <div className="space-y-2">
              <Label htmlFor="quality" className="text-sm text-gray-300">
                Quality Preset
              </Label>
              <Select
                value={settings.quality}
                onValueChange={(value) => setQuality(value as QualityLevel)}
              >
                <SelectTrigger
                  id="quality"
                  className="bg-gray-900/50 border-gray-700 text-white"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  {qualityOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="text-white hover:bg-gray-800"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{option.label}</span>
                        <span className="text-xs text-gray-400">
                          {option.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Auto-Optimize Toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-900/50 border border-gray-800">
              <div className="space-y-0.5">
                <Label
                  htmlFor="auto-optimize"
                  className="text-sm text-gray-300"
                >
                  Auto-Optimize
                </Label>
                <p className="text-xs text-gray-500">
                  Automatically adjust quality based on FPS
                </p>
              </div>
              <Switch
                id="auto-optimize"
                checked={autoOptimize}
                onCheckedChange={setAutoOptimize}
              />
            </div>

            {/* Mouse Parallax Toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-900/50 border border-gray-800">
              <div className="space-y-0.5">
                <Label
                  htmlFor="mouse-parallax"
                  className="text-sm text-gray-300 flex items-center gap-2"
                >
                  {settings.enableMouseParallax ? (
                    <Eye className="h-4 w-4 text-cyan-500" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  )}
                  Mouse Parallax
                </Label>
                <p className="text-xs text-gray-500">
                  Camera follows mouse movement
                </p>
              </div>
              <Switch
                id="mouse-parallax"
                checked={settings.enableMouseParallax}
                onCheckedChange={(checked) =>
                  updateSettings({ enableMouseParallax: checked })
                }
              />
            </div>

            {/* Current Settings Summary */}
            <div className="pt-3 border-t border-gray-800">
              <p className="text-xs text-gray-500 mb-2">Active Features:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      settings.enableShadows ? "bg-green-500" : "bg-gray-600"
                    }`}
                  />
                  <span className="text-gray-400">Shadows</span>
                </div>
                <div className="flex items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      settings.enableFog ? "bg-green-500" : "bg-gray-600"
                    }`}
                  />
                  <span className="text-gray-400">Fog</span>
                </div>
                <div className="flex items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      settings.enablePostProcessing
                        ? "bg-green-500"
                        : "bg-gray-600"
                    }`}
                  />
                  <span className="text-gray-400">Post-FX</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-cyan-500" />
                  <span className="text-gray-400">
                    {settings.particleCount} Particles
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};
