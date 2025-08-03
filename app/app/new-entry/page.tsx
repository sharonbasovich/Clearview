"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { Navigation } from "@/components/ui/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Mic, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewEntryPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);

      if (!user) {
        router.push("/auth");
      }
    };

    getUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        router.push("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [router, supabase.auth]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#3aa0f7]/10 via-[#8b59fb]/10 to-[#5b5bfb]/10">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8b59fb] mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#3aa0f7]/10 via-[#8b59fb]/10 to-[#5b5bfb]/10">
      <Navigation />
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/app">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Create New Entry
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose how you'd like to capture your thoughts today
          </p>
        </div>

        {/* Options Grid */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Journal Entry Option */}
            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-[#8b59fb]/50">
              <Link href="/app/journal/new" className="block">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 w-24 h-24 bg-gradient-to-br from-[#3aa0f7] to-[#8b59fb] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="w-12 h-12 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    Write Journal Entry
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-600">
                    Express your thoughts through writing with rich text formatting
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center pt-0">
                  <div className="space-y-3 text-sm text-gray-500">
                  </div>
                </CardContent>
              </Link>
            </Card>

            {/* Voice Chat Option */}
            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-[#8b59fb]/50">
              <Link href="/voice-chat" className="block">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 w-24 h-24 bg-gradient-to-br from-[#5b5bfb] to-[#8b59fb] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Mic className="w-12 h-12 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    Voice Chat
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-600">
                    Have a conversation with AI through voice interaction
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center pt-0">
                  <div className="space-y-3 text-sm text-gray-500">
                  </div>
                </CardContent>
              </Link>
            </Card>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm">
              Both options will help you capture and reflect on your thoughts in different ways.
              <br />
              Choose the method that feels most natural to you today.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
} 