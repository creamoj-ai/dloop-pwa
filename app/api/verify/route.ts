import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Missing verification token' },
        { status: 400 }
      );
    }

    // Find dealer by token
    const { data: dealer, error: fetchError } = await supabase
      .from('dealers')
      .select('id, email, verification_token_expires_at')
      .eq('verification_token', token)
      .single();

    if (fetchError || !dealer) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (new Date(dealer.verification_token_expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Verification token has expired' },
        { status: 400 }
      );
    }

    // Update dealer status
    const { error: updateError } = await supabase
      .from('dealers')
      .update({
        email_verified: true,
        email_verified_at: new Date().toISOString(),
        status: 'active',
        verification_token: null,
        verification_token_expires_at: null,
      })
      .eq('id', dealer.id);

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to verify email' },
        { status: 500 }
      );
    }

    // Redirect to dashboard
    return NextResponse.redirect(new URL('/dealer/dashboard', request.url));
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
