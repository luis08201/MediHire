const encoder = new TextEncoder();

function toHex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function toBase64Url(value: string) {
  const bytes = encoder.encode(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function fromBase64Url(value: string) {
  const padded = value.replaceAll("-", "+").replaceAll("_", "/") + "===".slice((value.length + 3) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

async function hmac(secret: string, value: string) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return toHex(signature);
}

function safeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return mismatch === 0;
}

export const EDITOR_COOKIE = "mh_editor";
export const PREVIEW_COOKIE = "mh_preview";

export async function issueToken(kind: "editor" | "preview", secret: string, ttlSeconds: number) {
  const payload = `${kind}|${Date.now() + ttlSeconds * 1000}`;
  const body = toBase64Url(payload);
  const signature = await hmac(secret, body);
  return `${body}.${signature}`;
}

export async function readToken(token: string | undefined, kind: "editor" | "preview", secret: string | undefined) {
  if (!token || !secret) return false;
  const [body, signature] = token.split(".");
  if (!body || !signature) return false;
  const expected = await hmac(secret, body);
  if (!safeEqual(signature, expected)) return false;
  const payload = fromBase64Url(body);
  const [tokenKind, expiry] = payload.split("|");
  if (tokenKind !== kind) return false;
  return Number(expiry) > Date.now();
}

export function editorSecret() {
  return process.env.CMS_EDITOR_PASSWORD || "";
}

export function previewSecret() {
  return process.env.CMS_PREVIEW_SECRET || "";
}

export function cookieSecure() {
  return siteIsHttps();
}

function siteIsHttps() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "").startsWith("https://");
}
