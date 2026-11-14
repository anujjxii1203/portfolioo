import { NextResponse } from "next/server";
import { isLocalDev, isAuthenticated } from "@/lib/adminAuth";
import { readServerSiteContent, writeServerContentFile } from "@/lib/contentServer";

export async function GET() {
  if (!isLocalDev()) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = readServerSiteContent();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!isLocalDev()) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    writeServerContentFile("site.json", body);
    return NextResponse.json({ success: true, data: body });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
