import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;
const COOKIE_NAME = process.env.JWT_COOKIE_NAME || 'parent_token';

/**
 * GET /api/auth/profile
 * Proxy to backend /api/parents/me with populate support
 * 
 * Query params:
 * - populate: comma-separated list of relations to populate 
 *   (e.g., students.section,students.art_group)
 */
export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ message: 'No auth' }, { status: 401 });

  // Forward populate params to backend
  const populate = req.nextUrl.searchParams.get('populate') || 'students.section,students.art_group';
  
  const backendUrl = new URL(`${API_URL}/api/parents/me`);
  backendUrl.searchParams.set('populate', populate);

  const r = await fetch(backendUrl.toString(), {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  const data = await r.json();
  if (!r.ok) {
    return NextResponse.json(
      { message: data?.error?.message || 'Error fetching parent profile' }, 
      { status: r.status }
    );
  }
  
  return NextResponse.json(data);
}
