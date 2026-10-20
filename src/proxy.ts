import { NextResponse, type NextRequest } from "next/server";

// Simple password gate for shared previews. Active as soon as DEMO_PASSWORD is set. In production
// without a password nobody gets in; locally without a password the gate stays off.
const COOKIE = "klickdummy_zugang";
const FIELD = "passwort";
const STATE = "zugang";

async function digest(value: string): Promise<string> {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`klickdummy:${value}`));
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function same(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// Back to the page the form was sent from. Behind the hosting proxy the app only sees http,
// so the protocol comes from the forwarded header.
function back(request: NextRequest, failed: boolean): NextResponse {
  const url = request.nextUrl.clone();
  url.searchParams.delete(STATE);
  if (failed) url.searchParams.set(STATE, "falsch");
  const proto = request.headers.get("x-forwarded-proto")?.split(",")[0].trim();
  if (proto === "https" || proto === "http") url.protocol = `${proto}:`;
  return NextResponse.redirect(url, 303);
}

export async function proxy(request: NextRequest) {
  const password = process.env.DEMO_PASSWORD;
  if (!password) {
    if (process.env.NODE_ENV !== "production") return NextResponse.next();
    return NextResponse.rewrite(new URL("/zugang/fehlt", request.url));
  }

  const expected = await digest(password);
  if (same(request.cookies.get(COOKIE)?.value ?? "", expected)) return NextResponse.next();

  if (request.method === "POST") {
    const form = await request.formData().catch(() => null);
    const given = form?.get(FIELD);
    if (typeof given === "string" && same(await digest(given), expected)) {
      const response = back(request, false);
      response.cookies.set(COOKIE, expected, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
      return response;
    }
    return back(request, true);
  }

  // The address stays as it is, so the form sends the password straight back to this page.
  const page = request.nextUrl.searchParams.get(STATE) === "falsch" ? "/zugang/falsch" : "/zugang";
  return NextResponse.rewrite(new URL(page, request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|icon.svg|favicon.ico|robots.txt).*)"],
};
