"use client";
import Link from "next/link";
import { Card } from "./card";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function JournalCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [entriesByDate, setEntriesByDate] = useState<{ [date: string]: any[] }>(
    {}
  );

  useEffect(() => {
    const fetchEntries = async () => {
      const res = await fetch("/api/journal-entries");
      const data = await res.json();
      const grouped: { [date: string]: any[] } = {};
      data.forEach((entry: any) => {
        // Format date as YYYY-MM-DD
        const dateStr = new Date(entry.createdAt).toISOString().slice(0, 10);
        if (!grouped[dateStr]) grouped[dateStr] = [];
        grouped[dateStr].push(entry);
      });
      setEntriesByDate(grouped);
    };
    fetchEntries();
  }, []);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const selectedEntries = selectedDate ? entriesByDate[selectedDate] : null;

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth("prev")}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth("next")}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-3">
        <div className="grid grid-cols-7 gap-0">
          {dayNames.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-500 py-2"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0">
          {/* Empty cells for days before the first day of the month */}
          {Array.from({ length: firstDayOfMonth }, (_, i) => (
            <div key={`empty-${i}`} className="h-12"></div>
          ))}

          {/* Days of the month */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const dateString = formatDate(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              day
            );
            const entries = entriesByDate[dateString];
            const isSelected = selectedDate === dateString;
            const today = new Date();
            const isToday =
              day === today.getDate() &&
              currentDate.getMonth() === today.getMonth() &&
              currentDate.getFullYear() === today.getFullYear();

            return (
              <button
                key={day}
                onClick={() => setSelectedDate(dateString)}
                className={`h-12 text-sm transition-all relative flex items-center justify-center ${isSelected
                  ? entries && entries.length > 0
                    ? isToday
                      ? "bg-[#e4ce48]/60 text-[#8b59fb] border-2 border-[#fb7442] font-semibold"
                      : "bg-[#e4ce48]/60 text-[#8b59fb] border-2 border-[#5b5bfb]/40 font-semibold"
                    : isToday
                      ? "bg-[#5b5bfb]/20 text-[#5b5bfb] border-2 border-[#fb7442]"
                      : "bg-[#5b5bfb]/20 text-[#5b5bfb] border-2 border-[#5b5bfb]/40"
                  : entries && entries.length > 0
                    ? isToday
                      ? "bg-[#e4ce48]/60 text-[#8b59fb] hover:bg-[#e4ce48]/80 border-2 border-[#fb7442] font-semibold"
                      : "bg-[#e4ce48]/60 text-[#8b59fb] hover:bg-[#e4ce48]/80 border border-[#e4ce48]/80 font-semibold"
                    : isToday
                      ? "hover:bg-gray-100 border-2 border-[#fb7442]"
                      : "hover:bg-gray-100 border border-transparent"
                  }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedEntries && (
        <div className="p-4 bg-gray-50 rounded-lg border">
          {selectedEntries.map((entry: any) => (
            <Link href={`/app/journal/${entry._id || entry.id}`} key={entry._id || entry.id}>
              <Card className="p-4 mb-4" key={entry._id || entry.id}>
                <div className="text-base font-medium text-gray-900 mb-2">
                  {entry.title}
                </div>
                <div className="text-sm text-gray-500 mb-1">
                  {new Date(entry.createdAt).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </div>

              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
