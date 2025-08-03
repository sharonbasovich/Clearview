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

// Mock entries data (this should come from your actual data source)
const mockEntries = {
  "2025-08-15": {
    title: "A Beautiful Morning",
    hasEntry: true,
    tags: ["gratitude", "nature", "morning"],
    wordCount: 245,
  },
  "2025-08-14": {
    title: "Challenging Day at Work",
    hasEntry: true,
    tags: ["work", "growth", "challenges"],
    wordCount: 320,
  },
  "2025-08-13": {
    title: "Family Time",
    hasEntry: true,
    tags: ["family", "joy", "connection"],
    wordCount: 180,
  },
  "2025-08-12": {
    title: "Reflection on Goals",
    hasEntry: true,
    tags: ["goals", "planning", "self-reflection"],
    wordCount: 410,
  },
  "2025-08-10": {
    title: "Weekend Adventures",
    hasEntry: true,
    tags: ["adventure", "nature", "fun"],
    wordCount: 290,
  },
  "2025-08-08": {
    title: "Quiet Sunday",
    hasEntry: true,
    tags: ["gratitude", "peace", "reflection"],
    wordCount: 156,
  },
  "2025-08-05": {
    title: "Productive Day",
    hasEntry: true,
    tags: ["work", "productivity", "achievement"],
    wordCount: 275,
  },
  "2025-08-03": {
    title: "Creative Inspiration",
    hasEntry: true,
    tags: ["creativity", "inspiration", "growth"],
    wordCount: 340,
  },
  "2025-08-01": {
    title: "New Month Goals",
    hasEntry: true,
    tags: ["goals", "planning", "motivation"],
    wordCount: 380,
  },
  "2025-08-20": {
    title: "Summer Vibes",
    hasEntry: true,
    tags: ["summer", "joy", "nature"],
    wordCount: 220,
  },
  "2025-08-22": {
    title: "Project Milestone",
    hasEntry: true,
    tags: ["work", "achievement", "milestone"],
    wordCount: 310,
  },
  "2025-08-25": {
    title: "Weekend Getaway",
    hasEntry: true,
    tags: ["travel", "adventure", "family"],
    wordCount: 420,
  },
  "2025-08-28": {
    title: "Learning New Skills",
    hasEntry: true,
    tags: ["learning", "growth", "skills"],
    wordCount: 295,
  },
};

// Function to calculate longest streak
const calculateLongestStreak = (entries: Record<string, any>) => {
  const dates = Object.keys(entries)
    .filter((dateStr) => entries[dateStr]?.hasEntry)
    .sort();

  if (dates.length === 0) return 0;

  let longestStreak = 0;
  let currentStreak = 1;

  for (let i = 1; i < dates.length; i++) {
    const prevDate = new Date(dates[i - 1]);
    const currDate = new Date(dates[i]);

    // Calculate days difference
    const timeDiff = currDate.getTime() - prevDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff === 1) {
      // Consecutive day
      currentStreak++;
    } else {
      // Streak broken
      longestStreak = Math.max(longestStreak, currentStreak);
      currentStreak = 1;
    }
  }

  // Check the last streak
  longestStreak = Math.max(longestStreak, currentStreak);

  return longestStreak;
};

// Function to calculate most active day
const calculateMostActiveDay = (entries: Record<string, any>) => {
  const dayCounts: Record<string, number> = {
    Sunday: 0,
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
  };

  Object.keys(entries).forEach((dateStr) => {
    if (entries[dateStr]?.hasEntry) {
      const date = new Date(dateStr);
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
      dayCounts[dayName]++;
    }
  });

  const mostActiveDay = Object.entries(dayCounts).reduce((a, b) =>
    dayCounts[a[0]] > dayCounts[b[0]] ? a : b
  );

  return mostActiveDay[0];
};

// Function to calculate total entries this month
const calculateTotalEntries = (entries: Record<string, any>) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  return Object.keys(entries).filter((dateStr) => {
    const date = new Date(dateStr);
    return (
      entries[dateStr]?.hasEntry &&
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear
    );
  }).length;
};

// Function to calculate average words per entry
const calculateAverageWords = (entries: Record<string, any>) => {
  const entriesWithWordCount = Object.values(entries).filter(
    (entry) => entry.hasEntry && entry.wordCount
  );

  if (entriesWithWordCount.length === 0) return 0;

  const totalWords = entriesWithWordCount.reduce(
    (sum, entry) => sum + (entry.wordCount || 0),
    0
  );

  return Math.round(totalWords / entriesWithWordCount.length);
};

// Function to calculate top tags
const calculateTopTags = (entries: Record<string, any>) => {
  const tagCounts: Record<string, number> = {};

  Object.values(entries).forEach((entry) => {
    if (entry.hasEntry && entry.tags) {
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
const calculateWeeklyStats = (entries: Record<string, any>) => {
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

  Object.entries(entries).forEach(([dateStr, entry]) => {
    if (entry.hasEntry) {
      const date = new Date(dateStr);
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
      const dayIndex = dayNames.indexOf(dayName);

      if (dayIndex !== -1) {
        weeklyStats[dayIndex].entries++;
        weeklyStats[dayIndex].words += entry.wordCount || 0;
      }
    }
  });

  return weeklyStats;
};

// Calculate actual metrics
const longestStreak = calculateLongestStreak(mockEntries);
const mostActiveDay = calculateMostActiveDay(mockEntries);
const totalEntries = calculateTotalEntries(mockEntries);
const averageWords = calculateAverageWords(mockEntries);
const topTags = calculateTopTags(mockEntries);
const weeklyStats = calculateWeeklyStats(mockEntries);

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

const analytics = [
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

export default function AnalyticsPage() {
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
                {weeklyStats.map((stat, index) => (
                  <div
                    key={stat.day}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-20 text-sm text-gray-600">
                        {stat.day}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${(stat.entries / 5) * 100}%`,
                              backgroundColor: weeklyColors[index],
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {stat.entries} entries
                        </span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-400">
                      {stat.words} words
                    </span>
                  </div>
                ))}
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
