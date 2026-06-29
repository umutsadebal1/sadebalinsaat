"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "/", label: "Anasayfa" },
  { href: "/portfoy", label: "Portföy" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
];

// Two links on each side of the centered logo.
const LEFT_LINKS = LINKS.slice(0, 2);
const RIGHT_LINKS = LINKS.slice(2);

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function NavLink({ href, label }: { href: string; label: string }) {
    const active = pathname === href;
    return (
      <li className="relative">
        <Link
          href={href}
          className={`pb-1 transition-colors duration-300 ${
            active ? "text-gold-700" : "text-ink-soft hover:text-ink"
          }`}
        >
          {label}
        </Link>
        {active && <span className="absolute -bottom-0.5 left-0 h-px w-full bg-gold-600" />}
      </li>
    );
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "border-b border-line bg-bg/85 backdrop-blur-md py-2"
          : "border-b border-transparent bg-transparent py-4"
      }`}
    >
      <nav className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-5 md:px-8">
        {/* Left links (desktop) */}
        <ul className="col-start-1 hidden items-center gap-7 justify-self-start font-mono-label text-[12px] uppercase tracking-[0.12em] md:flex">
          {LEFT_LINKS.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </ul>

        {/* Centered logo */}
        <Link
          href="/"
          className="group col-start-2 flex items-center gap-2.5 justify-self-center"
          aria-label="Sadebal Yapı anasayfa"
        >
          <Image
            src="/images/logo.png"
            alt="Sadebal Yapı logosu"
            width={44}
            height={43}
            className={`transition-all duration-500 ${scrolled ? "h-9 w-auto" : "h-11 w-auto"}`}
            priority
          />
          <span className="hidden font-display text-[15px] tracking-wide text-ink sm:inline">
            Sadebal <span className="text-gold-700">Yapı</span>
          </span>
        </Link>

        {/* Right links (desktop) + hamburger (mobile) */}
        <div className="col-start-3 flex items-center justify-end gap-7 justify-self-end">
          <ul className="hidden items-center gap-7 font-mono-label text-[12px] uppercase tracking-[0.12em] md:flex">
            {RIGHT_LINKS.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
          </ul>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={open}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink md:hidden"
          >
            {open ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${
          open ? "max-h-80" : "max-h-0"
        }`}
      >
        <ul className="flex flex-col gap-1 px-5 pb-6 pt-2 font-mono-label text-sm uppercase tracking-[0.1em]">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block rounded-md px-3 py-3 transition-colors ${
                    active ? "bg-bg-elevated text-gold-700" : "text-ink-soft hover:bg-bg-elevated hover:text-ink"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}
