import { NextResponse } from "next/server";
import { isLocalDev, ADMIN_COOKIE_NAME } from "@/lib/adminAuth";

export async function POST() {
  if (!isLocalDev()) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return res;
}

