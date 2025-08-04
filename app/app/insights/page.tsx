import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Heart,
  Brain,
} from "lucide-react";
import { Navigation } from "@/components/ui/navigation";

const aiInsights = [
  {
    type: "pattern",
    title: "Sleep Pattern Observation",
    description:
      "You've mentioned staying up late 5 times this week. Irregular sleep patterns can significantly impact your mental wellbeing and cognitive function.",
    suggestion:
      "Try setting a 'wind-down' alarm 1 hour before your target bedtime. Create a relaxing routine like reading or gentle stretching.",
    priority: "high",
    category: "Health",
  },
  {
    type: "growth",
    title: "Emotional Growth",
    description:
      "Your recent entries show increased self-awareness and emotional processing. You're becoming more mindful of your reactions and triggers.",
    suggestion:
      "Continue this positive trend by practicing daily mindfulness exercises. Consider keeping a separate emotions journal to track patterns.",
    priority: "positive",
    category: "Mental Health",
  },
  {
    type: "social",
    title: "Social Connection",
    description:
      "You've written about feeling isolated in 3 recent entries. Limited social interaction can impact mood and overall wellbeing.",
    suggestion:
      "Schedule one social activity this week, even if it's a brief coffee with a friend or a video call with family.",
    priority: "medium",
    category: "Relationships",
  },
  {
    type: "stress",
    title: "Work-Life Balance",
    description:
      "Your entries indicate high work stress levels, with mentions of overtime and deadline pressure in 60% of recent entries.",
    suggestion:
      "Try the 'two-minute rule': if a task takes less than two minutes, do it immediately. For larger tasks, break them into smaller, manageable chunks.",
    priority: "high",
    category: "Work",
  },
  {
    type: "habit",
    title: "Exercise Patterns",
    description:
      "You've mentioned feeling energized after physical activity in several entries, but exercise frequency has decreased recently.",
    suggestion:
      "Start with just 10 minutes of movement daily. Even a short walk can boost mood and energy levels significantly.",
    priority: "medium",
    category: "Physical Health",
  },
];

const wellbeingTips = [
  {
    title: "Morning Sunlight Exposure",
    description:
      "Get 10-15 minutes of natural sunlight within the first hour of waking to regulate your circadian rhythm.",
    icon: "☀️",
  },
  {
    title: "Gratitude Practice",
    description:
      "Write down 3 specific things you're grateful for each day. This can improve mood and life satisfaction.",
    icon: "🙏",
  },
  {
    title: "Deep Breathing",
    description:
      "Practice 4-7-8 breathing when stressed: inhale for 4, hold for 7, exhale for 8 counts.",
    icon: "🫁",
  },
  {
    title: "Digital Boundaries",
    description:
      "Create phone-free zones during meals and 1 hour before bedtime to improve sleep and presence.",
    icon: "📱",
  },
];

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case "high":
      return <AlertTriangle className="w-5 h-5 text-red-500" />;
    case "medium":
      return <Lightbulb className="w-5 h-5 text-yellow-500" />;
    case "positive":
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    default:
      return <Lightbulb className="w-5 h-5 text-blue-500" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "border-[#fb7442]/30 bg-[#fb7442]/10";
    case "medium":
      return "border-[#e4ce48]/30 bg-[#e4ce48]/10";
    case "positive":
      return "border-[#3aa0f7]/30 bg-[#3aa0f7]/10";
    default:
      return "border-[#5b5bfb]/30 bg-[#5b5bfb]/10";
  }
};

export default function InsightsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#3aa0f7]/10 via-[#8b59fb]/10 to-[#5b5bfb]/10">
      <Navigation />
      <div className="container mx-auto px-8 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI-Powered Insights
          </h1>
          <p className="text-gray-600">
            Personalized suggestions and observations from your journal entries
          </p>
        </header>

        {/* Summary Cards */}
        <section
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          aria-label="Insights summary"
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Brain className="w-5 h-5 text-[#8b59fb]" aria-hidden="true" />
                <span>Insights Generated</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">5</div>
              <p className="text-sm text-gray-600">Based on recent entries</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle
                  className="w-5 h-5 text-[#fb7442]"
                  aria-hidden="true"
                />
                <span>Priority Areas</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">2</div>
              <p className="text-sm text-gray-600">Require attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp
                  className="w-5 h-5 text-[#3aa0f7]"
                  aria-hidden="true"
                />
                <span>Positive Trends</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">1</div>
              <p className="text-sm text-gray-600">Areas of growth</p>
            </CardContent>
          </Card>
        </section>

        {/* AI Insights */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-[#e4ce48]" />
              Personalized Insights
            </CardTitle>
            <CardDescription>
              AI analysis of your journal entries with actionable suggestions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {aiInsights.map((insight, index) => (
                <div
                  key={index}
                  className={`p-5 border rounded-lg ${getPriorityColor(
                    insight.priority
                  )}`}
                >
                  <div className="flex items-start gap-4">
                    {getPriorityIcon(insight.priority)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900">
                          {insight.title}
                        </h4>
                        <span className="px-2 py-1 text-xs bg-white rounded-full text-gray-600 border">
                          {insight.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">
                        {insight.description}
                      </p>
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 mb-1">
                              Suggested Action:
                            </p>
                            <p className="text-sm text-gray-700">
                              {insight.suggestion}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        Wellbeing Tips
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Daily Wellbeing Tips
            </CardTitle>
            <CardDescription>
              Evidence-based practices to enhance your mental health
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {wellbeingTips.map((tip, index) => (
                <div
                  key={index}
                  className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{tip.icon}</span>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">
                        {tip.title}
                      </h4>
                      <p className="text-sm text-gray-600">{tip.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
