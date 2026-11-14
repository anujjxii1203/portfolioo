import { NextResponse } from "next/server";
import { isLocalDev, ADMIN_COOKIE_NAME } from "@/lib/adminAuth";

export async function POST(req: Request) {
  if (!isLocalDev()) {
    return new NextResponse("Not Found", { status: 404 });
  }

  try {
    const { password } = await req.json();
    const expectedPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (password === expectedPassword) {
      const res = NextResponse.json({ success: true });
      res.cookies.set(ADMIN_COOKIE_NAME, expectedPassword, {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      return res;
    }

    return NextResponse.json(
      { error: "Incorrect password. Please verify your ADMIN_PASSWORD in .env.local" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

