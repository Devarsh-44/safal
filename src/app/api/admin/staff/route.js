import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET() {
  if (!url || !serviceKey) {
    return NextResponse.json({ configured: false, users: [] });
  }
  try {
    const supabaseAdmin = createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    const users = (data?.users || []).map((u) => ({
      id: u.id,
      email: u.email,
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at,
    }));
    return NextResponse.json({ configured: true, users });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  if (!url || !serviceKey) {
    return NextResponse.json({
      error: 'Please add SUPABASE_SERVICE_ROLE_KEY to your .env.local to enable creating accounts directly from this dashboard.'
    }, { status: 400 });
  }
  try {
    const { email, password, action } = await request.json();
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
    }

    const supabaseAdmin = createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    if (action === 'invite') {
      const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, message: `Invite email sent to ${email}!` });
    } else {
      if (!password || password.length < 6) {
        return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
      }
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, user: data.user });
    }
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
