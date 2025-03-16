
import { useState } from "react";
import { CommunityPostForm } from "@/components/CommunityPostForm";
import { CommunityPosts } from "@/components/CommunityPosts";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/components/userAuth/AuthContext";

export default function Community() {
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePostCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Community Hub</h1>
        <p className="text-muted-foreground">Share ideas, connect with others, and stay updated</p>
      </div>
      
      <Tabs defaultValue="posts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:w-auto">
          <TabsTrigger value="posts">All Posts</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts" className="space-y-6">
          {user && (
            <CommunityPostForm onPostCreated={handlePostCreated} />
          )}
          
          {!user && (
            <div className="mb-6 rounded-lg border bg-card p-6 text-center shadow-sm">
              <h3 className="mb-2 text-lg font-medium">Join the conversation</h3>
              <p className="mb-4 text-muted-foreground">Sign in to share your thoughts with the community</p>
              <Button>Sign In</Button>
            </div>
          )}
          
          <CommunityPosts key={refreshKey} />
        </TabsContent>
        
        <TabsContent value="trending">
          <div className="rounded-lg border bg-card p-8 text-center">
            <h3 className="text-xl font-medium">Trending posts coming soon</h3>
            <p className="mt-2 text-muted-foreground">We're working on curating the best content for you</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
