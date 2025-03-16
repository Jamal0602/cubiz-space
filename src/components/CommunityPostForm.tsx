
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader } from "@/components/ui/loader";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/userAuth/AuthContextExtended";

export function CommunityPostForm({ onPostCreated }: { onPostCreated: () => void }) {
  const { user, profile } = useAuth();
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    try {
      setIsPosting(true);
      
      const { error } = await supabase
        .from("community_posts")
        .insert({
          content,
          created_by: user.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your post has been published"
      });
      
      setContent("");
      onPostCreated();
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive"
      });
    } finally {
      setIsPosting(false);
    }
  };

  if (!user) {
    return (
      <div className="rounded-lg border bg-card p-4 text-center shadow-sm">
        <p className="text-muted-foreground">Please log in to create a post</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex gap-3">
        <Avatar>
          <AvatarImage src={profile?.avatar_url || ""} />
          <AvatarFallback>{profile?.full_name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <Textarea 
            placeholder="Share something with the community..." 
            className="min-h-[100px] resize-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={isPosting || !content.trim()}>
              {isPosting ? <Loader size="sm" className="mr-2" /> : null}
              Post
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
