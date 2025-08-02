import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, BookOpen, TrendingUp, Heart } from "lucide-react";
import Link from "next/link";
import { RecentEntries } from "@/components/ui/recent-entries";
import { WellbeingStats } from "@/components/ui/wellbeing-stats";
import { JournalCalendar } from "@/components/ui/journal-calendar";
import { Navigation } from "@/components/ui/navigation";
import { MoodChart } from "@/components/ui/mood-chart";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Your Wellbeing Journey
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Track your thoughts, emotions, and personal growth in a safe,
            private space designed for your mental wellness.
          </p>
        </div>

        {/* Quick Actions */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Link href="/journal/new">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-indigo-200">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
                  <Plus className="w-6 h-6 text-indigo-600" />
                </div>
                <CardTitle className="text-lg">New Entry</CardTitle>
                <CardDescription>Write about your day</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/journal">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-green-200">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">View Entries</CardTitle>
                <CardDescription>Read past reflections</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/insights">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-purple-200">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Insights</CardTitle>
                <CardDescription>Track your progress</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/calendar">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-orange-200">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle className="text-lg">Calendar</CardTitle>
                <CardDescription>View by date</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div> */}

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Entries */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Recent Entries
                </CardTitle>
                <CardDescription>
                  Your latest journal reflections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentEntries />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Wellbeing Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Wellbeing Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <WellbeingStats />
              </CardContent>
            </Card>

            {/* Mood Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Mood Trends
                </CardTitle>
                <CardDescription>Last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <MoodChart />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
