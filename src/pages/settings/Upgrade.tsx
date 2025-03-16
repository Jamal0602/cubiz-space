
import { useState } from "react";
import { Check, CreditCard } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/components/userAuth/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export default function UpgradePlan() {
  const { user, profile, subscription, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly" | "lifetime">("monthly");
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [upiId, setUpiId] = useState("");

  const planPrices = {
    monthly: "₹30",
    yearly: "₹350",
    lifetime: "₹1000"
  };

  const planFeatures = [
    "Verified profile badge",
    "Priority in community features",
    "Advanced privacy controls",
    "Early access to new features",
    "Ad-free experience"
  ];

  const planSavings = {
    monthly: "",
    yearly: "Save ₹10 compared to monthly",
    lifetime: "Best value"
  };

  const handleUpgrade = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to upgrade your account.",
        variant: "destructive"
      });
      return;
    }
    
    setPaymentDialogOpen(true);
  };

  const handlePayment = async () => {
    if (!user || !profile) return;
    
    try {
      setLoading(true);

      // In a real app, this would be integrated with a payment gateway
      // For this demo, we'll just simulate a successful payment
      
      // Store the subscription in the database
      const now = new Date();
      let expiresAt = null;
      
      if (selectedPlan === "monthly") {
        const expiry = new Date(now);
        expiry.setMonth(expiry.getMonth() + 1);
        expiresAt = expiry.toISOString();
      } else if (selectedPlan === "yearly") {
        const expiry = new Date(now);
        expiry.setFullYear(expiry.getFullYear() + 1);
        expiresAt = expiry.toISOString();
      }
      
      // Create subscription record
      const { error: subscriptionError } = await supabase
        .from("subscriptions")
        .insert({
          user_id: user.id,
          plan: selectedPlan,
          status: "active",
          expires_at: expiresAt,
          payment_id: `payment_${Date.now()}`
        });
        
      if (subscriptionError) throw subscriptionError;
      
      // Update user profile to verified status
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ is_verified: true })
        .eq("id", profile.id);
        
      if (profileError) throw profileError;
      
      await refreshProfile();
      
      toast({
        title: "Upgrade successful!",
        description: `Your account has been upgraded to the ${selectedPlan} plan.`,
      });
      
      setPaymentDialogOpen(false);
    } catch (error) {
      console.error("Error processing upgrade:", error);
      toast({
        title: "Upgrade failed",
        description: "There was an error processing your upgrade. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl space-y-8 py-8">
      <div>
        <h1 className="text-3xl font-bold">Upgrade Your Account</h1>
        <p className="text-muted-foreground">Get verified and unlock premium features</p>
      </div>

      {subscription ? (
        <Card>
          <CardHeader>
            <CardTitle>Current Subscription</CardTitle>
            <CardDescription>You are currently on the {subscription.plan} plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1.5 text-green-600 dark:bg-green-900 dark:text-green-300">
              <Check size={16} />
              <span className="text-sm font-medium">Active</span>
            </div>
            
            <div className="mt-4 space-y-2">
              <p className="font-medium">Plan Features:</p>
              <ul className="list-inside list-disc space-y-1">
                {planFeatures.map((feature, index) => (
                  <li key={index} className="text-sm">{feature}</li>
                ))}
              </ul>
            </div>
            
            {subscription.expires_at && (
              <p className="mt-4 text-sm text-muted-foreground">
                Your subscription will expire on: {new Date(subscription.expires_at).toLocaleDateString()}
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Monthly Plan */}
            <Card className={selectedPlan === "monthly" ? "border-primary" : ""}>
              <CardHeader>
                <CardTitle>Monthly</CardTitle>
                <CardDescription>Best for trying out</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">₹30<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                <ul className="mt-4 space-y-2">
                  {planFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check size={16} className="mt-0.5 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => setSelectedPlan("monthly")} 
                  variant={selectedPlan === "monthly" ? "default" : "outline"}
                  className="w-full"
                >
                  {selectedPlan === "monthly" ? "Selected" : "Select Plan"}
                </Button>
              </CardFooter>
            </Card>
            
            {/* Yearly Plan */}
            <Card className={selectedPlan === "yearly" ? "border-primary" : ""}>
              <CardHeader>
                <CardTitle>Yearly</CardTitle>
                <CardDescription>Best for regular users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">₹350<span className="text-sm font-normal text-muted-foreground">/year</span></div>
                <div className="mt-1 text-sm text-green-600">Save ₹10 compared to monthly</div>
                <ul className="mt-4 space-y-2">
                  {planFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check size={16} className="mt-0.5 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => setSelectedPlan("yearly")} 
                  variant={selectedPlan === "yearly" ? "default" : "outline"}
                  className="w-full"
                >
                  {selectedPlan === "yearly" ? "Selected" : "Select Plan"}
                </Button>
              </CardFooter>
            </Card>
            
            {/* Lifetime Plan */}
            <Card className={selectedPlan === "lifetime" ? "border-primary" : ""}>
              <CardHeader>
                <CardTitle>Lifetime</CardTitle>
                <CardDescription>Best value for money</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">₹1000<span className="text-sm font-normal text-muted-foreground">/lifetime</span></div>
                <div className="mt-1 text-sm text-green-600">Best value</div>
                <ul className="mt-4 space-y-2">
                  {planFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check size={16} className="mt-0.5 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => setSelectedPlan("lifetime")} 
                  variant={selectedPlan === "lifetime" ? "default" : "outline"}
                  className="w-full"
                >
                  {selectedPlan === "lifetime" ? "Selected" : "Select Plan"}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="flex justify-center">
            <Button size="lg" onClick={handleUpgrade}>
              Upgrade Now to {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} Plan
            </Button>
          </div>
        </>
      )}

      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Your Upgrade</DialogTitle>
            <DialogDescription>
              Pay using UPI to upgrade to the {selectedPlan} plan for {planPrices[selectedPlan]}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="text-center">
              <p className="font-medium">UPI Payment Details</p>
              <p className="mt-2 text-sm">Send payment to:</p>
              <p className="mt-1 font-mono text-lg">ja.jamalasraf@fam</p>
              <p className="mt-4 text-sm text-muted-foreground">
                Please make sure to include your email or username in the payment note.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="upi-id">Your UPI ID (for verification)</Label>
              <Input 
                id="upi-id" 
                value={upiId} 
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@bank" 
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>Cancel</Button>
            <Button onClick={handlePayment} disabled={loading || !upiId}>
              {loading ? "Processing..." : "Complete Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
