import type { Locale } from "./i18n";
import { DEFAULT_LOCALE } from "./i18n";

/**
 * UI string dictionary. Long-form content (project descriptions, FAQ answers,
 * about-page paragraphs) stays in Turkish for now; interface strings are
 * translated. AR/KU çevirileri gözden geçirilebilir.
 */
type Dict = Record<string, string>;

const tr: Dict = {
  "nav.home": "Anasayfa",
  "nav.portfolio": "Portföy",
  "nav.about": "Hakkımızda",
  "nav.contact": "İletişim",

  "common.render3d": "3D Görselleştirme",
  "status.ongoing": "Devam Eden",
  "status.completed": "Tamamlandı",
  "filter.all": "Tümü",
  "delivery.delivered": "Teslim",
  "delivery.target": "Hedeflenen Teslim",

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

  "value.engineering.title": "Güvenilir Mühendislik",
  "value.engineering.text": "Her proje, statik hesaptan teslimata kadar titiz bir mühendislik disipliniyle yürütülür.",
  "value.architecture.title": "Zamansız Mimari",
  "value.architecture.text": "Trendlere değil, yıllar geçse de değerini koruyan tasarım ilkelerine göre inşa ederiz.",
  "value.delivery.title": "Zamanında Teslim",
  "value.delivery.text": "Net bir takvim, şeffaf bir süreç: söz verdiğimiz tarihte anahtarı teslim ederiz.",
  "value.detail.title": "Detayda Özen",
  "value.detail.text": "Cepheden iç mekâna, her detay aynı titizlikle planlanır ve uygulanır.",

  "portfolio.heading": "Projelerimiz",
  "portfolio.intro":
    "Devam eden ve tamamlanan projelerimizi aşağıda bulabilirsiniz. Bir projeye tıklayarak galerisini ve konumunu görüntüleyebilirsiniz.",
  "portfolio.allProjects": "Tüm Projeler",
  "portfolio.viewProject": "Projeyi Gör",
  "portfolio.empty": "Bu kategoride henüz proje yok.",

  "detail.constructionTitle": "Şantiyeden Kareler",
  "detail.floorPlans": "Kat Planları",
  "detail.gallery": "Proje Galerisi",
  "detail.location": "Konum",
  "detail.ctaHeading": "Bu projeyi yakından tanımak ister misiniz?",
  "detail.contactUs": "Bize Ulaşın",
  "detail.otherProjects": "Diğer Projeler",
  "detail.start3d": "3D Bina Turunu Başlat",
  "construction.live": "Canlı Şantiye Durumu",
  "floorplan.unitTypeSuffix": "Daire Tipi",
  "map.pending": "Konum bilgisi yakında eklenecek",

  "form.name": "Ad Soyad",
  "form.phone": "Telefon",
  "form.email": "E-posta",
  "form.subject": "Konu",
  "form.message": "Mesajınız",
  "form.send": "Mesajı Gönder",
  "form.sending": "Gönderiliyor...",
  "form.sentTitle": "Mesajınız alındı.",
  "form.sentBody": "En kısa sürede sizinle iletişime geçeceğiz.",
  "form.error": "Mesaj gönderilemedi. Lütfen tekrar deneyin veya bizi arayın.",

  "contact.heading": "Projenizi konuşalım",
  "contact.intro":
    "Sorularınız için formu doldurun veya doğrudan bizi arayın, en kısa sürede dönüş yapalım.",
  "contact.address": "Adres",
  "contact.hours": "Çalışma Saatleri",
  "contact.mapPlaceholder": "Harita alanı — özel kurulum bekleniyor",
  "contact.faqLabel": "Sıkça Sorulan Sorular",
  "contact.faqHeading": "Aklınızdaki sorulara yanıtlar",

  "about.heading": "Sadelikte güç, kalitede iz bırakan bir anlayış",
  "about.approachLabel": "Yaklaşımımız",
  "about.founderLabel": "Kurucumuz",
  "about.mission": "Misyonumuz",
  "about.vision": "Vizyonumuz",
  "about.values": "Değerlerimiz",
};

const en: Dict = {
  "nav.home": "Home",
  "nav.portfolio": "Portfolio",
  "nav.about": "About",
  "nav.contact": "Contact",

  "common.render3d": "3D Visualization",
  "status.ongoing": "Ongoing",
  "status.completed": "Completed",
  "filter.all": "All",
  "delivery.delivered": "Delivered",
  "delivery.target": "Target Delivery",

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

  "value.engineering.title": "Reliable Engineering",
  "value.engineering.text": "Every project is carried out with rigorous engineering discipline, from structural calculation to delivery.",
  "value.architecture.title": "Timeless Architecture",
  "value.architecture.text": "We build by design principles that hold their value over the years — not by passing trends.",
  "value.delivery.title": "On-Time Delivery",
  "value.delivery.text": "A clear schedule and a transparent process: we hand over the keys on the promised date.",
  "value.detail.title": "Care in Detail",
  "value.detail.text": "From the facade to the interior, every detail is planned and executed with the same care.",

  "portfolio.heading": "Our Projects",
  "portfolio.intro":
    "You can find our ongoing and completed projects below. Click a project to view its gallery and location.",
  "portfolio.allProjects": "All Projects",
  "portfolio.viewProject": "View Project",
  "portfolio.empty": "No projects in this category yet.",

  "detail.constructionTitle": "From the Site",
  "detail.floorPlans": "Floor Plans",
  "detail.gallery": "Project Gallery",
  "detail.location": "Location",
  "detail.ctaHeading": "Want to get to know this project up close?",
  "detail.contactUs": "Contact Us",
  "detail.otherProjects": "Other Projects",
  "detail.start3d": "Start 3D Building Tour",
  "construction.live": "Live Site Status",
  "floorplan.unitTypeSuffix": "Unit Type",
  "map.pending": "Location info coming soon",

  "form.name": "Full Name",
  "form.phone": "Phone",
  "form.email": "Email",
  "form.subject": "Subject",
  "form.message": "Your Message",
  "form.send": "Send Message",
  "form.sending": "Sending...",
  "form.sentTitle": "Your message has been received.",
  "form.sentBody": "We'll get back to you as soon as possible.",
  "form.error": "Could not send the message. Please try again or call us.",

  "contact.heading": "Let's talk about your project",
  "contact.intro":
    "Fill out the form with your questions or call us directly — we'll get back to you as soon as possible.",
  "contact.address": "Address",
  "contact.hours": "Working Hours",
  "contact.mapPlaceholder": "Map area — custom setup pending",
  "contact.faqLabel": "Frequently Asked Questions",
  "contact.faqHeading": "Answers to your questions",

  "about.heading": "Strength in simplicity, an approach that leaves a mark in quality",
  "about.approachLabel": "Our Approach",
  "about.founderLabel": "Our Founder",
  "about.mission": "Our Mission",
  "about.vision": "Our Vision",
  "about.values": "Our Values",
};

const ar: Dict = {
  "nav.home": "الرئيسية",
  "nav.portfolio": "المشاريع",
  "nav.about": "من نحن",
  "nav.contact": "اتصل بنا",

  "common.render3d": "تصوير ثلاثي الأبعاد",
  "status.ongoing": "قيد الإنشاء",
  "status.completed": "مكتمل",
  "filter.all": "الكل",
  "delivery.delivered": "التسليم",
  "delivery.target": "التسليم المستهدف",

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

  "value.engineering.title": "هندسة موثوقة",
  "value.engineering.text": "يُنفَّذ كل مشروع بانضباط هندسي دقيق، من الحساب الإنشائي حتى التسليم.",
  "value.architecture.title": "عمارة خالدة",
  "value.architecture.text": "نبني وفق مبادئ تصميم تحافظ على قيمتها عبر السنين، لا وفق الصيحات العابرة.",
  "value.delivery.title": "تسليم في الموعد",
  "value.delivery.text": "جدول واضح وعملية شفافة: نسلّم المفاتيح في الموعد الموعود.",
  "value.detail.title": "عناية بالتفاصيل",
  "value.detail.text": "من الواجهة إلى الداخل، يُخطَّط لكل تفصيل ويُنفَّذ بالعناية ذاتها.",

  "portfolio.heading": "مشاريعنا",
  "portfolio.intro":
    "يمكنك أدناه الاطّلاع على مشاريعنا الجارية والمنجزة. انقر على أي مشروع لعرض معرضه وموقعه.",
  "portfolio.allProjects": "كل المشاريع",
  "portfolio.viewProject": "عرض المشروع",
  "portfolio.empty": "لا توجد مشاريع في هذه الفئة بعد.",

  "detail.constructionTitle": "من الموقع",
  "detail.floorPlans": "مخططات الطوابق",
  "detail.gallery": "معرض المشروع",
  "detail.location": "الموقع",
  "detail.ctaHeading": "هل ترغب بالتعرّف على هذا المشروع عن قرب؟",
  "detail.contactUs": "تواصل معنا",
  "detail.otherProjects": "مشاريع أخرى",
  "detail.start3d": "ابدأ الجولة ثلاثية الأبعاد",
  "construction.live": "حالة الموقع المباشرة",
  "floorplan.unitTypeSuffix": "نوع الشقة",
  "map.pending": "سيُضاف موقع المشروع قريبًا",

  "form.name": "الاسم الكامل",
  "form.phone": "الهاتف",
  "form.email": "البريد الإلكتروني",
  "form.subject": "الموضوع",
  "form.message": "رسالتك",
  "form.send": "إرسال الرسالة",
  "form.sending": "جارٍ الإرسال...",
  "form.sentTitle": "تم استلام رسالتك.",
  "form.sentBody": "سنتواصل معك في أقرب وقت ممكن.",
  "form.error": "تعذّر إرسال الرسالة. يُرجى المحاولة مجددًا أو الاتصال بنا.",

  "contact.heading": "لنتحدّث عن مشروعك",
  "contact.intro":
    "املأ النموذج بأسئلتك أو اتصل بنا مباشرة، وسنردّ عليك في أقرب وقت.",
  "contact.address": "العنوان",
  "contact.hours": "ساعات العمل",
  "contact.mapPlaceholder": "منطقة الخريطة — بانتظار الإعداد المخصّص",
  "contact.faqLabel": "الأسئلة الشائعة",
  "contact.faqHeading": "إجابات لأسئلتك",

  "about.heading": "قوة في البساطة، ونهجٌ يترك أثرًا في الجودة",
  "about.approachLabel": "نهجنا",
  "about.founderLabel": "مؤسّسنا",
  "about.mission": "مهمّتنا",
  "about.vision": "رؤيتنا",
  "about.values": "قيمنا",
};

const ku: Dict = {
  "nav.home": "Destpêk",
  "nav.portfolio": "Portfolyo",
  "nav.about": "Derbarê me",
  "nav.contact": "Têkilî",

  "common.render3d": "Dîmena 3D",
  "status.ongoing": "Domdar",
  "status.completed": "Qediya",
  "filter.all": "Hemû",
  "delivery.delivered": "Radestkirin",
  "delivery.target": "Radestkirina armanckirî",

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

  "value.engineering.title": "Endezyariya Pêbawer",
  "value.engineering.text": "Her proje ji hesabê statîk heta radestkirinê bi dîsîplînek endezyariyê ya hûrgilî tê meşandin.",
  "value.architecture.title": "Mîmariya Bêdem",
  "value.architecture.text": "Em ne li gor modayan, lê li gor prensîbên sêwiranê yên ku bi salan nirxê xwe diparêzin ava dikin.",
  "value.delivery.title": "Radestkirina Di Wextê de",
  "value.delivery.text": "Bernameyek zelal û pêvajoyek şefaf: em mifteyê di roja sozdayî de radest dikin.",
  "value.detail.title": "Baldarî di Hûrgiliyê de",
  "value.detail.text": "Ji rûyê avahiyê heta hundir, her hûrgilî bi heman baldariyê tê plansazkirin û bicîhkirin.",

  "portfolio.heading": "Projeyên me",
  "portfolio.intro":
    "Hûn dikarin projeyên me yên domdar û qedandî li jêr bibînin. Li projeyekê bitikînin da ku galerî û cihê wê bibînin.",
  "portfolio.allProjects": "Hemû Proje",
  "portfolio.viewProject": "Projeyê bibîne",
  "portfolio.empty": "Hîn projeyek di vê kategoriyê de tune.",

  "detail.constructionTitle": "Ji şantiyeyê",
  "detail.floorPlans": "Planên Qatan",
  "detail.gallery": "Galeriya Projeyê",
  "detail.location": "Cih",
  "detail.ctaHeading": "Tu dixwazî vê projeyê ji nêz ve nas bikî?",
  "detail.contactUs": "Bi me re têkilî daynin",
  "detail.otherProjects": "Projeyên din",
  "detail.start3d": "Gera 3D ya Avahiyê dest pê bike",
  "construction.live": "Rewşa Şantiyeyê ya Zindî",
  "floorplan.unitTypeSuffix": "Cureya Xanî",
  "map.pending": "Agahiya cih dê di demek nêz de were zêdekirin",

  "form.name": "Nav û Paşnav",
  "form.phone": "Telefon",
  "form.email": "E-name",
  "form.subject": "Mijar",
  "form.message": "Peyama te",
  "form.send": "Peyamê bişîne",
  "form.sending": "Tê şandin...",
  "form.sentTitle": "Peyama te hat girtin.",
  "form.sentBody": "Em ê di zûtirîn demê de bi te re têkilî daynin.",
  "form.error": "Peyam nehat şandin. Ji kerema xwe dîsa biceribîne an telefonî me bike.",

  "contact.heading": "Werin em li ser projeya we biaxivin",
  "contact.intro":
    "Ji bo pirsên xwe formê dagirin an rasterast telefonî me bikin, em ê di zûtirîn demê de bersivê bidin.",
  "contact.address": "Navnîşan",
  "contact.hours": "Saetên Xebatê",
  "contact.mapPlaceholder": "Qada nexşeyê — li benda sazkirina taybet",
  "contact.faqLabel": "Pirsên Berbelav",
  "contact.faqHeading": "Bersivên pirsên we",

  "about.heading": "Hêz di sadebûnê de, têgihiştinek ku şop di kalîteyê de dihêle",
  "about.approachLabel": "Nêzîkatiya me",
  "about.founderLabel": "Damezrênerê me",
  "about.mission": "Mîsyona me",
  "about.vision": "Vîzyona me",
  "about.values": "Nirxên me",
};

export const MESSAGES: Record<Locale, Dict> = { tr, en, ar, ku };

export function translate(locale: Locale, key: string): string {
  return MESSAGES[locale]?.[key] ?? MESSAGES[DEFAULT_LOCALE][key] ?? key;
}
