
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import MainLayout from "@/components/layout/MainLayout";
import { AuthProvider } from "@/components/userAuth/AuthContextExtended";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Messages from "./pages/Messages";
import NotFound from "./pages/NotFound";
import Community from "./pages/Community";
import CalendarPage from "./pages/Calendar";
import Settings from "./pages/settings/Settings";
import Profile from "./pages/settings/Profile";
import NotificationSettings from "./pages/settings/Notifications";
import Upgrade from "./pages/settings/Upgrade";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/community" element={<Community />} />
            <Route path="/calendar" element={<CalendarPage />} />
            
            <Route path="/settings" element={<Settings />}>
              <Route index element={<Profile />} />
              <Route path="profile" element={<Profile />} />
              <Route path="notifications" element={<NotificationSettings />} />
              <Route path="upgrade" element={<Upgrade />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainLayout>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
