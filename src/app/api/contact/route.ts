import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { readSite } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const email = String(body.email ?? "").trim();
  const subject = String(body.subject ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!name || !phone || !message) {
    return NextResponse.json(
      { error: "Ad, telefon ve mesaj zorunludur." },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO || readSite().email;

  // No key configured yet → don't break the visitor UX; log so the owner
  // knows to add RESEND_API_KEY. (delivered:false signals it wasn't emailed.)
  if (!apiKey) {
    console.warn("[contact] RESEND_API_KEY tanımlı değil — mesaj e-postayla gönderilemedi.", {
      name,
      phone,
    });
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const resend = new Resend(apiKey);
    const from = process.env.CONTACT_FROM || "Sadebal Yapı <onboarding@resend.dev>";
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email || undefined,
      subject: `Yeni İletişim Talebi${subject ? " — " + subject : ""}`,
      text:
        `Ad Soyad: ${name}\n` +
        `Telefon: ${phone}\n` +
        `E-posta: ${email || "-"}\n` +
        `Konu: ${subject || "-"}\n\n` +
        `Mesaj:\n${message}\n`,
    });
    if (error) {
      console.error("[contact] Resend hatası:", error);
      return NextResponse.json({ ok: true, delivered: false });
    }
    return NextResponse.json({ ok: true, delivered: true });
  } catch (e) {
    console.error("[contact] gönderim hatası:", e);
    return NextResponse.json({ ok: true, delivered: false });
  }
}
