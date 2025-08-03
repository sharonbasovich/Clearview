import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Smile, Meh, Frown } from "lucide-react";
import Link from "next/link";

const recentEntries = [
  {
    id: 1,
    title: "A Beautiful Morning",
    date: "2024-01-15",
    mood: "happy",
    preview: "Started the day with a peaceful walk in the park...",
    tags: ["gratitude", "nature"],
  },
  {
    id: 2,
    title: "Challenging Day at Work",
    date: "2024-01-14",
    mood: "stressed",
    preview: "Had a difficult presentation today, but I learned...",
    tags: ["work", "growth"],
  },
  {
    id: 3,
    title: "Family Time",
    date: "2024-01-13",
    mood: "content",
    preview: "Spent the evening with family playing board games...",
    tags: ["family", "joy"],
  },
];

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
  if (recentEntries.length === 0) {
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
      {recentEntries.map((entry) => (
        <Link key={entry.id} href={`/journal/${entry.id}`}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{entry.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  {entry.date}
                  {getMoodIcon(entry.mood)}
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {entry.preview}
              </p>
              <div className="flex flex-wrap gap-2">
                {entry.tags.map((tag) => (
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
