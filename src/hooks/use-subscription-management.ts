import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export function useSubscriptionManagement() {
  const { profile } = useAuth();

  const openPortalMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to open billing portal');
      }

      const { url } = await response.json();
      return url;
    },
    onSuccess: (url) => {
      // Redirect to Stripe billing portal
      window.location.href = url;
    },
    onError: (error: Error) => {
      console.error('Portal error:', error);
      toast.error(error.message || 'Failed to open billing portal');
    },
  });

  const hasActiveSubscription = profile?.tier === 'pro' &&
    profile?.subscription_status === 'active';

  return {
    openBillingPortal: () => openPortalMutation.mutate(),
    isLoading: openPortalMutation.isPending,
    hasActiveSubscription,
    subscriptionStatus: profile?.subscription_status,
    isProUser: profile?.tier === 'pro',
  };
}
