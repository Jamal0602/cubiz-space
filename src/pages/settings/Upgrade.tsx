
import { useState } from "react";
import { useAuth } from "@/components/userAuth/AuthContextExtended";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Diamond, Star } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Loader } from "@/components/ui/loader";
import { addMonths, addYears, format } from "date-fns";

export default function Upgrade() {
  const { user, profile, subscription, refreshProfile } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpgrade = async (plan: 'monthly' | 'yearly' | 'lifetime') => {
    if (!user) return;
    
    setLoading(plan);
    
    try {
      // For a real app, you would integrate with a payment provider here
      // This is a simplified version for demo purposes
      
      let expiresAt: Date | null = null;
      
      if (plan === 'monthly') {
        expiresAt = addMonths(new Date(), 1);
      } else if (plan === 'yearly') {
        expiresAt = addYears(new Date(), 1);
      }
      
      // If user already has a subscription, update it
      if (subscription) {
        await supabase
          .from('subscriptions')
          .update({
            plan,
            status: 'active',
            expires_at: expiresAt?.toISOString(),
            payment_id: `demo-${Date.now()}`
          })
          .eq('id', subscription.id);
      } else {
        // Create a new subscription
        await supabase
          .from('subscriptions')
          .insert({
            user_id: user.id,
            plan,
            status: 'active',
            expires_at: expiresAt?.toISOString(),
            payment_id: `demo-${Date.now()}`
          });
      }
      
      // Update user profile to mark as verified
      await supabase
        .from('profiles')
        .update({
          is_verified: true
        })
        .eq('id', user.id);
      
      // Refresh profile to get updated data
      await refreshProfile();
      
      toast({
        title: "Upgraded Successfully",
        description: `Your account has been upgraded to the ${plan} plan.`,
      });
    } catch (error) {
      console.error("Error upgrading account:", error);
      toast({
        title: "Error",
        description: "Failed to upgrade account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  if (!user) {
    return <div>Please log in to access upgrade options.</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Upgrade Your Account</h1>
        <p className="text-muted-foreground">
          Unlock premium features and get verified
        </p>
      </div>
      
      {subscription && (
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="text-yellow-500" />
              <span>Current Subscription</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="font-semibold">Plan:</span>{" "}
                <Badge variant="secondary" className="ml-2 capitalize">
                  {subscription.plan}
                </Badge>
              </div>
              
              <div>
                <span className="font-semibold">Status:</span>{" "}
                <Badge variant="outline" className="ml-2 capitalize">
                  {subscription.status}
                </Badge>
              </div>
              
              {subscription.expires_at && (
                <div>
                  <span className="font-semibold">Expires:</span>{" "}
                  <span className="text-muted-foreground">
                    {format(new Date(subscription.expires_at), "MMMM d, yyyy")}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid gap-6 md:grid-cols-3">
        {/* Monthly Plan */}
        <Card>
          <CardHeader>
            <div className="mb-2 flex justify-between">
              <Badge variant="outline">Monthly</Badge>
              <Star className="text-yellow-500" />
            </div>
            <CardTitle className="flex items-baseline gap-1">
              <span>₹30</span>
              <span className="text-sm text-muted-foreground">/month</span>
            </CardTitle>
            <CardDescription>Perfect for trying out premium features</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                <span>Verified profile badge</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                <span>Priority in community events</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                <span>Advanced profile customization</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => handleUpgrade('monthly')} 
              disabled={loading !== null}
              className="w-full"
            >
              {loading === 'monthly' ? <Loader size="sm" className="mr-2" /> : null}
              Subscribe Now
            </Button>
          </CardFooter>
        </Card>
        
        {/* Yearly Plan */}
        <Card className="border-primary shadow-md">
          <CardHeader>
            <div className="mb-2 flex justify-between">
              <Badge>Best Value</Badge>
              <Diamond className="text-purple-500" />
            </div>
            <CardTitle className="flex items-baseline gap-1">
              <span>₹350</span>
              <span className="text-sm text-muted-foreground">/year</span>
            </CardTitle>
            <CardDescription>Save ₹10 compared to monthly plan</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                <span>All monthly features</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                <span>Exclusive yearly member badge</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                <span>Early access to new features</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                <span>Priority support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => handleUpgrade('yearly')}
              disabled={loading !== null}
              className="w-full"
              variant="default"
            >
              {loading === 'yearly' ? <Loader size="sm" className="mr-2" /> : null}
              Subscribe Now
            </Button>
          </CardFooter>
        </Card>
        
        {/* Lifetime Plan */}
        <Card>
          <CardHeader>
            <div className="mb-2 flex justify-between">
              <Badge variant="outline">Lifetime</Badge>
              <Crown className="text-yellow-500" />
            </div>
            <CardTitle className="flex items-baseline gap-1">
              <span>₹1000</span>
              <span className="text-sm text-muted-foreground">one-time</span>
            </CardTitle>
            <CardDescription>Pay once, enjoy premium forever</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                <span>All yearly features</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                <span>Exclusive lifetime member badge</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                <span>Never pay again</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                <span>All future premium features included</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => handleUpgrade('lifetime')}
              disabled={loading !== null}
              className="w-full"
              variant="outline"
            >
              {loading === 'lifetime' ? <Loader size="sm" className="mr-2" /> : null}
              Get Lifetime Access
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This is a demo application. In a real scenario, the payment would be processed securely through a payment gateway. For this demo, upgrades are processed instantly without actual payment.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            UPI ID for demo payments: <span className="font-mono">ja.jamalasraf@fam</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
