import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, BookOpen, TrendingUp, Heart, BarChart3 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { RecentEntries } from "@/components/ui/recent-entries";
import { WellbeingStats } from "@/components/ui/wellbeing-stats";
import { JournalCalendar } from "@/components/ui/journal-calendar";
import CountUp from "@/components/ui/CountUp";
import type { User } from "@supabase/supabase-js";

// Mock entries data (this should come from your actual data source)
const mockEntries = {
  "2025-08-15": { title: "A Beautiful Morning", hasEntry: true },
  "2025-08-14": { title: "Challenging Day at Work", hasEntry: true },
  "2025-08-13": { title: "Family Time", hasEntry: true },
  "2025-08-12": { title: "Reflection on Goals", hasEntry: true },
  "2025-08-10": { title: "Weekend Adventures", hasEntry: true },
  "2025-08-08": { title: "Quiet Sunday", hasEntry: true },
  "2025-08-05": { title: "Productive Day", hasEntry: true },
  "2025-08-03": { title: "Creative Inspiration", hasEntry: true },
  "2025-08-01": { title: "New Month Goals", hasEntry: true },
  "2025-08-20": { title: "Summer Vibes", hasEntry: true },
  "2025-08-22": { title: "Project Milestone", hasEntry: true },
  "2025-08-25": { title: "Weekend Getaway", hasEntry: true },
  "2025-08-28": { title: "Learning New Skills", hasEntry: true },
};

// Function to calculate current streak
const calculateStreak = (entries: Record<string, any>) => {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0]; // Format: YYYY-MM-DD

  let streak = 0;
  let currentDate = new Date(today);

  // Check if today has an entry
  const todayHasEntry = entries[todayStr]?.hasEntry;

  // If today doesn't have an entry, start from yesterday
  if (!todayHasEntry) {
    currentDate.setDate(currentDate.getDate() - 1);
  }

  // Count consecutive days backwards
  while (true) {
    const dateStr = currentDate.toISOString().split("T")[0];
    const hasEntry = entries[dateStr]?.hasEntry;

    if (hasEntry) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

interface DashboardProps {
  user: User | null;
}

export default function HomePage({ user }: DashboardProps) {
  const currentStreak = calculateStreak(mockEntries);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3aa0f7]/10 via-[#8b59fb]/10 to-[#5b5bfb]/10">
      <div className="container mx-auto px-8 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            How are you{" "}
            {user?.user_metadata?.global_name ||
              user?.user_metadata?.full_name ||
              user?.user_metadata?.name ||
              user?.user_metadata?.display_name ||
              user?.email?.split("@")[0] ||
              ""}
            ?
          </h1>
        </header>

        {/* Calendar Section - Moved to Top */}
        <section className="mb-12" aria-labelledby="progress-title">
          <Card>
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle id="progress-title">Your Progress</CardTitle>
                  <CardDescription>Keep it up!</CardDescription>
                </div>
                {/* Streak Counter */}
                <div
                  className="flex items-center gap-1 bg-gradient-to-r from-[#e4ce48]/20 to-[#e4ce48]/30 px-4 py-2 rounded-full border border-[#e4ce48]/40"
                  role="status"
                  aria-label={`Current streak: ${currentStreak} ${
                    currentStreak === 1 ? "day" : "days"
                  }`}
                >
                  <Image
                    src="/fire.webp"
                    alt="Fire icon representing streak"
                    width={34}
                    height={34}
                    className="w-8 h-8"
                  />
                  <div className="flex items-center gap-1">
                    <CountUp
                      to={currentStreak}
                      className="text-lg font-bold text-[#e4ce48]"
                      duration={1.5}
                    />
                    <span className="text-sm text-[#e4ce48]">
                      {currentStreak === 1 ? "day" : "days"}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <JournalCalendar />
            </CardContent>
          </Card>
        </section>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions - 2x2 Grid */}
          <nav
            className="grid grid-cols-2 gap-4 h-full"
            aria-label="Quick actions"
          >
            <Link href="/app/journal/new" className="h-full">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-[#3aa0f7]/30 h-full flex flex-col justify-center">
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-[#3aa0f7]/20 rounded-full flex items-center justify-center mb-2">
                    <Plus
                      className="w-6 h-6 text-[#3aa0f7]"
                      aria-hidden="true"
                    />
                  </div>
                  <CardTitle className="text-lg">New Entry</CardTitle>
                  <CardDescription>Write about your day</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/app/journal" className="h-full">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-[#fb7442]/30 h-full flex flex-col justify-center">
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-[#fb7442]/20 rounded-full flex items-center justify-center mb-2">
                    <BookOpen
                      className="w-6 h-6 text-[#fb7442]"
                      aria-hidden="true"
                    />
                  </div>
                  <CardTitle className="text-lg">View Entries</CardTitle>
                  <CardDescription>Read past reflections</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/app/insights" className="h-full">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-[#8b59fb]/30 h-full flex flex-col justify-center">
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-[#8b59fb]/20 rounded-full flex items-center justify-center mb-2">
                    <Heart
                      className="w-6 h-6 text-[#8b59fb]"
                      aria-hidden="true"
                    />
                  </div>
                  <CardTitle className="text-lg">Insights</CardTitle>
                  <CardDescription>Insights on your wellbeing</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/app/analytics" className="h-full">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-[#5b5bfb]/30 h-full flex flex-col justify-center">
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-[#5b5bfb]/20 rounded-full flex items-center justify-center mb-2">
                    <BarChart3
                      className="w-6 h-6 text-[#5b5bfb]"
                      aria-hidden="true"
                    />
                  </div>
                  <CardTitle className="text-lg">Analytics</CardTitle>
                  <CardDescription>Your statistics</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </nav>

          {/* Recent Entries */}
          <section
            className="lg:col-span-2"
            aria-labelledby="recent-entries-title"
          >
            <Card>
              <CardHeader>
                <CardTitle
                  className="flex items-center gap-2"
                  id="recent-entries-title"
                >
                  <BookOpen className="w-5 h-5" aria-hidden="true" />
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
          </section>
        </div>
      </div>
    </div>
  );
}
