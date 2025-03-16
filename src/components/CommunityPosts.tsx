
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { ThumbsUp, MessageSquare, Share } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Profile {
  id: string;
  full_name: string;
  avatar_url?: string;
  is_verified?: boolean;
  cubiz_id: string;
}

interface Post {
  id: string;
  content: string;
  created_at: string;
  created_by: string;
  profile?: Profile;
}

export function CommunityPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const fetchPosts = async (pageNumber = 1, append = false) => {
    try {
      const isFirstPage = pageNumber === 1;
      if (isFirstPage) setLoading(true);
      else setLoadingMore(true);

      const pageSize = 10;
      const from = (pageNumber - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error } = await supabase
        .from('community_posts')
        .select(`
          *,
          profile:created_by(id, full_name, avatar_url, is_verified, cubiz_id)
        `)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      const formattedPosts = data.map(post => ({
        ...post,
        profile: post.profile as Profile
      }));

      if (append) {
        setPosts(prev => [...prev, ...formattedPosts]);
      } else {
        setPosts(formattedPosts);
      }

      setHasMore(data.length === pageSize);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage, true);
  };

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex h-40 flex-col items-center justify-center text-center">
        <h3 className="text-lg font-medium">No posts yet</h3>
        <p className="text-muted-foreground">Be the first to post in the community!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.id} className="overflow-hidden">
          <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
            <Avatar>
              <AvatarImage src={post.profile?.avatar_url || ""} />
              <AvatarFallback>{post.profile?.full_name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-semibold">{post.profile?.full_name || "Unknown User"}</span>
                {post.profile?.is_verified && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white">✓</span>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {post.profile?.cubiz_id || "user@cubiz"} • {format(new Date(post.created_at), "MMM d, yyyy")}
              </span>
            </div>
          </CardHeader>
          <CardContent className="pb-3 pt-2">
            <p className="whitespace-pre-line">{post.content}</p>
          </CardContent>
          <CardFooter className="border-t px-6 py-3">
            <div className="flex w-full items-center justify-between">
              <Button variant="ghost" size="sm" className="gap-1">
                <ThumbsUp size={16} />
                <span>Like</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-1">
                <MessageSquare size={16} />
                <span>Comment</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-1">
                <Share size={16} />
                <span>Share</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
      
      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button 
            variant="outline" 
            onClick={loadMore} 
            disabled={loadingMore}
          >
            {loadingMore ? <Loader size="sm" className="mr-2" /> : null}
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
