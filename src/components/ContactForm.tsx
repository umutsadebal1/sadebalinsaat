"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    // NOTE: wire this up to a real endpoint (e.g. an API route that
    // sends email via Resend/Nodemailer) before going live.
    setTimeout(() => setStatus("sent"), 900);
  }

  if (status === "sent") {
    return (
      <div className="rounded-sm border border-gold-600/40 bg-gold-200/20 p-6">
        <p className="font-display text-lg text-ink mb-1">Mesajınız alındı.</p>
        <p className="text-sm text-ink-soft">
          En kısa sürede sizinle iletişime geçeceğiz.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Ad Soyad" name="name" required />
        <Field label="Telefon" name="phone" type="tel" required />
      </div>
      <Field label="E-posta" name="email" type="email" required />
      <Field label="Konu" name="subject" />
      <div>
        <label
          htmlFor="message"
          className="block font-mono-label text-[11px] uppercase tracking-[0.1em] text-ink-soft mb-2"
        >
          Mesajınız
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="w-full rounded-sm border border-line bg-bg-card px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-gold-600"
        />
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="group inline-flex w-fit items-center gap-2 rounded-full bg-gold-600 px-6 py-3 text-sm font-medium text-petrol-900 transition-all duration-300 hover:bg-gold-400 disabled:opacity-60"
      >
        {status === "sending" ? "Gönderiliyor..." : "Mesajı Gönder"}
        <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block font-mono-label text-[11px] uppercase tracking-[0.1em] text-ink-soft mb-2"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full rounded-sm border border-line bg-bg-card px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-gold-600"
      />
    </div>
  );
}
