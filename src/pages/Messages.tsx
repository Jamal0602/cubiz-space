
import { useEffect, useState } from "react";
import { useAuth } from "@/components/userAuth/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader } from "@/components/ui/loader";
import { format } from "date-fns";
import { Send, UserPlus } from "lucide-react";

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  recipient_id: string;
  is_request: boolean;
  read: boolean;
  sender?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

interface Conversation {
  userId: string;
  fullName: string;
  avatarUrl?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}

export default function Messages() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messageRequests, setMessageRequests] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (user) {
      fetchConversations();
      fetchMessageRequests();
      
      // Set up real-time subscription for new messages
      const messageChannel = supabase
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'user_messages',
            filter: `recipient_id=eq.${user.id}`
          },
          (payload) => {
            // Update UI when new message arrives
            if (payload.new) {
              // If it's from the currently selected conversation, add to messages
              if (selectedConversation === payload.new.sender_id) {
                setMessages(prev => [...prev, payload.new as Message]);
              }
              // Refresh conversations list
              fetchConversations();
              fetchMessageRequests();
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(messageChannel);
      };
    }
  }, [user, selectedConversation]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // This is a simplified approach - in a real app, you might want to use a more efficient query
      // to get the last message from each conversation partner
      const { data: sentMessages } = await supabase
        .from('user_messages')
        .select(`
          id,
          content,
          created_at,
          recipient_id,
          profile:recipient_id(id, full_name, avatar_url)
        `)
        .eq('sender_id', user.id)
        .eq('is_request', false);
        
      const { data: receivedMessages } = await supabase
        .from('user_messages')
        .select(`
          id,
          content,
          created_at,
          sender_id,
          profile:sender_id(id, full_name, avatar_url)
        `)
        .eq('recipient_id', user.id)
        .eq('is_request', false);
        
      // Combine and process messages to get conversations
      const allMessages = [...(sentMessages || []), ...(receivedMessages || [])];
      
      // Group by conversation partner
      const conversationsMap = new Map<string, Conversation>();
      
      allMessages.forEach(msg => {
        const partnerId = msg.sender_id || msg.recipient_id;
        const partnerProfile = msg.profile;
        
        if (partnerId !== user.id && partnerProfile) {
          const existing = conversationsMap.get(partnerId);
          
          if (!existing) {
            conversationsMap.set(partnerId, {
              userId: partnerId,
              fullName: partnerProfile.full_name,
              avatarUrl: partnerProfile.avatar_url,
              lastMessage: msg.content,
              lastMessageTime: msg.created_at,
              unreadCount: 0 // Count unread in a separate query
            });
          } else if (new Date(msg.created_at) > new Date(existing.lastMessageTime || '')) {
            existing.lastMessage = msg.content;
            existing.lastMessageTime = msg.created_at;
          }
        }
      });
      
      setConversations(Array.from(conversationsMap.values()));
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessageRequests = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from('user_messages')
        .select(`
          id,
          content,
          created_at,
          sender_id,
          read,
          profile:sender_id(id, full_name, avatar_url)
        `)
        .eq('recipient_id', user.id)
        .eq('is_request', true)
        .order('created_at', { ascending: false });
        
      setMessageRequests(data || []);
    } catch (error) {
      console.error("Error fetching message requests:", error);
    }
  };

  const fetchMessages = async (partnerId: string) => {
    if (!user) return;
    
    try {
      // Fetch messages between current user and selected conversation partner
      const { data } = await supabase
        .from('user_messages')
        .select(`
          *,
          sender:sender_id(id, full_name, avatar_url)
        `)
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .or(`sender_id.eq.${partnerId},recipient_id.eq.${partnerId}`)
        .order('created_at');
        
      setMessages(data || []);
      
      // Mark messages as read
      await supabase
        .from('user_messages')
        .update({ read: true })
        .eq('recipient_id', user.id)
        .eq('sender_id', partnerId);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!user || !selectedConversation || !newMessage.trim()) return;
    
    try {
      const { data, error } = await supabase
        .from('user_messages')
        .insert({
          sender_id: user.id,
          recipient_id: selectedConversation,
          content: newMessage,
          is_request: false
        })
        .select('*, sender:sender_id(id, full_name, avatar_url)');
        
      if (error) throw error;
      
      if (data) {
        setMessages(prev => [...prev, data[0]]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const acceptMessageRequest = async (messageId: string, senderId: string) => {
    try {
      // Mark request as read
      await supabase
        .from('user_messages')
        .update({ read: true, is_request: false })
        .eq('id', messageId);
        
      // Refresh requests
      fetchMessageRequests();
      
      // Open conversation with this user
      setSelectedConversation(senderId);
    } catch (error) {
      console.error("Error accepting message request:", error);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto mt-8 max-w-4xl px-4 text-center">
        <h1 className="mb-4 text-2xl font-bold">Messages</h1>
        <p className="mb-6">You need to be logged in to access messages.</p>
        <Button>Sign In</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-8 max-w-6xl px-4">
      <h1 className="mb-6 text-2xl font-bold">Messages</h1>
      
      <Tabs defaultValue="conversations" className="h-[calc(100vh-200px)]">
        <TabsList>
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="requests">
            Message Requests
            {messageRequests.length > 0 && (
              <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                {messageRequests.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="conversations" className="h-full">
          <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-3">
            {/* Conversations List */}
            <div className="overflow-auto rounded-lg border">
              {loading ? (
                <div className="flex h-40 items-center justify-center">
                  <Loader />
                </div>
              ) : conversations.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center p-4 text-center">
                  <p className="mb-2 text-muted-foreground">No conversations yet</p>
                  <Button variant="outline" size="sm" className="gap-2">
                    <UserPlus size={16} />
                    <span>Start a new conversation</span>
                  </Button>
                </div>
              ) : (
                <div className="divide-y">
                  {conversations.map((conversation) => (
                    <button
                      key={conversation.userId}
                      className={`flex w-full items-center gap-3 p-4 text-left hover:bg-accent/50 ${
                        selectedConversation === conversation.userId ? 'bg-accent' : ''
                      }`}
                      onClick={() => setSelectedConversation(conversation.userId)}
                    >
                      <Avatar>
                        <AvatarImage src={conversation.avatarUrl || ""} />
                        <AvatarFallback>{conversation.fullName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 overflow-hidden">
                        <div className="font-medium">{conversation.fullName}</div>
                        {conversation.lastMessage && (
                          <p className="truncate text-sm text-muted-foreground">
                            {conversation.lastMessage}
                          </p>
                        )}
                      </div>
                      {conversation.lastMessageTime && (
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(conversation.lastMessageTime), "MMM d")}
                        </div>
                      )}
                      {conversation.unreadCount > 0 && (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                          {conversation.unreadCount}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Message Area */}
            <div className="relative flex h-full flex-col rounded-lg border md:col-span-2">
              {!selectedConversation ? (
                <div className="flex h-full flex-col items-center justify-center p-4 text-center">
                  <p className="mb-2 text-lg font-medium">Select a conversation</p>
                  <p className="text-muted-foreground">Choose a conversation from the list to start messaging</p>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="flex items-center gap-3 border-b p-4">
                    <Avatar>
                      <AvatarImage src={conversations.find(c => c.userId === selectedConversation)?.avatarUrl || ""} />
                      <AvatarFallback>
                        {conversations.find(c => c.userId === selectedConversation)?.fullName.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {conversations.find(c => c.userId === selectedConversation)?.fullName}
                      </div>
                    </div>
                  </div>
                  
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg px-4 py-2 ${
                              message.sender_id === user.id
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <p>{message.content}</p>
                            <div className={`mt-1 text-right text-xs ${
                              message.sender_id === user.id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                            }`}>
                              {format(new Date(message.created_at), "h:mm a")}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Input Area */}
                  <div className="border-t p-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                      />
                      <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                        <Send size={18} />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="requests">
          <Card className="p-4">
            <h3 className="mb-4 text-lg font-medium">Message Requests</h3>
            
            {messageRequests.length === 0 ? (
              <p className="text-center text-muted-foreground">You have no message requests</p>
            ) : (
              <div className="space-y-4">
                {messageRequests.map((request) => (
                  <div key={request.id} className="flex items-start gap-4 rounded-lg border p-4">
                    <Avatar>
                      <AvatarImage src={(request.profile as any)?.avatar_url || ""} />
                      <AvatarFallback>{(request.profile as any)?.full_name.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium">{(request.profile as any)?.full_name}</div>
                      <p className="mt-1">{request.content}</p>
                      <div className="mt-3 flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => acceptMessageRequest(request.id, request.sender_id)}
                        >
                          Accept
                        </Button>
                        <Button size="sm" variant="outline">Decline</Button>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(request.created_at), "MMM d, yyyy")}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
