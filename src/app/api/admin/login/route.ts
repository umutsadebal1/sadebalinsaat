import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, getAdminPassword, sessionToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { password } = await req.json().catch(() => ({ password: "" }));
  if (password !== getAdminPassword()) {
    return NextResponse.json({ error: "Hatalı şifre" }, { status: 401 });
  }
  const token = await sessionToken(password);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
