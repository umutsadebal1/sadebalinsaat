# Sadebal Yapı — Proje Dokümantasyonu

Bu belge, projenin mimarisini, veri akışını ve yeni eklenen **Admin Paneli**'ni özetler.

## Teknoloji

- **Next.js 16** (App Router) + **React 19**
- **TypeScript**
- **Tailwind CSS v4** (token tabanlı, light/dark)
- **framer-motion** (animasyonlar), **lucide-react** (ikonlar)
- Self-hosted fontlar: Fraunces (display), Inter (sans), JetBrains Mono (label)

## Sayfa Yapısı (genel site)

| Rota | Dosya | Açıklama |
|------|-------|----------|
| `/` | `src/app/page.tsx` | Anasayfa, hero + öne çıkan projeler |
| `/portfoy` | `src/app/portfoy/page.tsx` | Filtrelenebilir proje listesi |
| `/portfoy/[slug]` | `src/app/portfoy/[slug]/page.tsx` | Proje detay (galeri + harita) |
| `/hakkimizda` | `src/app/hakkimizda/page.tsx` | Hakkımızda + kurucu |
| `/iletisim` | `src/app/iletisim/page.tsx` | İletişim formu + bilgiler |

## Veri Modeli

### Proje (`Project`)
`slug, title, status (Devam Eden|Tamamlandı), propertyType (Konut|Ticari|Karma), location, year, description, longDescription?, image, gallery[], isRender?, coordinates?{lat,lng}`

### Site Ayarları (`siteConfig`)
`companyName, email, phoneDisplay, phoneHref, addressShort, addressFull, founder{name,title}, workingHours, social{instagram,facebook,linkedin}`

## ⭐ Veri Katmanı (Admin için yeniden düzenlendi)

Eskiden veriler `src/lib/projects.ts` ve `src/lib/site-config.ts` içinde **sabit kod** olarak duruyordu. Admin panelinin verileri düzenleyebilmesi için veriler artık JSON dosyalarında tutulur:

- `data/projects.json` — tüm projeler
- `data/site.json` — site/iletişim ayarları

Okuma/yazma `src/lib/data.ts` üzerinden yapılır (Node `fs`). Site sayfaları bu dosyaları **istek anında** okur (dynamic rendering), böylece admin'de yapılan değişiklik anında yansır.

## ⭐ Admin Paneli

Sidebar ile yönetilen, korumalı tam yönetim arayüzü.

| Rota | İşlev |
|------|-------|
| `/admin/login` | Şifre ile giriş |
| `/admin` | Dashboard — özet istatistikler |
| `/admin/projects` | Proje listesi (ekle / sil / düzenle) |
| `/admin/projects/new` | Yeni proje oluştur |
| `/admin/projects/[slug]` | Proje düzenle (galeri, görsel yükleme dahil) |
| `/admin/site` | Site/iletişim bilgilerini düzenle |

### Güvenlik
- Giriş tek şifre ile (`ADMIN_PASSWORD` ortam değişkeni; tanımsızsa varsayılan `admin123`).
- Başarılı girişte httpOnly cookie set edilir.
- `/admin/*` ve `/api/admin/*` rotaları **middleware** ile korunur.

### API Rotaları (`/api/admin/...`)
- `POST /api/admin/login` · `POST /api/admin/logout`
- `GET/POST /api/admin/projects` (liste / oluştur)
- `GET/PUT/DELETE /api/admin/projects/[slug]`
- `GET/PUT /api/admin/site`
- `POST /api/admin/upload` (görsel yükleme → `public/images/projects/...`)

### Kurulum
```bash
npm install
# .env.local içine: ADMIN_PASSWORD=secret-sifre
npm run dev
```
Admin: http://localhost:3000/admin/login

## Bilinen / Sıradaki İşler
- İletişim formu gerçek e-posta gönderimi (Resend/Nodemailer).
- Proje koordinatları girilince detay haritası otomatik gerçek haritaya döner.
- Domain & metadata (`sadebalyapi.com`) gerçek domain ile güncellenmeli.

## ⭐ Hero Scroll-Video (eklendi)

Anasayfadaki hero artık gerçek bir video kullanıyor — Sadebal Citylife'ın
dışarıdan içeriye süzülen tanıtım videosu, kareye bölünüp watermark'ı
temizlenerek entegre edildi.

- `src/components/Hero.tsx` — scroll-track (`h-[280vh]`) + `sticky` video alanı,
  içinde `HeroContent` (framer-motion stagger metni) ve `ScrollSequence` birlikte çalışır.
- `src/components/ScrollSequence.tsx` — `trackRef` prop'u ile dış scroll-track
  elemanına göre ilerleme hesaplar (sticky yapı için gerekli).
- `public/sequence/hero/frame_0001.webp` ... `frame_0090.webp` — 90 kare, ~2.9MB toplam.

Videoyu değiştirmek isterseniz:
```bash
ffmpeg -i video.mp4 -vf fps=6,scale=900:-1 public/sequence/hero/frame_%04d.webp
```
ve `Hero.tsx` içindeki `frameCount` değerini güncelleyin.
</content>
</invoke>
