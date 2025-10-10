'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Check } from 'lucide-react';
import { useUIStore } from '@/stores/ui';
import { PRICING } from '@/lib/subscription';
import { STRIPE_PRICES } from '@/lib/stripe';
import { toast } from 'sonner';

interface PaywallModalProps {
	isOpen: boolean;
	context?: 'deck_limit' | 'card_limit' | 'deck_limit_warning' | 'card_limit_warning';
}

export function PaywallModal({ isOpen, context = 'deck_limit' }: PaywallModalProps) {
	const { closeModal } = useUIStore();
	const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
	const [isLoading, setIsLoading] = useState(false);

	const getTitle = () => {
		switch (context) {
			case 'deck_limit':
				return 'Deck Limit Reached';
			case 'card_limit':
				return 'Card Limit Reached';
			case 'deck_limit_warning':
				return 'Running Low on Decks';
			case 'card_limit_warning':
				return 'Running Low on Cards';
			default:
				return 'Upgrade to Pro';
		}
	};

	const getDescription = () => {
		switch (context) {
			case 'deck_limit':
				return "You've reached the maximum of 5 decks on the free plan. Upgrade to Pro for unlimited decks and cards.";
			case 'card_limit':
				return "You've reached the maximum of 50 cards per deck on the free plan. Upgrade to Pro for unlimited cards.";
			case 'deck_limit_warning':
				return "You're approaching the 5 deck limit on the free plan. Upgrade to Pro for unlimited decks and cards.";
			case 'card_limit_warning':
				return "You're approaching the 50 cards per deck limit on the free plan. Upgrade to Pro for unlimited cards.";
			default:
				return 'Unlock unlimited decks and cards with FlashyLearny Pro.';
		}
	};

	const handleUpgrade = async () => {
		setIsLoading(true);

		try {
			const priceId = selectedPlan === 'monthly'
				? STRIPE_PRICES.PRO_MONTHLY
				: STRIPE_PRICES.PRO_YEARLY;

			const response = await fetch('/api/stripe/checkout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ priceId }),
			});

			console.log('response', response);

			if (!response.ok) {
				const errorData = await response.json();
				console.error('Checkout error response:', errorData);
				throw new Error(errorData.error || 'Failed to create checkout session');
			}

			const { url } = await response.json();

			if (url) {
				// Redirect to Stripe Checkout
				window.location.href = url;
			}
		} catch (error) {
			console.error('Checkout error:', error);
			toast.error('Failed to start checkout. Please try again.');
			setIsLoading(false);
		}
	};

	const benefits = [
		'Unlimited decks',
		'Unlimited cards per deck',
		'Priority support',
		'Early access to new features',
		'Ad-free experience',
	];

	return (
		<Dialog open={isOpen} onOpenChange={closeModal}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<div className="flex items-center justify-between mb-2">
						<DialogTitle className="text-2xl flex items-center gap-2">
							<Crown className="h-6 w-6 text-yellow-500" />
							{getTitle()}
						</DialogTitle>
					</div>
					<DialogDescription className="text-base">
						{getDescription()}
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6 py-4">
					{/* Pricing Cards */}
					<div className="grid grid-cols-2 gap-4">
						{/* Monthly Plan */}
						<button
							onClick={() => setSelectedPlan('monthly')}
							className={`border-2 rounded-lg p-4 hover:border-primary transition-all ${selectedPlan === 'monthly' ? 'border-primary bg-primary/5' : 'border-border'
								}`}
						>
							<div className="text-center">
								<p className="text-sm text-muted-foreground mb-1">Monthly</p>
								<p className="text-3xl font-bold">${PRICING.pro.monthly}</p>
								<p className="text-xs text-muted-foreground">per month</p>
							</div>
						</button>

						{/* Yearly Plan */}
						<button
							onClick={() => setSelectedPlan('yearly')}
							className={`border-2 rounded-lg p-4 relative hover:border-primary transition-all ${selectedPlan === 'yearly' ? 'border-primary bg-primary/5' : 'border-border'
								}`}
						>
							<Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary">
								Save 17%
							</Badge>
							<div className="text-center">
								<p className="text-sm text-muted-foreground mb-1">Yearly</p>
								<p className="text-3xl font-bold">${PRICING.pro.yearly}</p>
								<p className="text-xs text-muted-foreground">per year</p>
								<p className="text-xs text-primary mt-1">${(PRICING.pro.yearly / 12).toFixed(2)}/month</p>
							</div>
						</button>
					</div>

					{/* Benefits List */}
					<div className="space-y-2">
						<p className="font-semibold text-sm">Pro Features:</p>
						<ul className="space-y-2">
							{benefits.map((benefit, index) => (
								<li key={index} className="flex items-center gap-2 text-sm">
									<Check className="h-4 w-4 text-green-500 flex-shrink-0" />
									<span>{benefit}</span>
								</li>
							))}
						</ul>
					</div>

					{/* CTA Buttons */}
					<div className="flex flex-col gap-3">
						<Button onClick={handleUpgrade} size="lg" className="w-full" disabled={isLoading}>
							{isLoading ? (
								<>
									<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
									Processing...
								</>
							) : (
								<>
									<Crown className="mr-2 h-5 w-5" />
									Upgrade to Pro - ${selectedPlan === 'monthly' ? PRICING.pro.monthly : PRICING.pro.yearly}
									{selectedPlan === 'yearly' && '/year'}
									{selectedPlan === 'monthly' && '/month'}
								</>
							)}
						</Button>
						<Button onClick={closeModal} variant="outline" size="lg" className="w-full" disabled={isLoading}>
							Maybe Later
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
