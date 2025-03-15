
import { useState } from "react";
import { motion } from "framer-motion";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Send,
  Share2,
  Bookmark,
  Flag,
  Trash2,
  Edit,
  ArrowUpRight,
  Search,
  Hash,
  TrendingUp,
  Users,
  Plus,
} from "lucide-react";

// Mock data for posts
const MOCK_POSTS = [
  {
    id: 1,
    author: {
      name: "Sarah Johnson",
      username: "sarah_dev",
      avatar: "/placeholder.svg",
    },
    content: "Just launched a new feature on my Cubiz project! It's a realtime collaboration tool that integrates with all your favorite development environments. Check it out and let me know what you think!",
    timestamp: "2 hours ago",
    likes: 24,
    comments: 8,
    isLiked: false,
    isBookmarked: false,
    tags: ["feature", "launch", "collaboration"],
    media: {
      type: "image",
      url: "/placeholder.svg"
    }
  },
  {
    id: 2,
    author: {
      name: "Tech Innovator",
      username: "tech_innovate",
      avatar: "/placeholder.svg",
    },
    content: "Looking for collaborators on an open-source project aimed at simplifying API integrations for small businesses. If you're interested in joining forces, let me know!",
    timestamp: "5 hours ago",
    likes: 18,
    comments: 12,
    isLiked: true,
    isBookmarked: true,
    tags: ["opensource", "collaboration", "api"],
  },
  {
    id: 3,
    author: {
      name: "Design Master",
      username: "design_master",
      avatar: "/placeholder.svg",
    },
    content: "Just shared some UI design resources for the community. These include component libraries, icon sets, and color palettes optimized for modern web apps. Hope they're helpful for your projects!",
    timestamp: "Yesterday",
    likes: 45,
    comments: 7,
    isLiked: false,
    isBookmarked: false,
    tags: ["design", "resources", "ui"],
    media: {
      type: "image",
      url: "/placeholder.svg"
    }
  },
  {
    id: 4,
    author: {
      name: "Code Explorer",
      username: "code_explorer",
      avatar: "/placeholder.svg",
    },
    content: "Excited to announce that I'll be speaking at the upcoming Cubiz Developers Conference! My talk will cover advanced patterns for building scalable applications. Hope to see many of you there!",
    timestamp: "2 days ago",
    likes: 56,
    comments: 23,
    isLiked: false,
    isBookmarked: true,
    tags: ["conference", "speaking", "development"],
  },
];

// Mock data for trending topics
const TRENDING_TOPICS = [
  { name: "React", posts: 342 },
  { name: "WebDev", posts: 289 },
  { name: "CubizAPI", posts: 156 },
  { name: "DesignPatterns", posts: 132 },
  { name: "OpenSource", posts: 97 },
];

// Mock data for suggested users
const SUGGESTED_USERS = [
  { name: "Alex Chen", username: "alex_tech", avatar: "/placeholder.svg", bio: "Full-stack developer | Open source contributor" },
  { name: "Maya Wilson", username: "maya_design", avatar: "/placeholder.svg", bio: "UI/UX Designer | Design systems specialist" },
  { name: "Raj Patel", username: "raj_code", avatar: "/placeholder.svg", bio: "Cloud architect | AWS certified | Tech blogger" },
];

const Community = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [postText, setPostText] = useState("");
  const [posts, setPosts] = useState(MOCK_POSTS);
  const { toast } = useToast();
  const [isPostLoading, setIsPostLoading] = useState(false);

  const handleCreatePost = () => {
    if (!postText.trim()) return;
    
    setIsPostLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newPost = {
        id: posts.length + 1,
        author: {
          name: "Current User",
          username: "your_username",
          avatar: "/placeholder.svg",
        },
        content: postText,
        timestamp: "Just now",
        likes: 0,
        comments: 0,
        isLiked: false,
        isBookmarked: false,
        tags: [],
      };
      
      setPosts([newPost, ...posts]);
      setPostText("");
      setIsPostLoading(false);
      
      toast({
        title: "Post created!",
        description: "Your post has been published to the community.",
      });
    }, 1000);
  };

  const handleLikePost = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newLikes = post.isLiked ? post.likes - 1 : post.likes + 1;
        return { ...post, likes: newLikes, isLiked: !post.isLiked };
      }
      return post;
    }));
  };

  const handleBookmarkPost = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, isBookmarked: !post.isBookmarked };
      }
      return post;
    }));
    
    toast({
      title: "Post saved",
      description: "You can find this post in your bookmarks.",
    });
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <MainLayout>
      <div className="bg-cubiz-50/30 min-h-screen pt-20">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl font-bold mb-2">Cubiz Community</h1>
            <p className="text-muted-foreground">
              Connect, share, and collaborate with the Cubiz ecosystem
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Create post */}
              <motion.div
                {...fadeInUp}
                className="glass-card rounded-xl p-6 shadow-sm"
              >
                <h2 className="font-medium mb-4">Create a Post</h2>
                <div className="space-y-4">
                  <Textarea
                    placeholder="What's on your mind?"
                    className="resize-none"
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                  />
                  <div className="flex items-center justify-between">
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Media
                    </Button>
                    <Button 
                      onClick={handleCreatePost} 
                      disabled={!postText.trim() || isPostLoading}
                      className="bg-cubiz-500 hover:bg-cubiz-600"
                    >
                      {isPostLoading ? "Posting..." : "Post"}
                      <Send className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </motion.div>
              
              {/* Tabs and posts */}
              <motion.div {...fadeInUp} className="space-y-4">
                <Tabs defaultValue="posts" onValueChange={setActiveTab}>
                  <TabsList className="glass-panel">
                    <TabsTrigger value="posts">Recent Posts</TabsTrigger>
                    <TabsTrigger value="trending">Trending</TabsTrigger>
                    <TabsTrigger value="followed">Following</TabsTrigger>
                  </TabsList>
                  
                  <div className="my-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search posts..." 
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <TabsContent value="posts" className="space-y-6 mt-4">
                    {posts.map((post, index) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="glass-card rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={post.author.avatar} alt={post.author.name} />
                              <AvatarFallback>
                                {post.author.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{post.author.name}</div>
                              <div className="text-sm text-muted-foreground">@{post.author.username}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-muted-foreground">{post.timestamp}</span>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className="cursor-pointer">
                                  <Share2 className="h-4 w-4 mr-2" />
                                  Share
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="cursor-pointer"
                                  onClick={() => handleBookmarkPost(post.id)}
                                >
                                  <Bookmark className="h-4 w-4 mr-2" />
                                  {post.isBookmarked ? "Remove bookmark" : "Bookmark"}
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                  <Flag className="h-4 w-4 mr-2" />
                                  Report
                                </DropdownMenuItem>
                                {post.author.username === "your_username" && (
                                  <>
                                    <DropdownMenuItem className="cursor-pointer">
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer text-destructive">
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-foreground leading-relaxed whitespace-pre-line">
                            {post.content}
                          </p>
                          
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {post.tags.map(tag => (
                                <span 
                                  key={tag} 
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cubiz-100 text-cubiz-800"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {post.media && (
                          <div className="mb-4 rounded-lg overflow-hidden border border-gray-100">
                            <img 
                              src={post.media.url} 
                              alt="Post media" 
                              className="w-full h-auto object-cover"
                            />
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-6">
                            <button 
                              className={`flex items-center space-x-1 text-sm ${post.isLiked ? 'text-red-500' : 'text-muted-foreground'} hover:text-red-500 transition-colors`}
                              onClick={() => handleLikePost(post.id)}
                            >
                              <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                              <span>{post.likes}</span>
                            </button>
                            <button className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                              <MessageCircle className="h-4 w-4" />
                              <span>{post.comments}</span>
                            </button>
                            <button className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                              <Share2 className="h-4 w-4" />
                              <span>Share</span>
                            </button>
                          </div>
                          <button 
                            className={`flex items-center text-sm ${post.isBookmarked ? 'text-cubiz-600' : 'text-muted-foreground'} hover:text-cubiz-600 transition-colors`}
                            onClick={() => handleBookmarkPost(post.id)}
                          >
                            <Bookmark className={`h-4 w-4 ${post.isBookmarked ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="trending" className="space-y-6 mt-4">
                    <div className="glass-card rounded-xl p-6 shadow-sm">
                      <h3 className="font-medium mb-4">Trending content will be shown here</h3>
                      <p className="text-muted-foreground">
                        Popular and trending posts from the Cubiz community will appear in this tab.
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="followed" className="space-y-6 mt-4">
                    <div className="glass-card rounded-xl p-6 shadow-sm">
                      <h3 className="font-medium mb-4">Follow users to see their posts</h3>
                      <p className="text-muted-foreground">
                        Once you follow other users, their posts will appear in this tab.
                      </p>
                      <Button className="mt-4 bg-cubiz-500 hover:bg-cubiz-600">
                        <Users className="h-4 w-4 mr-2" />
                        Discover Users
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </motion.div>
            </div>
            
            {/* Sidebar */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-6"
            >
              {/* Trending Topics */}
              <div className="glass-card rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-medium">Trending Topics</h2>
                  <TrendingUp className="h-4 w-4 text-cubiz-500" />
                </div>
                <div className="space-y-3">
                  {TRENDING_TOPICS.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Hash className="h-4 w-4 text-cubiz-400 mr-2" />
                        <span className="text-sm font-medium">
                          {topic.name}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {topic.posts} posts
                      </span>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-4 text-cubiz-600">
                  See More Topics
                  <ArrowUpRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
              
              {/* Suggested Users */}
              <div className="glass-card rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-medium">Suggested Users</h2>
                  <Users className="h-4 w-4 text-cubiz-500" />
                </div>
                <div className="space-y-4">
                  {SUGGESTED_USERS.map((user, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Avatar>
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-sm">{user.name}</div>
                            <div className="text-xs text-muted-foreground">@{user.username}</div>
                          </div>
                          <Button variant="outline" size="sm" className="h-8 text-xs">
                            Follow
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {user.bio}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-4 text-cubiz-600">
                  Find More Users
                  <ArrowUpRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
              
              {/* Community Guidelines */}
              <div className="glass-card rounded-xl p-6 shadow-sm">
                <h2 className="font-medium mb-3">Community Guidelines</h2>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start">
                    <div className="mr-2 text-cubiz-500">•</div>
                    <span>Be respectful and inclusive towards others</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 text-cubiz-500">•</div>
                    <span>Share valuable content relevant to the Cubiz ecosystem</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 text-cubiz-500">•</div>
                    <span>No spam, inappropriate content, or harassment</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 text-cubiz-500">•</div>
                    <span>Give credit when sharing others' work</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Community;
