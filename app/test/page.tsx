import CalendarPage from "@/components/ui/calendar";
import { MoodChart } from "@/components/ui/mood-chart";
import { WellbeingStats } from "@/components/ui/wellbeing-stats";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Welcome to Clearview</h1>
      <p className="text-lg text-gray-600">
        A journal app to encourage reflection and mindfulness while providing
        insights.
      </p>
      <MoodChart />
      <WellbeingStats />
      <CalendarPage />
    </div>
  );
}
