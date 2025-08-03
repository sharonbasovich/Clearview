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
import type { User } from "@supabase/supabase-js";

interface DashboardProps {
  user: User | null;
}

export default function HomePage({ user }: DashboardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
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
        </div>

        {/* Calendar Section - Moved to Top */}
        <div className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
              <CardDescription>Keep it up!</CardDescription>
            </CardHeader>
            <CardContent>
              <JournalCalendar />
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions - 2x2 Grid */}
          <div className="grid grid-cols-2 gap-4 h-full">
            <Link href="/journal/new" className="h-full">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-indigo-200 h-full flex flex-col justify-center">
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
                    <Plus className="w-6 h-6 text-indigo-600" />
                  </div>
                  <CardTitle className="text-lg">New Entry</CardTitle>
                  <CardDescription>Write about your day</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/journal" className="h-full">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-green-200 h-full flex flex-col justify-center">
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                    <BookOpen className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">View Entries</CardTitle>
                  <CardDescription>Read past reflections</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/app/insights" className="h-full col-span-2">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-amber-200 h-full flex flex-col justify-center">
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-2">
                    <Heart className="w-6 h-6 text-amber-600" />
                  </div>
                  <CardTitle className="text-lg">Insights</CardTitle>
                  <CardDescription>Suggestions and Stats</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>

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
        </div>
      </div>
    </div>
  );
}
