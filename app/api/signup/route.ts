import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      business_name,
      owner_name,
      email,
      phone,
      category,
      address,
      city,
      postal_code,
    } = body;

    // Validation
    if (!business_name || !owner_name || !email || !phone || !category || !address) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const { data: existing } = await supabase
      .from('dealers')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Generate verification token
    const verification_token = crypto.randomBytes(32).toString('hex');
    const verification_token_expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    // Create dealer
    const { data: dealer, error: dbError } = await supabase
      .from('dealers')
      .insert({
        business_name,
        owner_name,
        email,
        phone,
        category,
        address,
        city: city || 'Napoli',
        postal_code,
        status: 'pending',
        verification_token,
        verification_token_expires_at,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to create dealer account' },
        { status: 500 }
      );
    }

    // TODO: Send verification email (via SendGrid/Resend)
    // For now, log the token
    console.log(`[DEALER SIGNUP] Email: ${email}, Token: ${verification_token}`);

    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful! Check your email to verify your account.',
        dealer_id: dealer.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
