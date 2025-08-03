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

const analytics = [
  {
    title: "Most Active Day",
    value: "Wednesday",
    description: "You write the most entries on Wednesdays",
    icon: Calendar,
    color: "text-blue-500",
  },
  {
    title: "Writing Streak",
    value: "7 days",
    description: "Current consecutive days of journaling",
    icon: Target,
    color: "text-purple-500",
  },
  {
    title: "Total Entries",
    value: "42",
    description: "Entries written this month",
    icon: BookOpen,
    color: "text-indigo-500",
  },
  {
    title: "Average Words",
    value: "284",
    description: "Words per entry this month",
    icon: Hash,
    color: "text-green-500",
  },
];

const topTags = [
  { name: "gratitude", count: 15 },
  { name: "work", count: 12 },
  { name: "family", count: 10 },
  { name: "nature", count: 8 },
  { name: "growth", count: 7 },
  { name: "challenges", count: 6 },
];

const weeklyStats = [
  { day: "Monday", entries: 3, words: 850 },
  { day: "Tuesday", entries: 2, words: 620 },
  { day: "Wednesday", entries: 5, words: 1420 },
  { day: "Thursday", entries: 4, words: 1136 },
  { day: "Friday", entries: 3, words: 852 },
  { day: "Saturday", entries: 2, words: 568 },
  { day: "Sunday", entries: 3, words: 912 },
];

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navigation />
      <div className="container mx-auto px-8 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Analytics & Statistics
          </h1>
          <p className="text-gray-600">
            Data insights from your journaling journey
          </p>
        </div>

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
                {weeklyStats.map((stat) => (
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
                            className="h-2 bg-indigo-500 rounded-full"
                            style={{ width: `${(stat.entries / 5) * 100}%` }}
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
    </div>
  );
}
