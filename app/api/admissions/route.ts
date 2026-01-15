import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json(); // { payload: {...} }
    if (!body || typeof body.payload !== "object") {
      console.error("Invalid payload received:", body);
      return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
    }

    const STRAPI_URL = process.env.STRAPI_URL || process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!STRAPI_URL) {
      console.error("Missing STRAPI_URL environment variable in .env file");
      return NextResponse.json({ ok: false, error: "Server configuration error: Missing Strapi URL" }, { status: 500 });
    }

    console.log("→ Submitting to:", `${STRAPI_URL}/api/admissions-submissions`);
    console.log("ℹ️ Using public permissions (no authentication required)");

    // No authentication needed - using Strapi public permissions
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const res = await fetch(`${STRAPI_URL}/api/admissions-submissions`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        data: {
          payload: body.payload,
        },
      }),
    });

    const json = await res.json();
    
    if (!res.ok) {
      console.error("❌ Strapi error response:", {
        status: res.status,
        statusText: res.statusText,
        body: json,
        url: `${STRAPI_URL}/api/admissions-submissions`,
      });
      
      if (res.status === 401 || res.status === 403) {
        console.error("   → Permission denied.");
        console.error("      Please verify in Strapi Dashboard:");
        console.error("      Settings → Users & Permissions → Roles → Public");
        console.error("      → Admissions-submission → Enable 'create' permission ✓");
      }
      
      return NextResponse.json({ 
        ok: false, 
        error: json,
        message: json?.error?.message || "Failed to submit to Strapi"
      }, { status: res.status });
    }

    console.log("✓ Successfully submitted to Strapi");
    return NextResponse.json({ ok: true, data: json.data });
  } catch (err) {
    console.error("Unexpected error in admissions API:", err);
    return NextResponse.json({ ok: false, error: "Server error", details: String(err) }, { status: 500 });
  }
}
