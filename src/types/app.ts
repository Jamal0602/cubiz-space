
export interface Profile {
  id: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  skills?: string[];
  cubiz_id: string;
  is_verified?: boolean;
  verified?: boolean; // Legacy field
  privacy_settings?: {
    profile: 'public' | 'private';
    posts: 'public' | 'private';
    messages: 'all' | 'verified' | 'none';
  };
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: 'monthly' | 'yearly' | 'lifetime';
  status: 'active' | 'canceled' | 'expired';
  created_at: string;
  expires_at?: string;
  payment_id?: string;
}

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  read: boolean;
  is_request: boolean;
  created_at: string;
  profile?: Profile; // For the sender profile
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  location?: string;
  start_time: string;
  end_time: string;
  event_type: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  team_id?: string;
}
