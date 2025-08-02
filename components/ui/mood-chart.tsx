"use client"

const moodData = [
  { day: "Mon", mood: 4 },
  { day: "Tue", mood: 3 },
  { day: "Wed", mood: 5 },
  { day: "Thu", mood: 2 },
  { day: "Fri", mood: 4 },
  { day: "Sat", mood: 5 },
  { day: "Sun", mood: 4 },
]

const getMoodColor = (mood: number) => {
  switch (mood) {
    case 1:
      return "bg-red-500"
    case 2:
      return "bg-orange-500"
    case 3:
      return "bg-yellow-500"
    case 4:
      return "bg-green-500"
    case 5:
      return "bg-emerald-500"
    default:
      return "bg-gray-300"
  }
}

export function MoodChart() {
  const maxMood = 5

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between h-32 gap-2">
        {moodData.map((data, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="flex flex-col justify-end h-24 w-full">
              <div
                className={`w-full rounded-t ${getMoodColor(data.mood)} transition-all duration-300`}
                style={{ height: `${(data.mood / maxMood) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-600 mt-2">{data.day}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>Low</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
          <span>Neutral</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-emerald-500 rounded"></div>
          <span>High</span>
        </div>
      </div>
    </div>
  )
}
