
import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FullScreenCalendar } from "@/components/ui/fullscreen-calendar";
import { Loader } from "@/components/ui/loader";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/userAuth/AuthContextExtended";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Event } from "@/types/app";

interface EventDisplay {
  id: number;
  name: string;
  time: string;
  datetime: string;
  description?: string;
  location?: string;
  eventType?: string;
}

interface CalendarData {
  day: Date;
  events: EventDisplay[];
}

export function CalendarWidget() {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<CalendarData[]>([]);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventDisplay | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    location: "",
    event_type: "community",
    start_hour: "12",
    start_minute: "00",
    end_hour: "13",
    end_minute: "00"
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
      const eventsByDay: { [key: string]: CalendarData } = {};
      
      data.forEach((event: Event) => {
        const startDate = parseISO(event.start_time);
        const day = format(startDate, "yyyy-MM-dd");
        
        if (!eventsByDay[day]) {
          eventsByDay[day] = {
            day: startDate,
            events: []
          };
        }
        
        eventsByDay[day].events.push({
          id: parseInt(event.id.replace(/-/g, "").substring(0, 8), 16),
          name: event.title,
          time: format(startDate, "h:mm a"),
          datetime: event.start_time,
          description: event.description,
          location: event.location,
          eventType: event.event_type
        });
      });
      
      const formattedEvents = Object.values(eventsByDay);
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
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to create events",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedDate(date);
    setNewEvent({
      title: "",
      description: "",
      location: "",
      event_type: "community",
      start_hour: "12",
      start_minute: "00",
      end_hour: "13",
      end_minute: "00"
    });
    setIsEventDialogOpen(true);
  };

  const handleEventClick = (event: EventDisplay) => {
    setSelectedEvent(event);
    setIsEventDetailsOpen(true);
  };

  const handleCreateEvent = async () => {
    if (!selectedDate || !newEvent.title || !user) {
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
      startTime.setHours(
        parseInt(newEvent.start_hour),
        parseInt(newEvent.start_minute),
        0,
        0
      );
      
      const endTime = new Date(selectedDate);
      endTime.setHours(
        parseInt(newEvent.end_hour),
        parseInt(newEvent.end_minute),
        0,
        0
      );
      
      // Validate times
      if (endTime <= startTime) {
        toast({
          title: "Error",
          description: "End time must be after start time",
          variant: "destructive"
        });
        return;
      }
      
      const { data, error } = await supabase
        .from("events")
        .insert({
          title: newEvent.title,
          description: newEvent.description,
          location: newEvent.location,
          event_type: newEvent.event_type,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          created_by: user.id
        })
        .select();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Event created successfully"
      });
      
      fetchEvents();
      setIsEventDialogOpen(false);
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
        <div className="flex flex-col items-center">
          <Loader size="lg" variant="dots" className="mb-4" />
          <p className="text-sm text-muted-foreground">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <FullScreenCalendar 
        data={events} 
        onAddEvent={handleAddEvent}
        onEventClick={handleEventClick} 
      />
      
      {/* Event Creation Dialog */}
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent className="max-h-screen overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title*</Label>
              <Input 
                id="title" 
                value={newEvent.title} 
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                placeholder="Event title" 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={newEvent.description} 
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                placeholder="Event description" 
                className="min-h-[100px]"
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
              <Select 
                value={newEvent.event_type}
                onValueChange={(value) => setNewEvent({...newEvent, event_type: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="community">Community</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="meetup">Meetup</SelectItem>
                  <SelectItem value="holiday">Holiday</SelectItem>
                  <SelectItem value="release">Product Release</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label>Date</Label>
              <div className="flex h-10 items-center rounded-md border border-input bg-background px-3 text-sm">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>
                  {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}
                </span>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label>Start Time</Label>
              <div className="flex gap-2">
                <Select 
                  value={newEvent.start_hour}
                  onValueChange={(value) => setNewEvent({...newEvent, start_hour: value})}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Hour" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({length: 24}, (_, i) => 
                      <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                        {i.toString().padStart(2, '0')}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <span className="flex items-center">:</span>
                <Select 
                  value={newEvent.start_minute}
                  onValueChange={(value) => setNewEvent({...newEvent, start_minute: value})}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Min" />
                  </SelectTrigger>
                  <SelectContent>
                    {['00', '15', '30', '45'].map(min => 
                      <SelectItem key={min} value={min}>{min}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label>End Time</Label>
              <div className="flex gap-2">
                <Select 
                  value={newEvent.end_hour}
                  onValueChange={(value) => setNewEvent({...newEvent, end_hour: value})}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Hour" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({length: 24}, (_, i) => 
                      <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                        {i.toString().padStart(2, '0')}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <span className="flex items-center">:</span>
                <Select 
                  value={newEvent.end_minute}
                  onValueChange={(value) => setNewEvent({...newEvent, end_minute: value})}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Min" />
                  </SelectTrigger>
                  <SelectContent>
                    {['00', '15', '30', '45'].map(min => 
                      <SelectItem key={min} value={min}>{min}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEventDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateEvent} disabled={!newEvent.title}>Create Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Event Details Dialog */}
      <Dialog open={isEventDetailsOpen} onOpenChange={setIsEventDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{selectedEvent?.time}</span>
              <Badge variant={selectedEvent?.eventType === 'holiday' ? 'destructive' : 'outline'} className="ml-2">
                {selectedEvent?.eventType}
              </Badge>
            </div>
            
            {selectedEvent?.location && (
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{selectedEvent.location}</span>
              </div>
            )}
            
            {selectedEvent?.description && (
              <div className="pt-2">
                <p className="text-sm text-muted-foreground">
                  {selectedEvent.description}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEventDetailsOpen(false)}>Close</Button>
            {isAdmin && (
              <Button>Edit Event</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
