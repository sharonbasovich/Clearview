import { TrendingUp, TrendingDown, Minus } from "lucide-react"

const stats = [
  {
    label: "Entries this week",
    value: "5",
    change: "+2",
    trend: "up",
  },
  {
    label: "Average mood",
    value: "4.2",
    change: "+0.3",
    trend: "up",
  },
  {
    label: "Streak",
    value: "7 days",
    change: "0",
    trend: "neutral",
  },
]

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case "up":
      return <TrendingUp className="w-4 h-4 text-green-500" />
    case "down":
      return <TrendingDown className="w-4 h-4 text-red-500" />
    default:
      return <Minus className="w-4 h-4 text-gray-500" />
  }
}

const getTrendColor = (trend: string) => {
  switch (trend) {
    case "up":
      return "text-green-600"
    case "down":
      return "text-red-600"
    default:
      return "text-gray-600"
  }
}

export function WellbeingStats() {
  return (
    <div className="space-y-4">
      {stats.map((stat, index) => (
        <div key={index} className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{stat.label}</p>
            <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
          </div>
          <div className={`flex items-center gap-1 ${getTrendColor(stat.trend)}`}>
            {getTrendIcon(stat.trend)}
            <span className="text-sm font-medium">{stat.change}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
