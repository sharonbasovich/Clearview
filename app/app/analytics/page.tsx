"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Target,
  Calendar,
  TrendingUp,
  Clock,
  Hash,
} from "lucide-react";
import { Navigation } from "@/components/ui/navigation";

export default function AnalyticsPage() {
  const [realEntries, setRealEntries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetch(`/api/journal-entries`);
        const data = await result.json();
        setRealEntries(data || []);
      } catch (error) {
        console.error('Error fetching journal entries:', error);
        setRealEntries([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Function to calculate word count from HTML content
  const getWordCount = (content: string) => {
    if (!content) return 0;
    const text = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return text.split(' ').filter(word => word.length > 0).length;
  };

  // Function to calculate longest streak
  const calculateLongestStreak = (entries: any[]) => {
    if (!entries || entries.length === 0) return 0;

    const dates = entries
      .map(entry => new Date(entry.createdAt).toDateString())
      .sort();

    if (dates.length === 0) return 0;

    let longestStreak = 0;
    let currentStreak = 1;

    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i - 1]);
      const currDate = new Date(dates[i]);

      const timeDiff = currDate.getTime() - prevDate.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (daysDiff === 1) {
        currentStreak++;
      } else {
        longestStreak = Math.max(longestStreak, currentStreak);
        currentStreak = 1;
      }
    }

    longestStreak = Math.max(longestStreak, currentStreak);
    return longestStreak;
  };

  // Function to calculate most active day
  const calculateMostActiveDay = (entries: any[]) => {
    if (!entries || entries.length === 0) return "No data";

    const dayCounts: Record<string, number> = {
      Sunday: 0,
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0,
    };

    entries.forEach(entry => {
      const date = new Date(entry.createdAt);
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
      dayCounts[dayName]++;
    });

    const mostActiveDay = Object.entries(dayCounts).reduce((a, b) =>
      dayCounts[a[0]] > dayCounts[b[0]] ? a : b
    );

    return mostActiveDay[0];
  };

  // Function to calculate total entries this month
  const calculateTotalEntries = (entries: any[]) => {
    if (!entries || entries.length === 0) return 0;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return entries.filter(entry => {
      const date = new Date(entry.createdAt);
      return (
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      );
    }).length;
  };

  // Function to calculate average words per entry
  const calculateAverageWords = (entries: any[]) => {
    if (!entries || entries.length === 0) return 0;

    const totalWords = entries.reduce((sum, entry) => {
      return sum + getWordCount(entry.content);
    }, 0);

    return Math.round(totalWords / entries.length);
  };

  // Function to calculate top tags
  const calculateTopTags = (entries: any[]) => {
    if (!entries || entries.length === 0) return [];

    const tagCounts: Record<string, number> = {};

    entries.forEach(entry => {
      if (entry.tags && Array.isArray(entry.tags)) {
        entry.tags.forEach((tag: string) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });

    return Object.entries(tagCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  };

  // Function to calculate weekly stats
  const calculateWeeklyStats = (entries: any[]) => {
    const dayNames = [
      "Sunday",
      "Monday", 
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const weeklyStats = dayNames.map((day) => ({ day, entries: 0, words: 0 }));

    if (!entries || entries.length === 0) return weeklyStats;

    entries.forEach(entry => {
      const date = new Date(entry.createdAt);
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
      const dayIndex = dayNames.indexOf(dayName);

      if (dayIndex !== -1) {
        weeklyStats[dayIndex].entries++;
        weeklyStats[dayIndex].words += getWordCount(entry.content);
      }
    });

    return weeklyStats;
  };

  // Calculate metrics using useMemo for performance
  const analytics = useMemo(() => {
    const longestStreak = calculateLongestStreak(realEntries);
    const mostActiveDay = calculateMostActiveDay(realEntries);
    const totalEntries = calculateTotalEntries(realEntries);
    const averageWords = calculateAverageWords(realEntries);

    return [
      {
        title: "Most Active Day",
        value: mostActiveDay,
        description: `You write the most entries on ${mostActiveDay}s`,
        icon: Calendar,
        color: "text-[#3aa0f7]",
      },
      {
        title: "Longest Streak",
        value: `${longestStreak} ${longestStreak === 1 ? "day" : "days"}`,
        description: "Longest consecutive days of journaling",
        icon: Target,
        color: "text-[#8b59fb]",
      },
      {
        title: "Total Entries",
        value: totalEntries.toString(),
        description: "Entries written this month",
        icon: BookOpen,
        color: "text-[#5b5bfb]",
      },
      {
        title: "Average Words",
        value: averageWords.toString(),
        description: "Words per entry this month",
        icon: Hash,
        color: "text-[#e4ce48]",
      },
    ];
  }, [realEntries]);

  const topTags = useMemo(() => calculateTopTags(realEntries), [realEntries]);
  const weeklyStats = useMemo(() => calculateWeeklyStats(realEntries), [realEntries]);

  // Color palette for weekly activity bars
  const weeklyColors = [
    "#e4ce48", // Sunday - Yellow
    "#3aa0f7", // Monday - Blue
    "#fb7442", // Tuesday - Orange
    "#8b59fb", // Wednesday - Purple
    "#5b5bfb", // Thursday - Indigo
    "#6c21fb", // Friday - Dark Purple
    "#b89af1", // Saturday - Light Purple
  ];

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#3aa0f7]/10 via-[#8b59fb]/10 to-[#5b5bfb]/10">
        <Navigation />
        <div className="container mx-auto px-8 py-8 pt-24">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">Loading analytics...</div>
          </div>
        </div>
      </main>
    );
  }
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#3aa0f7]/10 via-[#8b59fb]/10 to-[#5b5bfb]/10">
      <Navigation />
      <div className="container mx-auto px-8 py-8 pt-24">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Analytics & Statistics
          </h1>
          <p className="text-gray-600">
            Data insights from your journaling journey
          </p>
        </header>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {analytics.map((analytic, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <analytic.icon className={`w-5 h-5 ${analytic.color}`} />
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {analytic.value}
                </div>
                <div className="text-sm font-medium text-gray-900 mb-1">
                  {analytic.title}
                </div>
                <div className="text-xs text-gray-500">
                  {analytic.description}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Weekly Activity
              </CardTitle>
              <CardDescription>
                Your journaling patterns throughout the week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyStats.map((stat, index) => {
                  // Calculate max entries for proper bar scaling
                  const maxEntries = Math.max(...weeklyStats.map(s => s.entries), 1);
                  const barWidth = Math.min((stat.entries / maxEntries) * 100, 100);
                  
                  return (
                    <div
                      key={stat.day}
                      className="flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-16 text-sm text-gray-600 flex-shrink-0">
                          {stat.day}
                        </div>
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full min-w-0 max-w-24">
                            <div
                              className="h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${barWidth}%`,
                                backgroundColor: weeklyColors[index],
                              }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-500 flex-shrink-0">
                            {stat.entries} entries
                          </span>
                        </div>
                      </div>
                      <span className="text-sm text-gray-400 flex-shrink-0">
                        {stat.words} words
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Top Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="w-5 h-5" />
                Most Used Tags
              </CardTitle>
              <CardDescription>
                Topics you write about most frequently
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topTags.map((tag, index) => (
                  <div
                    key={tag.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-sm font-medium text-indigo-600">
                        {index + 1}
                      </div>
                      <Badge variant="secondary" className="capitalize">
                        {tag.name}
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500">
                      {tag.count} entries
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Analytics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Writing Times
              </CardTitle>
              <CardDescription>When you're most active</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Morning (6-12 PM)
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full">
                      <div className="w-3/4 h-2 bg-indigo-500 rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-500">75%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Afternoon (12-6 PM)
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full">
                      <div className="w-1/2 h-2 bg-indigo-500 rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-500">50%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Evening (6-12 AM)
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full">
                      <div className="w-1/4 h-2 bg-indigo-500 rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-500">25%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Journal Consistency</CardTitle>
              <CardDescription>Your writing habits over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">
                  Excellent
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  Consistency Rating
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-indigo-500 h-3 rounded-full"
                    style={{ width: "85%" }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  You've been consistently journaling! This regular practice
                  supports your mental wellbeing.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Entry Length Trends</CardTitle>
              <CardDescription>How much you typically write</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Short (&lt; 150 words)
                  </span>
                  <span className="text-sm font-medium">15%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Medium (150-400 words)
                  </span>
                  <span className="text-sm font-medium">60%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Long (&gt; 400 words)
                  </span>
                  <span className="text-sm font-medium">25%</span>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    Your average entry length has increased by 23% this month!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
