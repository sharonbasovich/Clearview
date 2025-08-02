"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, CalendarIcon, Smile, Meh, Frown } from "lucide-react"

const mockEntries = {
  "2024-01-15": { mood: "happy", title: "A Beautiful Morning", hasEntry: true },
  "2024-01-14": { mood: "stressed", title: "Challenging Day at Work", hasEntry: true },
  "2024-01-13": { mood: "content", title: "Family Time", hasEntry: true },
  "2024-01-12": { mood: "thoughtful", title: "Reflection on Goals", hasEntry: true },
  "2024-01-10": { mood: "happy", title: "Weekend Adventures", hasEntry: true },
  "2024-01-08": { mood: "content", title: "Quiet Sunday", hasEntry: true },
}

const getMoodColor = (mood: string) => {
  switch (mood) {
    case "happy":
      return "bg-green-100 border-green-300 text-green-800"
    case "content":
      return "bg-blue-100 border-blue-300 text-blue-800"
    case "thoughtful":
      return "bg-yellow-100 border-yellow-300 text-yellow-800"
    case "stressed":
      return "bg-red-100 border-red-300 text-red-800"
    default:
      return "bg-gray-100 border-gray-300 text-gray-800"
  }
}

const getMoodIcon = (mood: string) => {
  switch (mood) {
    case "happy":
    case "content":
      return <Smile className="w-3 h-3" />
    case "thoughtful":
      return <Meh className="w-3 h-3" />
    case "stressed":
      return <Frown className="w-3 h-3" />
    default:
      return <Meh className="w-3 h-3" />
  }
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 15)) // January 15, 2024
  const [selectedDate, setSelectedDate] = useState<string | null>("2024-01-15")

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDayOfMonth = getFirstDayOfMonth(currentDate)
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
  ]
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const selectedEntry = selectedDate ? mockEntries[selectedDate as keyof typeof mockEntries] : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Journal Calendar</h1>
          <p className="text-gray-600">View your entries by date</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5" />
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {dayNames.map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
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
                    const day = i + 1
                    const dateString = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day)
                    const entry = mockEntries[dateString as keyof typeof mockEntries]
                    const isSelected = selectedDate === dateString
                    const isToday = dateString === "2024-01-15" // Mock today's date

                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDate(dateString)}
                        className={`h-12 rounded-lg border-2 transition-all relative ${
                          isSelected
                            ? "border-indigo-500 bg-indigo-50"
                            : entry
                              ? `border-2 ${getMoodColor(entry.mood)}`
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        } ${isToday ? "ring-2 ring-indigo-300" : ""}`}
                      >
                        <span className={`text-sm font-medium ${isSelected ? "text-indigo-700" : "text-gray-900"}`}>
                          {day}
                        </span>
                        {entry && <div className="absolute bottom-1 right-1">{getMoodIcon(entry.mood)}</div>}
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Selected Date Details */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedDate
                    ? new Date(selectedDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Select a date"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedEntry ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      {getMoodIcon(selectedEntry.mood)}
                      <Badge className={getMoodColor(selectedEntry.mood)}>{selectedEntry.mood}</Badge>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{selectedEntry.title}</h3>
                      <p className="text-sm text-gray-600">
                        Click to read the full entry and explore your thoughts from this day.
                      </p>
                    </div>
                    <Button className="w-full">Read Entry</Button>
                  </div>
                ) : selectedDate ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CalendarIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 mb-4">No entry for this date</p>
                    <Button variant="outline" className="w-full bg-transparent">
                      Write Entry
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Select a date to view details</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Legend */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Mood Legend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Smile className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Happy/Content</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Meh className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm">Thoughtful/Neutral</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Frown className="w-4 h-4 text-red-600" />
                    <span className="text-sm">Stressed/Sad</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
