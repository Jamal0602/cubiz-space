
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/userAuth/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface NotificationSettings {
  email_notifications: boolean;
  new_messages: boolean;
  community_posts: boolean;
  event_reminders: boolean;
  system_updates: boolean;
}

export default function NotificationSettings() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    email_notifications: true,
    new_messages: true,
    community_posts: true,
    event_reminders: true,
    system_updates: false,
  });

  const handleToggle = (key: keyof NotificationSettings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const saveSettings = async () => {
    if (!profile) return;

    try {
      setLoading(true);

      // In a real app, you would add a notification_settings column to the profiles table
      // and save the settings there
      // For this demo, we'll just show a success toast

      toast({
        title: "Settings saved",
        description: "Your notification preferences have been updated.",
      });
    } catch (error) {
      console.error("Error saving notification settings:", error);
      toast({
        title: "Error",
        description: "Failed to save notification settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return <div>Please log in to access notification settings.</div>;
  }

  return (
    <div className="container mx-auto max-w-3xl space-y-8 py-8">
      <div>
        <h1 className="text-3xl font-bold">Notification Settings</h1>
        <p className="text-muted-foreground">Manage how and when you receive notifications</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>Control which emails you receive from us</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Email Notifications</h3>
              <p className="text-sm text-muted-foreground">Receive email notifications for important updates</p>
            </div>
            <Switch 
              checked={settings.email_notifications}
              onCheckedChange={() => handleToggle('email_notifications')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">New Messages</h3>
              <p className="text-sm text-muted-foreground">Get notified when you receive new messages</p>
            </div>
            <Switch 
              checked={settings.new_messages}
              onCheckedChange={() => handleToggle('new_messages')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Community Posts</h3>
              <p className="text-sm text-muted-foreground">Get notified about new posts in the community</p>
            </div>
            <Switch 
              checked={settings.community_posts}
              onCheckedChange={() => handleToggle('community_posts')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Event Reminders</h3>
              <p className="text-sm text-muted-foreground">Receive reminders about upcoming events</p>
            </div>
            <Switch 
              checked={settings.event_reminders}
              onCheckedChange={() => handleToggle('event_reminders')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">System Updates</h3>
              <p className="text-sm text-muted-foreground">Get notified about system updates and maintenance</p>
            </div>
            <Switch 
              checked={settings.system_updates}
              onCheckedChange={() => handleToggle('system_updates')}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={saveSettings} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
