# Sadebal Yapı — Site Yenileme Özeti

Bu çalışma `feature/site-overhaul` branch'inde yapıldı. **`main` branch'ine ve
`yedek-overhaul-oncesi` git tag'ine dokunulmadı — yedeğiniz bunlar.**

> Üretim (sadebalinsaat.vercel.app) hâlâ eski/çalışan haldedir. Bu branch'i
> Vercel otomatik olarak bir **preview deployment** olarak yayınlar; o önizleme
> linkinden bitmiş hali görüp beğenirseniz branch'i `main`'e merge ederek canlıya
> alırsınız.

Tüm görevler tamamlandı, `next build` ve `tsc --noEmit` hatasız geçiyor, tüm
sayfalarda yatay taşma yok (mobil + masaüstü doğrulandı, 0px overflow).

---

## 1. Portföy Listesi (`/portfoy`)
- **PortfolioCarousel** (`src/components/PortfolioCarousel.tsx`): tam genişlikte,
  ~5.5 sn'de bir otomatik dönen hero carousel. Her slayt: büyük görsel + gradient +
  proje adı (serif) + durum badge + teslim etiketi + "Projeyi Gör". Ok + nokta
  kontrolleri, pointer ile swipe, hover'da duraklatma, framer-motion geçişler.
- **EditorialGrid** (`src/components/EditorialGrid.tsx`): filtre pill'leri
  (Tümü / Devam Eden / Tamamlandı) + **asimetrik** kart düzeni (4+2 / 3+3 ritmi,
  farklı en-boy oranları). Görsel baskın, başlık görselin üzerinde, altında **tek
  cümlelik** özet, durum badge, hover'da zoom + yukarı kalkma. Mobilde tek sütun.
- `src/app/(site)/portfoy/page.tsx` bu iki bileşeni kullanıyor.

## 2. Proje Detay (`/portfoy/[slug]`)
- **ProjectHeroSlider**: tam ekran (90svh) otomatik slider; proje adı görselin
  üstüne yapışmıyor, sol üstte küçük yarı saydam köşe etiketi olarak (navbar'ın
  altına konumlandı).
- **Bilgi bloğu**: baskın serif başlık, açıklama paragrafları, ve tek satırda
  ikonlu spec satırı: **m² · oda · konum · teslim · tip** (yeterli boşlukla).
- **ConstructionProgress**: "Canlı Şantiye Durumu" — aşama bazlı animasyonlu
  progress bar'lar. **Sadece "Devam Eden" projelerde** gösterilir.
- **FloorPlans** (Görev 5): sekmeli interaktif kat planı (2+1 / 3+1 ...). Veri
  yoksa bölüm hiç render edilmez.
- **ProjectImageFlow**: galeri görsellerini küçük grid yerine **tam genişlikte**,
  art arda, nefes alanıyla gösterir + lightbox.
- **ProjectMap**: `coordinates` veya `mapEmbedUrl` ile gerçek Google Maps embed.
- Sayfa sonu **CTA**: "Bize Ulaşın" / "Diğer Projeler".

## 3. SSS (`/iletisim`)
- **FAQ** (`src/components/FAQ.tsx`): accordion. İçerik `site.json > faq`'tan gelir.
- İletişim sayfasının altına "Sıkça Sorulan Sorular" bölümü olarak eklendi.

## 4. Testimonials (Anasayfa)
- **Testimonials** (`src/components/Testimonials.tsx`): otomatik slider (isim,
  ünvan/rol, yorum, opsiyonel fotoğraf). İçerik `site.json > testimonials`'tan gelir.
- Anasayfaya "Referanslar" bölümü olarak (Neden Sadebal ile CTA arasına) eklendi.

## 5. İnteraktif Kat Planları
- Yukarıda (Görev 2) anlatıldı. Veri alanı: `Project.floorPlans`.

## 6. Tipografi
- `Hero.tsx` / `HeroContent.tsx`: "Sadelikte güç," sonrası boşluk garanti edildi.
- `AnimatedHeading.tsx`: kelime aralarındaki boşluğun render'da kaybolmaması için
  `whitespace-pre` eklendi.
- `data/*.json`: başlık/konum sonundaki fazla boşluklar temizlendi
  ("Zirve House ", "İzmir/Torbalı ").

## 7. Gerçekçi Tarihler
- `data/projects.json`:
  - Devam Eden (Sadebal Citylife) → **Hedeflenen Teslim: 2027**
  - Tamamlanan: Zirve House **2023**, Loca Life **2024**, Loca Garden **2025**
- UI'da `deliveryLabel()` ile "Teslim: YYYY" (tamamlanan) vs "Hedeflenen Teslim:
  YYYY" (devam eden) ayrımı kart, carousel ve detay spec satırında gösteriliyor.
- Admin'de status (Devam Eden/Tamamlandı) + Yıl alanları bu ayrımı kontrol eder.

## + Hero Intro Butonu (sizin fikriniz)
- `Hero.tsx`: ilk açılışta ortada **"Hayallerinizi Gerçeğe Dönüştürün"** butonu.
  Tıklanınca hero scroll-sekansı **programatik** olarak (easeInOutCubic, ~6 sn)
  ve takılmadan oynar — parmakla yavaş kaydırmadaki jank'i tamamen bypass eder.
  Kullanıcı kendisi scroll yapınca buton gizlenir.

## Admin Panel (tüm yeni alanlar düzenlenebilir)
- **ProjectForm**: Kart Özeti, Toplam Alan (m²), Oda Tipleri, Harita Embed URL,
  **İlerleme Durumu** (aşama ekle/sil + yüzde), **Kat Planları** (ekle/sil + tip +
  görsel yükle).
- **Site Ayarları**: **SSS** (soru/cevap ekle-sil) ve **Referanslar** (isim/ünvan/
  yorum/fotoğraf ekle-sil) editörleri.
- `POST /api/admin/projects` yeni alanları kaydedecek şekilde güncellendi
  (PUT zaten tüm gövdeyi geçiriyordu).

---

## Verdiğim Kararlar ve Gerekçeleri
- **Veri yeri:** `faq` ve `testimonials` ayrı dosya yerine `site.json`'a konuldu —
  mevcut Site Ayarları admin editörünü ve `readSite()` akışını yeniden kullanmak için.
- **Teslim ayrımı** için ayrı bir alan eklemedim; mevcut `status` zaten Devam
  Eden/Tamamlandı ayrımını veriyor, etiket bundan türetiliyor (`deliveryLabel`).
- **Kat planı / şantiye verisi placeholder:** Gerçek kat planı görseli olmadığından
  Sadebal Citylife için mevcut render görselleri geçici olarak kat planı seçildi ve
  örnek ilerleme yüzdeleri girildi. **Bunları admin panelden gerçek verilerle
  değiştirin.**
- **Koordinatlar:** Mardin ve İzmir/Torbalı için yaklaşık koordinatlar girildi;
  admin'den tam konuma çekilebilir.
- **Eski bileşenler:** `PortfolioGrid.tsx` ve `ProjectGallery.tsx` artık
  kullanılmadığından silindi (yerlerini EditorialGrid ve ProjectImageFlow aldı).
- **Hassas dosyalara dokunulmadı:** `.env*` ve secret içeren hiçbir dosya
  okunmadı/değiştirilmedi.

## Gözden Geçirilmesi / Yapılması Gerekenler
1. **Kat planı görselleri**: Gerçek 2+1 / 3+1 plan görsellerini admin > proje
   düzenle > Kat Planları'ndan yükleyin (şu an render görseli placeholder).
2. **Şantiye ilerleme yüzdeleri**: Sadebal Citylife için gerçek değerleri girin.
3. **SSS ve Referans metinleri**: Placeholder içerikleri admin'den güncelleyin
   (gerçek müşteri ismi/izni varsa testimonial isimlerini değiştirin).
4. **Koordinatlar / harita**: Her proje için tam konumu admin'den ayarlayın.
5. **İletişim formu** hâlâ sahte gönderim yapıyor (önceki durum) — gerçek e-posta
   entegrasyonu (Resend/Nodemailer) ileride bağlanmalı.
6. **Admin yazma + Vercel**: Vercel dosya sistemi salt-okunur olduğundan admin
   panelden yapılan kayıtlar (JSON'a yazma + görsel yükleme) production'da kalıcı
   olmaz; kalıcı admin için ileride bir DB/obje deposu (ör. Vercel Blob + KV/DB)
   gerekir. Yerelde ve build'de sorunsuz çalışır.

## Branch / Yedek
- Yedek (değişiklik öncesi): `main` + tag `yedek-overhaul-oncesi`
- Yeni çalışma: `feature/site-overhaul`
- Commit'ler görev bazında atıldı (`git log --oneline` ile adım adım görülür).
