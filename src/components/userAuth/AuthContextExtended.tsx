
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile, Subscription } from '@/types/app';

interface UserProfile extends Profile {
  // Additional fields can be added here
}

interface AuthContextType {
  user: any;
  profile: UserProfile | null;
  subscription: Subscription | null;
  isVerified: boolean;
  isAdmin: boolean;
  isPremium: boolean;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user and profile data
  useEffect(() => {
    const loadUserAndProfile = async () => {
      setIsLoading(true);
      
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user);
        
        // Get user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profileError) {
          console.error('Error fetching profile:', profileError);
        } else if (profileData) {
          setProfile(profileData as UserProfile);
        }
        
        // Get user subscription if any
        try {
          const { data: subscriptionData } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', session.user.id)
            .eq('status', 'active')
            .maybeSingle();
          
          if (subscriptionData) {
            setSubscription(subscriptionData as Subscription);
          }
        } catch (error) {
          console.error('Error fetching subscription:', error);
        }
      }
      
      setIsLoading(false);
    };
    
    loadUserAndProfile();
    
    // Setup auth listener
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user || null);
        setIsLoading(true);
        
        if (session?.user) {
          // Get user profile
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profileError) {
            console.error('Error fetching profile:', profileError);
          } else if (profileData) {
            setProfile(profileData as UserProfile);
          }
          
          // Get user subscription if any
          try {
            const { data: subscriptionData } = await supabase
              .from('subscriptions')
              .select('*')
              .eq('user_id', session.user.id)
              .eq('status', 'active')
              .maybeSingle();
            
            if (subscriptionData) {
              setSubscription(subscriptionData as Subscription);
            }
          } catch (error) {
            console.error('Error fetching subscription:', error);
          }
        } else {
          setProfile(null);
          setSubscription(null);
        }
        
        setIsLoading(false);
      }
    );
    
    return () => {
      authSubscription.unsubscribe();
    };
  }, []);

  const refreshProfile = async () => {
    if (!user) return;
    
    // Get user profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profileError) {
      console.error('Error fetching profile:', profileError);
    } else if (profileData) {
      setProfile(profileData as UserProfile);
    }
    
    // Get user subscription if any
    try {
      const { data: subscriptionData } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();
      
      if (subscriptionData) {
        setSubscription(subscriptionData as Subscription);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);
    
    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
    
    await refreshProfile();
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const isVerified = !!profile?.is_verified;
  const isAdmin = profile?.role === 'admin';
  const isPremium = !!subscription;

  const value = {
    user,
    profile,
    subscription,
    isVerified,
    isAdmin,
    isPremium,
    isLoading,
    signOut,
    refreshProfile,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
