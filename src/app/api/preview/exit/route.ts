import { NextResponse } from "next/server";
import { PREVIEW_COOKIE } from "@/lib/auth";

export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL("/", request.url));
  response.cookies.delete(PREVIEW_COOKIE);
  return response;
}
