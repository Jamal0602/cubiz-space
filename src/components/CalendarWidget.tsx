
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FullScreenCalendar } from "@/components/ui/fullscreen-calendar";
import { Loader } from "@/components/ui/loader";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface Event {
  id: string;
  title: string;
  start_time: string;
  end_time?: string;
  description?: string;
  location?: string;
  event_type: string;
}

export function CalendarWidget() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    location: "",
    event_type: "community"
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("events")
        .select("*");

      if (error) throw error;
      
      // Transform events to calendar format
      const formattedEvents = data.map(event => {
        const startDate = new Date(event.start_time);
        return {
          day: startDate,
          events: [{
            id: event.id,
            name: event.title,
            time: format(startDate, "h:mm a"),
            datetime: event.start_time
          }]
        };
      });

      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast({
        title: "Error",
        description: "Failed to load events. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = (date: Date) => {
    setSelectedDate(date);
    setIsEventDialogOpen(true);
  };

  const handleCreateEvent = async () => {
    if (!selectedDate || !newEvent.title) {
      toast({
        title: "Error",
        description: "Please provide a title for the event",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const startTime = new Date(selectedDate);
      startTime.setHours(12, 0, 0, 0); // Default to noon
      
      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + 1); // Default to 1 hour duration
      
      const { data, error } = await supabase
        .from("events")
        .insert({
          title: newEvent.title,
          description: newEvent.description,
          location: newEvent.location,
          event_type: newEvent.event_type,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Event created successfully"
      });
      
      fetchEvents();
      setIsEventDialogOpen(false);
      setNewEvent({
        title: "",
        description: "",
        location: "",
        event_type: "community"
      });
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && events.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader size="lg" variant="dots" />
      </div>
    );
  }

  return (
    <div className="h-full">
      <FullScreenCalendar data={events} onAddEvent={handleAddEvent} />
      
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                value={newEvent.title} 
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                placeholder="Event title" 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input 
                id="description" 
                value={newEvent.description} 
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                placeholder="Event description" 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                value={newEvent.location} 
                onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                placeholder="Event location" 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="eventType">Event Type</Label>
              <Input 
                id="eventType" 
                value={newEvent.event_type} 
                onChange={(e) => setNewEvent({...newEvent, event_type: e.target.value})}
                placeholder="Event type" 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEventDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateEvent}>Create Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
