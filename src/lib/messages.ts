import type { Locale } from "./i18n";
import { DEFAULT_LOCALE } from "./i18n";

/**
 * UI string dictionary. Content (project descriptions etc.) stays in Turkish
 * for now; only interface strings are translated. AR/KU çevirileri gözden
 * geçirilebilir.
 */
type Dict = Record<string, string>;

const tr: Dict = {
  "nav.home": "Anasayfa",
  "nav.portfolio": "Portföy",
  "nav.about": "Hakkımızda",
  "nav.contact": "İletişim",

  "footer.blurb":
    "Konut ve ticari projelerde sağlam mühendislik, zamansız mimari anlayışıyla geleceğin yapılarını inşa ediyoruz.",
  "footer.explore": "Keşfet",
  "footer.contact": "İletişim",
  "footer.social": "Sosyal",
  "footer.rights": "Tüm hakları saklıdır.",
  "footer.tagline": "Sadelikte güç, kalitede iz.",

  "hero.eyebrowSuffix": "İnşaat & Gayrimenkul",
  "hero.subtitle":
    "Konut ve ticari projelerde güvenilir mühendislik, zamansız mimari anlayışıyla geleceğin yapılarını bugünden inşa ediyoruz.",
  "hero.cta1": "Projelerimizi Görün",
  "hero.cta2": "Bize Ulaşın",
  "hero.title": "Sadelikte güç, kalitede iz bırakan yapılar.",

  "intro.button": "Hayallerinizi Gerçeğe Dönüştürün",
  "intro.hint": "Tıklayın · Tanıtımı izleyin",
  "intro.loading": "Tanıtım hazırlanıyor…",

  "home.featured.one": "Devam Eden Proje",
  "home.featured.many": "Projelerimiz",
  "home.featured.heading": "Devam eden ve tamamlanan işlerimizden bir kesit",
  "home.allPortfolio": "Tüm Portföy",
  "home.viewGallery": "Proje Galerisini Görün",
  "home.why.label": "Neden Sadebal Yapı",
  "home.why.heading": "Her projede aynı titizlik, her teslimde aynı güven.",
  "home.cta.eyebrow": "Projenizi Birlikte Hayata Geçirelim",
  "home.cta.heading": "Hayalinizdeki yapı, sağlam bir temelle başlar.",
  "home.cta.button": "Hemen İletişime Geçin",
  "home.testimonials.label": "Referanslar",
};

const en: Dict = {
  "nav.home": "Home",
  "nav.portfolio": "Portfolio",
  "nav.about": "About",
  "nav.contact": "Contact",

  "footer.blurb":
    "With solid engineering and a timeless architectural vision, we build the structures of the future in residential and commercial projects.",
  "footer.explore": "Explore",
  "footer.contact": "Contact",
  "footer.social": "Social",
  "footer.rights": "All rights reserved.",
  "footer.tagline": "Strength in simplicity, a mark in quality.",

  "hero.eyebrowSuffix": "Construction & Real Estate",
  "hero.subtitle":
    "With reliable engineering and a timeless architectural vision, we build the structures of the future today in residential and commercial projects.",
  "hero.cta1": "See Our Projects",
  "hero.cta2": "Contact Us",
  "hero.title": "Structures that leave a mark — strength in simplicity, quality in detail.",

  "intro.button": "Turn Your Dreams Into Reality",
  "intro.hint": "Click · Watch the intro",
  "intro.loading": "Preparing the intro…",

  "home.featured.one": "Ongoing Project",
  "home.featured.many": "Our Projects",
  "home.featured.heading": "A glimpse of our ongoing and completed work",
  "home.allPortfolio": "All Portfolio",
  "home.viewGallery": "View Project Gallery",
  "home.why.label": "Why Sadebal Yapı",
  "home.why.heading": "The same diligence in every project, the same trust in every delivery.",
  "home.cta.eyebrow": "Let's Bring Your Project to Life Together",
  "home.cta.heading": "The building of your dreams starts with a solid foundation.",
  "home.cta.button": "Get in Touch Now",
  "home.testimonials.label": "Testimonials",
};

const ar: Dict = {
  "nav.home": "الرئيسية",
  "nav.portfolio": "المشاريع",
  "nav.about": "من نحن",
  "nav.contact": "اتصل بنا",

  "footer.blurb":
    "بهندسة متينة ورؤية معمارية خالدة، نبني مبانيَ المستقبل في المشاريع السكنية والتجارية.",
  "footer.explore": "استكشف",
  "footer.contact": "تواصل",
  "footer.social": "تابعنا",
  "footer.rights": "جميع الحقوق محفوظة.",
  "footer.tagline": "القوة في البساطة، وأثرٌ في الجودة.",

  "hero.eyebrowSuffix": "الإنشاء والعقارات",
  "hero.subtitle":
    "بهندسة موثوقة ورؤية معمارية خالدة، نبني اليوم مبانيَ المستقبل في المشاريع السكنية والتجارية.",
  "hero.cta1": "شاهد مشاريعنا",
  "hero.cta2": "تواصل معنا",
  "hero.title": "مبانٍ تترك أثرًا — قوة في البساطة وجودة في التفاصيل.",

  "intro.button": "حوّل أحلامك إلى واقع",
  "intro.hint": "انقر · شاهد العرض التقديمي",
  "intro.loading": "جارٍ تحضير العرض…",

  "home.featured.one": "مشروع قيد الإنشاء",
  "home.featured.many": "مشاريعنا",
  "home.featured.heading": "لمحة من أعمالنا الجارية والمنجزة",
  "home.allPortfolio": "كل المشاريع",
  "home.viewGallery": "عرض معرض المشروع",
  "home.why.label": "لماذا صدبال يapı",
  "home.why.heading": "نفس الدقة في كل مشروع، ونفس الثقة في كل تسليم.",
  "home.cta.eyebrow": "لنحقّق مشروعك معًا",
  "home.cta.heading": "المبنى الذي تحلم به يبدأ بأساسٍ متين.",
  "home.cta.button": "تواصل معنا الآن",
  "home.testimonials.label": "آراء العملاء",
};

const ku: Dict = {
  "nav.home": "Destpêk",
  "nav.portfolio": "Portfolyo",
  "nav.about": "Derbarê me",
  "nav.contact": "Têkilî",

  "footer.blurb":
    "Bi endezyariyeke xurt û têgihiştineke mîmariya bêdem, em avahiyên paşerojê di projeyên niştecî û bazirganî de ava dikin.",
  "footer.explore": "Vekole",
  "footer.contact": "Têkilî",
  "footer.social": "Civakî",
  "footer.rights": "Hemû maf parastî ne.",
  "footer.tagline": "Hêz di sadebûnê de, şop di kalîteyê de.",

  "hero.eyebrowSuffix": "Avahîsazî & Xanî",
  "hero.subtitle":
    "Bi endezyariyeke pêbawer û têgihiştineke mîmariya bêdem, em îro avahiyên paşerojê di projeyên niştecî û bazirganî de ava dikin.",
  "hero.cta1": "Projeyên me bibînin",
  "hero.cta2": "Bi me re têkilî daynin",
  "hero.title": "Avahiyên ku şop dihêlin — hêz di sadebûnê de, kalîte di hûrgiliyê de.",

  "intro.button": "Xewnên xwe bikin rastî",
  "intro.hint": "Bitikîne · Pêşandanê temaşe bike",
  "intro.loading": "Pêşandan tê amadekirin…",

  "home.featured.one": "Projeya Domdar",
  "home.featured.many": "Projeyên me",
  "home.featured.heading": "Nêrînek ji karên me yên domdar û qedandî",
  "home.allPortfolio": "Hemû Portfolyo",
  "home.viewGallery": "Galeriya projeyê bibînin",
  "home.why.label": "Çima Sadebal Yapî",
  "home.why.heading": "Di her projeyê de heman baldarî, di her radestkirinê de heman ewlehî.",
  "home.cta.eyebrow": "Werin em projeya we bi hev re pêk bînin",
  "home.cta.heading": "Avahiya xewnên we bi bingehek xurt dest pê dike.",
  "home.cta.button": "Niha bi me re têkilî daynin",
  "home.testimonials.label": "Referans",
};

export const MESSAGES: Record<Locale, Dict> = { tr, en, ar, ku };

export function translate(locale: Locale, key: string): string {
  return MESSAGES[locale]?.[key] ?? MESSAGES[DEFAULT_LOCALE][key] ?? key;
}
