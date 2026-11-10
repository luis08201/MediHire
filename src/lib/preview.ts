import { cookies } from "next/headers";
import { PREVIEW_COOKIE, previewSecret, readToken } from "./auth";

export async function isPreview() {
  const jar = await cookies();
  return readToken(jar.get(PREVIEW_COOKIE)?.value, "preview", previewSecret());
}
