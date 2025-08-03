import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Smile, Meh, Frown } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";

const getMoodIcon = (mood: string) => {
  switch (mood) {
    case "happy":
      return <Smile className="w-4 h-4 text-[#e4ce48]" />;
    case "content":
      return <Smile className="w-4 h-4 text-[#3aa0f7]" />;
    case "stressed":
      return <Frown className="w-4 h-4 text-[#fb7442]" />;
    default:
      return <Meh className="w-4 h-4 text-gray-500" />;
  }
};

export function RecentEntries() {
  const [recentEntries, setRecentEntries] = useState<any[]>([]);

  useEffect(() => {
    // Fetch recent entries from an API or database
    const fetchRecentEntries = async () => {
      const result = await fetch(`/api/journal-entries`);
      const data = await result.json();
      const temp: any[] = [];

      data.forEach((entry: any) => {
        // Strip HTML tags and decode HTML entities from content
        const cleanContent = entry.content
          .replace(/<[^>]*>/g, "") // Remove HTML tags
          .replace(/&gt;/g, ">") // Decode greater than
          .replace(/&lt;/g, "<") // Decode less than
          .replace(/&amp;/g, "&") // Decode ampersand
          .replace(/&quot;/g, '"') // Decode quotes
          .replace(/&#39;/g, "'") // Decode apostrophe
          .trim();

        temp.push({
          _id: entry._id,
          title: entry.title,
          tags: entry.tags,
          date: entry.createdAt,
          preview: cleanContent.slice(0, 100) + "...",
        });
      });

      setRecentEntries(temp);
    };

    fetchRecentEntries();
  }, []);
  const sortedEntries = useMemo(() => {
    return recentEntries
      ?.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      })
      .slice(0, 3);
  }, [recentEntries]);

  if (sortedEntries.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          No entries yet. Start writing to see them here!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedEntries.map((entry) => (
        <Link key={entry._id} href={`/app/journal/${entry._id}`}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{entry.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  {entry.date.substring(0, 10)}
                  {getMoodIcon(entry.mood)}
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {entry.preview}
              </p>
              <div className="flex flex-wrap gap-2">
                {entry.tags.map((tag: any) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
