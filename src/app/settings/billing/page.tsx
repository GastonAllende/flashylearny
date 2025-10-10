'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Crown, CreditCard, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscriptionManagement } from '@/hooks/use-subscription-management';
import { useUIStore } from '@/stores/ui';
import { toast } from 'sonner';
import { PRICING } from '@/lib/subscription';

export default function BillingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loading: authLoading } = useAuth();
  const { openBillingPortal, isLoading: portalLoading, subscriptionStatus, isProUser } = useSubscriptionManagement();
  const { openModal } = useUIStore();

  // Handle success/cancel redirects from Stripe
  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');

    if (success === 'true') {
      toast.success('Welcome to FlashyLearny Pro! 🎉');
      // Clear query params
      window.history.replaceState({}, '', '/settings/billing');
    } else if (canceled === 'true') {
      toast.info('Checkout canceled');
      window.history.replaceState({}, '', '/settings/billing');
    }
  }, [searchParams]);

  if (authLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  const handleUpgrade = () => {
    openModal('paywall', { context: 'deck_limit' });
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/decks')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Decks
        </Button>
        <h1 className="text-3xl font-bold">Billing & Subscription</h1>
        <p className="text-muted-foreground mt-2">
          Manage your subscription and billing information
        </p>
      </div>

      {/* Current Plan Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {isProUser ? (
                  <>
                    <Crown className="h-5 w-5 text-yellow-500" />
                    Pro Plan
                  </>
                ) : (
                  'Free Plan'
                )}
              </CardTitle>
              <CardDescription>
                {isProUser
                  ? 'You have access to all Pro features'
                  : 'Limited to 5 decks and 50 cards per deck'}
              </CardDescription>
            </div>
            <Badge variant={isProUser ? 'default' : 'secondary'} className="text-sm">
              {isProUser ? 'Active' : 'Free'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Separator className="mb-4" />

          {/* Subscription Status */}
          {isProUser && subscriptionStatus && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                {subscriptionStatus === 'active' ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <span className="text-sm font-medium">
                  Status: <span className="capitalize">{subscriptionStatus}</span>
                </span>
              </div>
              {subscriptionStatus === 'past_due' && (
                <Alert variant="destructive" className="mt-2">
                  <AlertDescription>
                    Your payment is past due. Please update your payment method to continue using Pro features.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Plan Features */}
          <div className="space-y-3 mb-6">
            <h3 className="font-semibold text-sm">Your Plan Includes:</h3>
            {isProUser ? (
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Unlimited decks</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Unlimited cards per deck</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Early access to new features</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Ad-free experience</span>
                </li>
              </ul>
            ) : (
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Up to 5 decks</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Up to 50 cards per deck</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Basic study features</span>
                </li>
              </ul>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            {isProUser ? (
              <Button
                onClick={openBillingPortal}
                disabled={portalLoading}
                className="w-full"
              >
                {portalLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Manage Subscription
                  </>
                )}
              </Button>
            ) : (
              <Button onClick={handleUpgrade} className="w-full">
                <Crown className="mr-2 h-4 w-4" />
                Upgrade to Pro - ${PRICING.pro.monthly}/month
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pricing Info */}
      {!isProUser && (
        <Card>
          <CardHeader>
            <CardTitle>Pro Plan Benefits</CardTitle>
            <CardDescription>
              Unlock unlimited learning potential
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <p className="text-sm font-medium mb-1">Monthly</p>
                <p className="text-2xl font-bold">${PRICING.pro.monthly}</p>
                <p className="text-xs text-muted-foreground">per month</p>
              </div>
              <div className="border rounded-lg p-4 relative">
                <Badge className="absolute -top-2 right-2 bg-primary text-xs">
                  Save 17%
                </Badge>
                <p className="text-sm font-medium mb-1">Yearly</p>
                <p className="text-2xl font-bold">${PRICING.pro.yearly}</p>
                <p className="text-xs text-muted-foreground">
                  per year (${(PRICING.pro.yearly / 12).toFixed(2)}/month)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
