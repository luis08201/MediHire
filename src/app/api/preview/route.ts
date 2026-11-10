import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { PREVIEW_COOKIE, cookieSecure, issueToken, previewSecret } from "@/lib/auth";

function matches(input: string, secret: string) {
  const left = createHash("sha256").update(input).digest();
  const right = createHash("sha256").update(secret).digest();
  return timingSafeEqual(left, right);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret") ?? "";
  const path = url.searchParams.get("path") ?? "/";
  const expected = previewSecret();
  if (!expected || !matches(secret, expected)) {
    return new Response("Preview secret was not accepted.", { status: 401 });
  }
  if (!path.startsWith("/") || path.startsWith("//")) {
    return new Response("Choose a path on this site.", { status: 400 });
  }
  const token = await issueToken("preview", expected, 60 * 60 * 8);
  const response = NextResponse.redirect(new URL(path, url.origin));
  response.cookies.set(PREVIEW_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: cookieSecure(),
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return response;
}
