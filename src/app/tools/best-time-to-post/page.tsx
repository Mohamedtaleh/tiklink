"use client";

import { useState } from "react";
import { Clock, Globe, Users, Zap, Calendar, Target, TrendingUp, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useI18n } from "@/hooks/use-i18n";
import { ToolLayout } from "@/components/tools/tool-layout";
import { cn } from "@/lib/utils";

interface TimeSlot {
  day: string;
  times: { hour: string; score: number; label: string }[];
}

interface PostingSchedule {
  bestTimes: TimeSlot[];
  peakHours: string[];
  avoidHours: string[];
  tips: string[];
}

const TIMEZONES = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Paris", label: "Paris (CET)" },
  { value: "Asia/Dubai", label: "Dubai (GST)" },
  { value: "Asia/Singapore", label: "Singapore (SGT)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Australia/Sydney", label: "Sydney (AEST)" },
];

const NICHES = [
  { value: "entertainment", label: "Entertainment & Comedy", icon: "🎭" },
  { value: "education", label: "Education & How-To", icon: "📚" },
  { value: "fitness", label: "Fitness & Health", icon: "💪" },
  { value: "beauty", label: "Beauty & Fashion", icon: "💄" },
  { value: "food", label: "Food & Cooking", icon: "🍳" },
  { value: "gaming", label: "Gaming", icon: "🎮" },
  { value: "business", label: "Business & Finance", icon: "💼" },
  { value: "lifestyle", label: "Lifestyle & Vlog", icon: "✨" },
  { value: "music", label: "Music & Dance", icon: "🎵" },
  { value: "tech", label: "Tech & Gadgets", icon: "📱" },
];

const AUDIENCES = [
  { value: "gen-z", label: "Gen Z (13-24)", icon: "🧑‍🎤" },
  { value: "millennials", label: "Millennials (25-40)", icon: "👩‍💻" },
  { value: "gen-x", label: "Gen X (41-56)", icon: "👨‍💼" },
  { value: "mixed", label: "Mixed Audience", icon: "👥" },
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

function generateSchedule(timezone: string, niche: string, audience: string): PostingSchedule {
  // Base engagement patterns by hour (0-23)
  const basePattern: Record<number, number> = {
    0: 20, 1: 15, 2: 10, 3: 8, 4: 5, 5: 10,
    6: 30, 7: 50, 8: 60, 9: 70, 10: 65, 11: 75,
    12: 85, 13: 80, 14: 70, 15: 75, 16: 80, 17: 90,
    18: 95, 19: 100, 20: 95, 21: 90, 22: 70, 23: 40,
  };

  // Adjust based on niche
  const nicheAdjustments: Record<string, Record<number, number>> = {
    fitness: { 5: 20, 6: 30, 7: 20, 18: 10, 19: 10 },
    entertainment: { 19: 10, 20: 10, 21: 10, 22: 15 },
    education: { 9: 15, 10: 15, 14: 10, 15: 10 },
    business: { 8: 15, 9: 20, 17: 15, 18: 10 },
    gaming: { 14: 10, 15: 15, 20: 15, 21: 20, 22: 25 },
    food: { 11: 15, 12: 20, 17: 15, 18: 20 },
  };

  // Adjust based on audience
  const audienceAdjustments: Record<string, Record<number, number>> = {
    "gen-z": { 15: 10, 16: 15, 21: 15, 22: 20, 23: 15 },
    "millennials": { 7: 10, 8: 15, 12: 10, 19: 10 },
    "gen-x": { 6: 10, 7: 15, 20: -10, 21: -15 },
  };

  // Calculate adjusted pattern
  const adjustedPattern = { ...basePattern };
  
  if (nicheAdjustments[niche]) {
    Object.entries(nicheAdjustments[niche]).forEach(([hour, adj]) => {
      adjustedPattern[parseInt(hour)] = Math.min(100, Math.max(0, adjustedPattern[parseInt(hour)] + adj));
    });
  }
  
  if (audienceAdjustments[audience]) {
    Object.entries(audienceAdjustments[audience]).forEach(([hour, adj]) => {
      adjustedPattern[parseInt(hour)] = Math.min(100, Math.max(0, adjustedPattern[parseInt(hour)] + adj));
    });
  }

  // Day of week multipliers
  const dayMultipliers: Record<string, number> = {
    Monday: 0.9,
    Tuesday: 1.0,
    Wednesday: 1.0,
    Thursday: 1.05,
    Friday: 1.1,
    Saturday: 1.15,
    Sunday: 1.1,
  };

  // Generate best times
  const bestTimes: TimeSlot[] = DAYS.map((day) => {
    const dayScores = HOURS.map((hour) => {
      const score = Math.round(adjustedPattern[hour] * dayMultipliers[day]);
      const label = score >= 90 ? "peak" : score >= 70 ? "good" : score >= 50 ? "average" : "low";
      return {
        hour: `${hour.toString().padStart(2, "0")}:00`,
        score,
        label,
      };
    });

    return {
      day,
      times: dayScores,
    };
  });

  // Find peak and avoid hours
  const allScores = bestTimes.flatMap((d) => d.times);
  const sortedByScore = [...allScores].sort((a, b) => b.score - a.score);
  
  const peakHours = [...new Set(sortedByScore.slice(0, 6).map((t) => t.hour))];
  const avoidHours = [...new Set(sortedByScore.slice(-6).map((t) => t.hour))];

  // Generate tips based on selections
  const tips = [
    `Post consistently at your peak times for best results`,
    `${niche === "fitness" ? "Morning posts work great for fitness content" : "Evening posts typically get higher engagement"}`,
    `${audience === "gen-z" ? "Late evening posts work well for Gen Z" : "Consider posting during work breaks"}`,
    `Engage with comments within the first hour of posting`,
    `Use trending sounds during peak hours for maximum reach`,
  ];

  return { bestTimes, peakHours, avoidHours, tips };
}

function getScoreColor(score: number): string {
  if (score >= 90) return "bg-green-500";
  if (score >= 70) return "bg-emerald-400";
  if (score >= 50) return "bg-yellow-400";
  if (score >= 30) return "bg-orange-400";
  return "bg-red-400";
}

export default function BestTimeToPostPage() {
  const { t } = useI18n();
  
  const [timezone, setTimezone] = useState("America/New_York");
  const [niche, setNiche] = useState("entertainment");
  const [audience, setAudience] = useState("mixed");
  const [schedule, setSchedule] = useState<PostingSchedule | null>(null);
  const [selectedDay, setSelectedDay] = useState("Monday");

  const handleGenerate = () => {
    const result = generateSchedule(timezone, niche, audience);
    setSchedule(result);
  };

  return (
    <ToolLayout
      titleKey="tools.best-time-to-post.title"
      descriptionKey="tools.best-time-to-post.description"
      icon={<Clock className="w-10 h-10" />}
      gradient="from-purple-500 to-pink-500"
    >
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Configuration Form */}
        <Card className="shadow-2xl shadow-primary/10 border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-headline flex items-center justify-center gap-2">
              <Target className="w-6 h-6 text-accent" />
              {t("tools.best-time-to-post.configTitle")}
            </CardTitle>
            <CardDescription>{t("tools.best-time-to-post.configDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Timezone */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" />
                  {t("tools.best-time-to-post.timezone")}
                </Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEZONES.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Niche */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  {t("tools.best-time-to-post.niche")}
                </Label>
                <Select value={niche} onValueChange={setNiche}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {NICHES.map((n) => (
                      <SelectItem key={n.value} value={n.value}>
                        {n.icon} {n.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Audience */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  {t("tools.best-time-to-post.audience")}
                </Label>
                <Select value={audience} onValueChange={setAudience}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AUDIENCES.map((a) => (
                      <SelectItem key={a.value} value={a.value}>
                        {a.icon} {a.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={handleGenerate} 
              className="w-full mt-6 h-14 text-lg font-bold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Calendar className="mr-2 h-5 w-5" />
              {t("tools.best-time-to-post.generate")}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {schedule && (
          <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            {/* Peak Hours Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-green-500/20">
                      <Zap className="w-5 h-5 text-green-500" />
                    </div>
                    <span className="font-bold text-lg">{t("tools.best-time-to-post.peakHours")}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {schedule.peakHours.map((hour) => (
                      <Badge key={hour} className="bg-green-500 text-white text-sm px-3 py-1">
                        {hour}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    {t("tools.best-time-to-post.peakHoursDesc")}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-red-500/20">
                      <Clock className="w-5 h-5 text-red-500" />
                    </div>
                    <span className="font-bold text-lg">{t("tools.best-time-to-post.avoidHours")}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {schedule.avoidHours.map((hour) => (
                      <Badge key={hour} variant="outline" className="border-red-500/50 text-red-500 text-sm px-3 py-1">
                        {hour}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    {t("tools.best-time-to-post.avoidHoursDesc")}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Heatmap */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  {t("tools.best-time-to-post.weeklySchedule")}
                </CardTitle>
                <CardDescription>{t("tools.best-time-to-post.weeklyScheduleDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Day Selector */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {DAYS.map((day) => (
                    <Button
                      key={day}
                      variant={selectedDay === day ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedDay(day)}
                      className={cn(
                        selectedDay === day && "bg-gradient-to-r from-purple-500 to-pink-500"
                      )}
                    >
                      {day.slice(0, 3)}
                    </Button>
                  ))}
                </div>

                {/* Hourly Heatmap */}
                <div className="space-y-3">
                  <div className="grid grid-cols-12 gap-1">
                    {schedule.bestTimes
                      .find((d) => d.day === selectedDay)
                      ?.times.slice(0, 12)
                      .map((time, idx) => (
                        <div key={idx} className="text-center">
                          <div
                            className={cn(
                              "h-16 rounded-lg flex items-center justify-center text-white text-xs font-medium transition-all hover:scale-105",
                              getScoreColor(time.score)
                            )}
                            title={`${time.hour}: ${time.score}% engagement`}
                          >
                            {time.score}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{time.hour.slice(0, 2)}</p>
                        </div>
                      ))}
                  </div>
                  <div className="grid grid-cols-12 gap-1">
                    {schedule.bestTimes
                      .find((d) => d.day === selectedDay)
                      ?.times.slice(12)
                      .map((time, idx) => (
                        <div key={idx} className="text-center">
                          <div
                            className={cn(
                              "h-16 rounded-lg flex items-center justify-center text-white text-xs font-medium transition-all hover:scale-105",
                              getScoreColor(time.score)
                            )}
                            title={`${time.hour}: ${time.score}% engagement`}
                          >
                            {time.score}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{time.hour.slice(0, 2)}</p>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-4 mt-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-500" />
                    <span>{t("tools.best-time-to-post.peak")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-emerald-400" />
                    <span>{t("tools.best-time-to-post.good")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-yellow-400" />
                    <span>{t("tools.best-time-to-post.average")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-orange-400" />
                    <span>{t("tools.best-time-to-post.low")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="border-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  {t("tools.best-time-to-post.proTips")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {schedule.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
