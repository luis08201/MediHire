import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { EDITOR_COOKIE, editorSecret, readToken } from "./lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const allowed = await readToken(request.cookies.get(EDITOR_COOKIE)?.value, "editor", editorSecret());
    if (!allowed) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  const response = NextResponse.next();
  const blockIndex =
    process.env.SITE_INDEXING !== "live" ||
    pathname.startsWith("/search") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/preview");
  if (blockIndex) response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|media/|icon.svg).*)"],
};
