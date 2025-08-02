"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const mockEntries = {
  "2024-01-15": { title: "A Beautiful Morning", hasEntry: true },
  "2024-01-14": { title: "Challenging Day at Work", hasEntry: true },
  "2024-01-13": { title: "Family Time", hasEntry: true },
  "2024-01-12": { title: "Reflection on Goals", hasEntry: true },
  "2024-01-10": { title: "Weekend Adventures", hasEntry: true },
  "2024-01-08": { title: "Quiet Sunday", hasEntry: true },
};

export function JournalCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

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

  const selectedEntry = selectedDate
    ? mockEntries[selectedDate as keyof typeof mockEntries]
    : null;

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
        <div className="grid grid-cols-7 gap-2">
          {dayNames.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-500 py-2"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
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
            const entry = mockEntries[dateString as keyof typeof mockEntries];
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
                className={`h-12 text-sm rounded-lg transition-all relative flex items-center justify-center ${
                  isSelected
                    ? "bg-indigo-100 text-indigo-700 border-2 border-indigo-300"
                    : entry
                    ? "bg-[#e4ce48]/60 text-[#8b59fb] hover:bg-[#e4ce48]/80 border border-[#e4ce48]/80 font-semibold"
                    : "hover:bg-gray-100 border border-transparent"
                } ${isToday ? "ring-4 ring-[#fb7442] ring-offset-2" : ""}`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedEntry && (
        <div className="p-4 bg-gray-50 rounded-lg border">
          <div className="text-base font-medium text-gray-900 mb-2">
            {selectedEntry.title}
          </div>
          <div className="text-sm text-gray-500">
            {selectedDate &&
              new Date(selectedDate).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
          </div>
        </div>
      )}
    </div>
  );
}
