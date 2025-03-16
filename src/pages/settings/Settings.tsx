
import { Link, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Bell, CreditCard } from "lucide-react";

export default function Settings() {
  const location = useLocation();
  const currentPath = location.pathname.split("/").pop() || "profile";

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>
      
      <div className="flex flex-col gap-8 md:flex-row">
        <div className="w-full md:w-64">
          <Tabs 
            value={currentPath} 
            orientation="vertical" 
            className="w-full"
          >
            <TabsList className="flex w-full flex-col items-stretch justify-start">
              <TabsTrigger value="profile" asChild className="justify-start">
                <Link to="/settings/profile" className="flex items-center gap-2">
                  <User size={16} />
                  <span>Profile</span>
                </Link>
              </TabsTrigger>
              <TabsTrigger value="notifications" asChild className="justify-start">
                <Link to="/settings/notifications" className="flex items-center gap-2">
                  <Bell size={16} />
                  <span>Notifications</span>
                </Link>
              </TabsTrigger>
              <TabsTrigger value="upgrade" asChild className="justify-start">
                <Link to="/settings/upgrade" className="flex items-center gap-2">
                  <CreditCard size={16} />
                  <span>Upgrade</span>
                </Link>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
