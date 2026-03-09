import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;
const COOKIE = process.env.JWT_COOKIE_NAME_STUDENT || 'student_token';

/**
 * GET /api/student-auth/profile
 * Proxy to backend /api/students/me with populate support
 * 
 * Query params:
 * - populate: comma-separated list of relations to populate (e.g., section,art_group,grade)
 */
export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIE)?.value;
  if (!token) return NextResponse.json({ message: 'No auth' }, { status: 401 });

  // Forward populate params to backend
  const populate = req.nextUrl.searchParams.get('populate') || 'section,art_group,grade';
  
  const backendUrl = new URL(`${API_URL}/api/students/me`);
  backendUrl.searchParams.set('populate', populate);

  const r = await fetch(backendUrl.toString(), {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  
  const data = await r.json();
  if (!r.ok) {
    return NextResponse.json(
      { message: data?.error?.message || 'Error fetching student profile' }, 
      { status: r.status }
    );
  }
  
  return NextResponse.json(data);
}
