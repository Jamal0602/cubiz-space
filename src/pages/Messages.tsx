
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/userAuth/AuthContextExtended";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader } from "@/components/ui/loader";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { Search, Send, User, UserCheck, UserPlus } from "lucide-react";
import { Message, Profile } from "@/types/app";

export default function Messages() {
  const { user, profile, isVerified } = useAuth();
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<{ [userId: string]: Profile & { unread: number } }>({});
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [messageText, setMessageText] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageRequests, setMessageRequests] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      fetchConversations();
      fetchMessageRequests();
    }
  }, [user]);

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation);
    }
  }, [activeConversation]);

  useEffect(() => {
    // Scroll to bottom of messages on new message
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const fetchConversations = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Get all messages sent or received by the user
      const { data, error } = await supabase
        .from('user_messages')
        .select(`
          id,
          sender_id,
          recipient_id,
          content,
          read,
          created_at
        `)
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (data) {
        const conversationsMap: { [userId: string]: { unread: number } } = {};
        
        // Process the conversations
        data.forEach((msg: any) => {
          // Determine the other user in the conversation
          const otherUserId = msg.sender_id === user.id ? msg.recipient_id : msg.sender_id;
          
          // Skip message requests for the main chat list
          if (msg.is_request && msg.recipient_id === user.id) {
            return;
          }
          
          // Count unread messages
          const isUnread = !msg.read && msg.recipient_id === user.id;
          
          if (!conversationsMap[otherUserId]) {
            conversationsMap[otherUserId] = { unread: isUnread ? 1 : 0 };
          } else if (isUnread) {
            conversationsMap[otherUserId].unread += 1;
          }
        });
        
        // Fetch user profiles for the conversations
        const userIds = Object.keys(conversationsMap);
        if (userIds.length > 0) {
          const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('*')
            .in('id', userIds);
          
          if (profilesError) throw profilesError;
          
          if (profiles) {
            const fullConversations: { [userId: string]: Profile & { unread: number } } = {};
            profiles.forEach((profile: Profile) => {
              fullConversations[profile.id] = {
                ...profile,
                unread: conversationsMap[profile.id].unread
              };
            });
            setConversations(fullConversations);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId: string) => {
    if (!user) return;
    
    try {
      // Mark all messages from this user as read
      await supabase
        .from('user_messages')
        .update({ read: true })
        .eq('sender_id', userId)
        .eq('recipient_id', user.id);
      
      // Get all messages between the two users
      const { data, error } = await supabase
        .from('user_messages')
        .select(`*`)
        .or(`and(sender_id.eq.${user.id},recipient_id.eq.${userId}),and(sender_id.eq.${userId},recipient_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      if (data) {
        setMessages(data as Message[]);
        
        // Update unread count in conversations
        setConversations(prev => ({
          ...prev,
          [userId]: {
            ...prev[userId],
            unread: 0
          }
        }));
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      });
    }
  };

  const fetchMessageRequests = async () => {
    if (!user) return;
    
    try {
      // Get all message requests for this user
      const { data, error } = await supabase
        .from('user_messages')
        .select(`
          *,
          profile:profiles!sender_id(id, full_name, avatar_url, is_verified, cubiz_id)
        `)
        .eq('recipient_id', user.id)
        .eq('is_request', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (data) {
        setMessageRequests(data as any[]);
      }
    } catch (error) {
      console.error("Error fetching message requests:", error);
    }
  };

  const searchUsers = async () => {
    if (!searchQuery.trim() || !user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`full_name.ilike.%${searchQuery}%,cubiz_id.ilike.%${searchQuery}%`)
        .neq('id', user.id)
        .limit(5);

      if (error) throw error;
      
      setSearchResults(data as Profile[]);
    } catch (error) {
      console.error("Error searching users:", error);
      toast({
        title: "Error",
        description: "Failed to search users",
        variant: "destructive"
      });
    }
  };

  const startConversation = (userId: string) => {
    setActiveConversation(userId);
    setSearchQuery("");
    setSearchResults([]);
  };

  const sendMessage = async () => {
    if (!user || !activeConversation || !messageText.trim()) return;
    
    setSendingMessage(true);
    try {
      const recipientId = activeConversation;
      
      // Check if this is a first message and if message requests are enabled
      let isRequest = false;
      if (!(recipientId in conversations)) {
        const { data } = await supabase
          .from('profiles')
          .select('privacy_settings')
          .eq('id', recipientId)
          .single();
        
        if (data?.privacy_settings?.messages === 'verified' && !isVerified) {
          isRequest = true;
        } else if (data?.privacy_settings?.messages === 'none') {
          throw new Error("This user doesn't accept messages");
        }
      }
      
      const { error } = await supabase
        .from('user_messages')
        .insert({
          sender_id: user.id,
          recipient_id: recipientId,
          content: messageText,
          is_request: isRequest
        });

      if (error) throw error;
      
      setMessageText("");
      
      // If not a request, update the conversation immediately
      if (!isRequest) {
        await fetchMessages(recipientId);
      } else {
        toast({
          title: "Message Request Sent",
          description: "Your message has been sent as a request since you're not verified."
        });
      }
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setSendingMessage(false);
    }
  };

  const acceptMessageRequest = async (messageId: string, senderId: string) => {
    if (!user) return;
    
    try {
      // Update the message to not be a request anymore
      const { error } = await supabase
        .from('user_messages')
        .update({ is_request: false })
        .eq('id', messageId);

      if (error) throw error;
      
      // Refresh message requests
      await fetchMessageRequests();
      
      // Start a conversation with this user
      setActiveConversation(senderId);
      
      toast({
        title: "Request Accepted",
        description: "You can now message with this user"
      });
    } catch (error) {
      console.error("Error accepting request:", error);
      toast({
        title: "Error",
        description: "Failed to accept message request",
        variant: "destructive"
      });
    }
  };

  const rejectMessageRequest = async (messageId: string) => {
    if (!user) return;
    
    try {
      // Delete the message request
      const { error } = await supabase
        .from('user_messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;
      
      // Refresh message requests
      await fetchMessageRequests();
      
      toast({
        title: "Request Rejected",
        description: "Message request has been rejected"
      });
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast({
        title: "Error",
        description: "Failed to reject message request",
        variant: "destructive"
      });
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <User size={48} className="mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Sign in to access messages</h2>
          <p className="text-muted-foreground">
            You need to be logged in to view and send messages
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto min-h-screen px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground">Stay connected with your community</p>
      </div>
      
      <Tabs defaultValue="conversations" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="requests" className="relative">
            Requests
            {messageRequests.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs text-primary-foreground">
                {messageRequests.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="conversations" className="mt-0">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Left sidebar - Conversations list */}
            <div className="rounded-lg border p-4 md:col-span-1">
              <div className="mb-4 flex items-center gap-2">
                <Input 
                  placeholder="Search users..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  size="icon" 
                  variant="outline" 
                  onClick={searchUsers}
                >
                  <Search size={16} />
                </Button>
              </div>
              
              {searchQuery && (
                <div className="mb-4 space-y-2">
                  <h3 className="mb-2 font-semibold">Search Results</h3>
                  {searchResults.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No users found</p>
                  ) : (
                    searchResults.map(user => (
                      <Button 
                        key={user.id} 
                        variant="outline" 
                        className="flex w-full justify-start gap-2"
                        onClick={() => startConversation(user.id)}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar_url || ""} />
                          <AvatarFallback>{user.full_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-start text-sm">
                          <span className="font-medium">{user.full_name}</span>
                          <span className="text-xs text-muted-foreground">@{user.cubiz_id}</span>
                        </div>
                        {user.is_verified && (
                          <span className="ml-auto flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white">
                            ✓
                          </span>
                        )}
                      </Button>
                    ))
                  )}
                </div>
              )}
              
              <h3 className="mb-2 font-semibold">Recent Conversations</h3>
              {loading ? (
                <div className="flex h-40 items-center justify-center">
                  <Loader />
                </div>
              ) : Object.keys(conversations).length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center text-center">
                  <p className="text-muted-foreground">No conversations yet</p>
                  <p className="text-sm text-muted-foreground">
                    Search for users to start chatting
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {Object.entries(conversations).map(([userId, user]) => (
                    <Button 
                      key={userId} 
                      variant={userId === activeConversation ? "default" : "outline"} 
                      className="flex w-full justify-start gap-2"
                      onClick={() => setActiveConversation(userId)}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar_url || ""} />
                        <AvatarFallback>{user.full_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start text-sm">
                        <span className="font-medium">{user.full_name}</span>
                        <span className="text-xs text-muted-foreground">@{user.cubiz_id}</span>
                      </div>
                      {user.unread > 0 && (
                        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs text-primary-foreground">
                          {user.unread}
                        </span>
                      )}
                    </Button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Right side - Messages */}
            <div className="flex h-[600px] flex-col rounded-lg border md:col-span-2">
              {!activeConversation ? (
                <div className="flex h-full flex-col items-center justify-center p-4 text-center">
                  <div className="mb-4 rounded-full bg-muted p-4">
                    <MessageSquare size={32} />
                  </div>
                  <h3 className="text-lg font-semibold">Your Messages</h3>
                  <p className="max-w-md text-muted-foreground">
                    Select a conversation or search for users to start chatting
                  </p>
                </div>
              ) : (
                <>
                  {/* Conversation header */}
                  <div className="flex items-center gap-3 border-b p-3">
                    <Avatar>
                      <AvatarImage src={conversations[activeConversation]?.avatar_url || ""} />
                      <AvatarFallback>
                        {conversations[activeConversation]?.full_name.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">
                        {conversations[activeConversation]?.full_name || "User"}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        @{conversations[activeConversation]?.cubiz_id || "user"}
                      </p>
                    </div>
                  </div>
                  
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-4">
                      {messages.length === 0 ? (
                        <div className="flex h-40 flex-col items-center justify-center text-center">
                          <p className="text-muted-foreground">No messages yet</p>
                          <p className="text-sm text-muted-foreground">
                            Send a message to start the conversation
                          </p>
                        </div>
                      ) : (
                        messages.map((message) => (
                          <div 
                            key={message.id} 
                            className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`max-w-[80%] rounded-lg p-3 ${
                                message.sender_id === user.id 
                                  ? 'rounded-tr-none bg-primary text-primary-foreground' 
                                  : 'rounded-tl-none bg-muted'
                              }`}
                            >
                              <p className="whitespace-pre-wrap break-words">{message.content}</p>
                              <p className="mt-1 text-right text-xs opacity-70">
                                {format(new Date(message.created_at), "h:mm a")}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </div>
                  
                  {/* Message input */}
                  <div className="border-t p-3">
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Type a message..." 
                        value={messageText}
                        onChange={e => setMessageText(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                      />
                      <Button 
                        size="icon" 
                        onClick={sendMessage}
                        disabled={!messageText.trim() || sendingMessage}
                      >
                        {sendingMessage ? <Loader size="sm" /> : <Send size={16} />}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="requests" className="mt-0">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Message Requests</h2>
              <p className="text-sm text-muted-foreground">
                People who want to message you but aren't connected yet
              </p>
            </CardHeader>
            <CardContent>
              {messageRequests.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center text-center">
                  <UserCheck size={32} className="mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">No pending message requests</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messageRequests.map((request: any) => (
                    <div key={request.id} className="rounded-lg border p-4">
                      <div className="mb-3 flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={request.profile?.avatar_url || ""} />
                          <AvatarFallback>
                            {request.profile?.full_name.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-1">
                            <h3 className="font-semibold">{request.profile?.full_name}</h3>
                            {request.profile?.is_verified && (
                              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white">
                                ✓
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            @{request.profile?.cubiz_id} • {format(new Date(request.created_at), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                      
                      <p className="mb-4 whitespace-pre-wrap break-words rounded-lg bg-muted p-3">
                        {request.content}
                      </p>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="default" 
                          className="gap-1"
                          onClick={() => acceptMessageRequest(request.id, request.sender_id)}
                        >
                          <UserPlus size={16} />
                          <span>Accept</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          className="gap-1"
                          onClick={() => rejectMessageRequest(request.id)}
                        >
                          <X size={16} />
                          <span>Reject</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
