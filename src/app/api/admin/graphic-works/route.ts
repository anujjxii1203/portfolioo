import { NextResponse } from "next/server";
import { isLocalDev, isAuthenticated } from "@/lib/adminAuth";
import { readServerGraphicWorks, writeServerContentFile } from "@/lib/contentServer";

export async function GET() {
  if (!isLocalDev()) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const list = readServerGraphicWorks();
    return NextResponse.json(list);
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
    const list = await req.json();
    writeServerContentFile("graphic-works.json", list);
    return NextResponse.json({ success: true, count: list.length });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
