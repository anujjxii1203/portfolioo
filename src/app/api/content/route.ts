import { NextResponse } from "next/server";
import {
  readServerSiteContent,
  readServerWebProjects,
  readServerGraphicWorks,
} from "@/lib/contentServer";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  if (type === "web") {
    return NextResponse.json(readServerWebProjects());
  }
  if (type === "graphic") {
    return NextResponse.json(readServerGraphicWorks());
  }
  return NextResponse.json(readServerSiteContent());
}
