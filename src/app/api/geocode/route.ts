// src/app/api/geocode/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { address } = await req.json();
  if (!address) {
    return NextResponse.json({ error: "Missing address" }, { status: 400 });
  }

  // sanitize + strip unit numbers
  const parts = address
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  let street = parts[0].split(" ");
  if (street.length > 2 && /^\d+$/.test(street[street.length - 1])) {
    street.pop();
  }
  parts[0] = street.join(" ");

  // rejoin + country hint
  const sanitized = parts.join(", ") + ", USA";

  // call Google
  const key = process.env.GOOGLE_MAPS_API_KEY!;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?` +
              `address=${encodeURIComponent(sanitized)}` +
              `&region=us&key=${key}`;

  const geoRes = await fetch(url);
  const data = await geoRes.json();

  const loc = data.results?.[0]?.geometry.location;
  if (!loc) {
    return NextResponse.json({ error: "No results" }, { status: 404 });
  }

  return NextResponse.json({ lat: loc.lat, lng: loc.lng });
}

// (optional) sanity‑check GET
export function GET() {
  return NextResponse.json({ ok: true });
}
