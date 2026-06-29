"use client";

import { createContext, useContext, useEffect, useState } from "react";

type WhatsAppCtx = {
  projectTitle: string | null;
  setProjectTitle: (title: string | null) => void;
};

const Ctx = createContext<WhatsAppCtx>({
  projectTitle: null,
  setProjectTitle: () => {},
});

export function WhatsAppProvider({ children }: { children: React.ReactNode }) {
  const [projectTitle, setProjectTitle] = useState<string | null>(null);
  return (
    <Ctx.Provider value={{ projectTitle, setProjectTitle }}>{children}</Ctx.Provider>
  );
}

export function useWhatsApp() {
  return useContext(Ctx);
}

/**
 * Rendered by the project detail page so the floating WhatsApp button can
 * include the project name in its prefilled message. Clears on unmount.
 */
export function SetWhatsAppProject({ title }: { title: string }) {
  const { setProjectTitle } = useWhatsApp();
  useEffect(() => {
    setProjectTitle(title);
    return () => setProjectTitle(null);
  }, [title, setProjectTitle]);
  return null;
}
