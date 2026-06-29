import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import PageTransition from "@/components/PageTransition";
import FloatingThemeToggle from "@/components/FloatingThemeToggle";
import WhatsAppButton from "@/components/WhatsAppButton";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { WhatsAppProvider } from "@/components/WhatsAppContext";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <WhatsAppProvider>
      <ScrollProgress />
      <Navbar />
      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <FloatingThemeToggle />
      <LanguageSwitcher />
      <WhatsAppButton />
    </WhatsAppProvider>
  );
}
