
import { CalendarWidget } from "@/components/CalendarWidget";

export default function CalendarPage() {
  return (
    <div className="container mx-auto min-h-screen px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Community Calendar</h1>
        <p className="text-muted-foreground">View and join upcoming events in the community</p>
      </div>
      
      <div className="rounded-lg border shadow-sm">
        <CalendarWidget />
      </div>
    </div>
  );
}
