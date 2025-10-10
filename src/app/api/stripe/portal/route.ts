import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const { locale } = await request.json();
    console.log('Portal request received with locale:', locale);

    // Get user from Supabase auth
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log('User authenticated:', user?.id);

    if (!user) {
      console.error('No user found');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user profile with Stripe customer ID
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('stripe_customer_id, tier')
      .eq('id', user.id)
      .single();

    console.log('User profile:', { stripe_customer_id: profile?.stripe_customer_id, tier: profile?.tier });

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return NextResponse.json(
        { error: 'Failed to fetch profile' },
        { status: 500 }
      );
    }

    if (!profile?.stripe_customer_id) {
      console.error('No Stripe customer ID found for user:', user.id);
      return NextResponse.json(
        { error: 'No subscription found. Please upgrade to Pro first.' },
        { status: 400 }
      );
    }

    console.log('Creating Stripe portal session for customer:', profile.stripe_customer_id);

    // Validate and map locale (Stripe supports: en, es, sv, and many more)
    const supportedLocales = ['en', 'es', 'sv'];
    const stripeLocale = locale && supportedLocales.includes(locale) ? locale : 'en';

    // Create Stripe billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`,
      locale: stripeLocale as 'en' | 'es' | 'sv',
    });

    console.log('Portal session created:', session.id);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe portal error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage, details: error },
      { status: 500 }
    );
  }
}
