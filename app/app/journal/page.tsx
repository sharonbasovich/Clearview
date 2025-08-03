"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Smile,
  Meh,
  Frown,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { Navigation } from "@/components/ui/navigation";
import { useState, useMemo, useEffect, useRef } from "react";

const mockEntries = [
  {
    id: 1,
    title: "A Beautiful Morning",
    date: "2024-01-15",
    mood: "happy",
    preview:
      "Started the day with a peaceful walk in the park. The morning sun felt so warm and welcoming...",
    tags: ["gratitude", "nature", "morning"],
  },
  {
    id: 2,
    title: "Challenging Day at Work",
    date: "2024-01-14",
    mood: "stressed",
    preview:
      "Had a difficult presentation today, but I learned a lot about handling pressure...",
    tags: ["work", "growth", "challenges"],
  },
  {
    id: 3,
    title: "Family Time",
    date: "2024-01-13",
    mood: "content",
    preview:
      "Spent the evening with family playing board games. These simple moments mean everything...",
    tags: ["family", "joy", "connection"],
  },
  {
    id: 4,
    title: "Reflection on Goals",
    date: "2024-01-12",
    mood: "thoughtful",
    preview:
      "Been thinking about my personal goals and what I want to achieve this year...",
    tags: ["goals", "planning", "self-reflection"],
  },
];

const getMoodIcon = (mood: string) => {
  switch (mood) {
    case "happy":
      return <Smile className="w-4 h-4 text-[#e4ce48]" />;
    case "content":
      return <Smile className="w-4 h-4 text-[#3aa0f7]" />;
    case "thoughtful":
      return <Meh className="w-4 h-4 text-[#fb7442]" />;
    case "stressed":
      return <Frown className="w-4 h-4 text-[#8b59fb]" />;
    default:
      return <Meh className="w-4 h-4 text-gray-500" />;
  }
};

export default function JournalPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const [realEntries, setRealEntries] = useState<any[]>();

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(`/api/journal-entries`);
      const data = await result.json();
      const temp: any[] = [];

      data.forEach((entry: any) => {
        // Remove HTML tags and get clean text
        const cleanContent = entry.content.replace(/<[^>]*>/g, "");

        // Create preview with ellipsis only if content is longer than 100 chars
        const preview =
          cleanContent.length > 100
            ? cleanContent.slice(0, 100) + "..."
            : cleanContent;

        temp.push({
          _id: entry._id,
          title: entry.title,
          tags: entry.tags,
          date: entry.createdAt,
          preview: preview,
        });
      });
      setRealEntries(temp);
    };
    fetchData();
  }, []);
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setShowFilterDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get all unique tags from entries
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    realEntries?.forEach((entry) => {
      entry.tags?.forEach?.((tag: any) => tags.add(tag)); // Add null check with optional chaining
    });
    return Array.from(tags).sort();
  }, [realEntries]);

  // Filter entries based on search query and selected tags
  const filteredEntries = useMemo(() => {
    return realEntries?.filter((entry) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.preview.toLowerCase().includes(searchQuery.toLowerCase());

      // Tag filter with null check
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => entry.tags?.includes(tag));

      return matchesSearch && matchesTags;
    });
  }, [searchQuery, selectedTags, realEntries]);
  const sortedEntries = useMemo(() => {
    return filteredEntries?.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [filteredEntries]);
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#3aa0f7]/10 via-[#8b59fb]/10 to-[#5b5bfb]/10">
      <Navigation />
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div style={{ paddingLeft: "1rem" }}>
            <h1 className="text-3xl font-bold text-gray-900">
              Journal Entries
            </h1>
            <p className="text-gray-600 mt-1">
              Your personal reflections and thoughts
            </p>
          </div>
          <Link href="/app/new-entry">
            <Button className="bg-[#3aa0f7] hover:bg-[#3aa0f7]/80">
              <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
              <span>New Entry</span>
            </Button>
          </Link>
        </header>

        {/* Search and Filter */}
        <section className="mb-8" aria-labelledby="search-filter-title">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                    aria-hidden="true"
                  />
                  <Input
                    placeholder="Search your entries..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search journal entries"
                  />
                </div>
                <div className="relative" ref={filterRef}>
                  <Button
                    variant="outline"
                    className="sm:w-auto bg-transparent"
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filter{" "}
                    {selectedTags.length > 0 && `(${selectedTags.length})`}
                  </Button>

                  {/* Filter Dropdown */}
                  {showFilterDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-900">
                          Filter by Tags
                        </h3>
                        {selectedTags.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="text-xs text-gray-500 hover:text-gray-700"
                          >
                            Clear all
                          </Button>
                        )}
                      </div>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {allTags.map((tag) => (
                          <label
                            key={tag}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedTags.includes(tag)}
                              onChange={() => toggleTag(tag)}
                              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-sm text-gray-700">{tag}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Active Filters Display */}
              {selectedTags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-sm text-gray-500">Active filters:</span>
                  {selectedTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs cursor-pointer hover:bg-gray-200"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Entries Grid */}
        <section
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          aria-label="Journal entries"
        >
          {sortedEntries?.map((entry) => (
            <Link key={entry._id} href={`/app/journal/${entry._id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar
                        className="w-4 h-4 text-gray-500"
                        aria-hidden="true"
                      />
                      <time
                        className="text-sm text-gray-500"
                        dateTime={entry.date}
                      >
                        {new Date(entry.date).toLocaleDateString()}
                      </time>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{entry.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {entry.preview.replace(/<[^>]*>/g, "")}
                  </p>
                  <div
                    className="flex flex-wrap gap-2"
                    role="list"
                    aria-label="Entry tags"
                  >
                    {entry.tags?.map((tag: string) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs"
                        role="listitem"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </section>

        {/* Empty State (if no entries) */}
        {filteredEntries?.length === 0 && (
          <section className="text-center py-12" aria-label="Empty state">
            <Card>
              <CardContent>
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <BookOpen
                    className="w-8 h-8 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {realEntries?.length === 0
                    ? "No entries yet"
                    : "No matching entries"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {realEntries?.length === 0
                    ? "Start your wellbeing journey by writing your first entry."
                    : "Try adjusting your search or filter criteria."}
                </p>
                {realEntries?.length === 0 ? (
                  <Link href="/journal/new">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
                      <span>Write First Entry</span>
                    </Button>
                  </Link>
                ) : (
                  <Button onClick={clearFilters} variant="outline">
                    <span>Clear Filters</span>
                  </Button>
                )}
              </CardContent>
            </Card>
          </section>
        )}
      </div>
    </main>
  );
}
