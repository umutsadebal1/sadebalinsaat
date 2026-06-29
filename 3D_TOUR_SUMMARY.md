# 3D Bina Turu — Özet & Bakım Notları

İlk versiyon: **temsili/basit geometri**. Gerçek mimari model (SketchUp) geldiğinde
güncellenecek. Branch: `feature/3d-building-tour`.

## Nasıl test edilir
1. `npm run dev` → `http://localhost:3000/portfoy/sadebal-citylife` aç.
2. Sayfa sonundaki CTA bölümünde **"3D Bina Turunu Başlat"** butonuna tıkla
   (buton yalnızca `tour3D.enabled = true` olan projelerde görünür).
3. `/portfoy/sadebal-citylife/3d-tur` açılır:
   - Sürükle → döndür, tekerlek/iki parmak → zoom (mobilde dokunmatik).
   - Bir **kata** tıkla → o kat vurgulanır, daireler (alt-birimler) belirir.
   - Bir **daireye** tıkla → sahne içinde bilgi kartı (Kat/Daire, ~m², "Müsait")
     + **WhatsApp ile Bilgi Al** linki (mesajda proje adı + kat/daire otomatik).
   - Boş alana tıkla → seçim temizlenir.
- `next build` ve `npx tsc --noEmit` hatasız geçer (doğrulandı).

## Eklenecek dosya (uydu görüntüsü)
- **`public/images/satellite/sadebal-citylife-satellite.jpg`**
  - Mardin'deki gerçek arsa konumunun uydu görüntüsü (kare/1:1 önerilir).
  - Dosya **yoksa** kod çökmez: zemin sessizce düz toprak rengine (`#8B7355`)
    düşer (`THREE.TextureLoader` onError fallback'i — `BuildingTour3D.tsx > Ground`).
  - Eklendiğinde otomatik olarak zemine doku olarak uygulanır.
  - `tour3D.satelliteImageUrl` alanı (projects.json / admin) ile yol değiştirilebilir.

## Dosyalar
| Dosya | Görev |
|---|---|
| `src/lib/projects.ts` | `Tour3DConfig` tipi + `Project.tour3D` alanı |
| `data/projects.json` | Citylife: `tour3D { enabled, floorCount:10, unitsPerFloor:4, satelliteImageUrl }` |
| `src/app/api/admin/projects/route.ts` | POST'a `tour3D` eklendi (PUT zaten geçiriyordu) |
| `src/components/BuildingTour3D.tsx` | Asıl 3D sahne (three/r3f/drei) |
| `src/components/BuildingTourClient.tsx` | `next/dynamic ssr:false` + yükleme durumu |
| `src/app/(site)/portfoy/[slug]/3d-tur/page.tsx` | Route + temsili uyarı notu |
| `src/app/(site)/portfoy/[slug]/page.tsx` | Detay CTA'sına "3D Bina Turunu Başlat" butonu |

## Verilen kararlar (notlar)
- **Arsa sınırı** `BuildingTour3D.tsx > ARSA_BOUNDARY_POINTS` içinde **oransal
  (0–1)** noktalar olarak tutuluyor; `toWorld()` ile zemin plane'ine ölçekleniyor.
  Görseldeki gerçek konuma göre ince ayar için bu diziyi düzenle (kodda `TODO` notu var).
- **Sınır çizgisi:** kalın soluk **altın glow** (#C9A24B) + ince **petrol yeşili**
  (#0F3D3E) çizgi, zeminin hemen üstünde (y offset) — flicker yok. Renk/kalınlık
  `Boundary()` içinde kolayca değiştirilebilir.
- **Bina** sınırın **centroid**'ine yerleştirildi; footprint `FOOT_W/FOOT_D`,
  kat yüksekliği `FLOOR_H` sabitleriyle ayarlanıyor. Her kat ayrı `mesh` (tıklanabilir).
- **Daire sayısı** kat başına `tour3D.unitsPerFloor`'a göre derinlik ekseninde
  kabaca bölüştürülüyor. Temsili m² basit bir formülle üretiliyor (gerçek değil).
- **Performans:** `dynamic ssr:false` ile three yalnızca tarayıcıda, talep üzerine
  yüklenir; `dpr={[1,2]}` ile mobilde aşırı pixel doldurma sınırlı.
- Route `robots: index:false` — temsili sayfa arama motorlarına açılmıyor.

## Gerçek SketchUp modeli geldiğinde ne değişecek
Sadece **`src/components/BuildingTour3D.tsx`** değişir; route/buton/veri aynı kalır.
1. Modeli `.glb`/`.gltf`'e dönüştür (SketchUp → glTF; Blender ile export en temizi),
   `public/models/sadebal-citylife.glb` olarak ekle.
2. `Building` bileşenindeki kutu-geometri yığınını, drei `useGLTF('/models/...glb')`
   ile yüklenen gerçek model ile değiştir (`import { useGLTF } from "@react-three/drei"`).
3. Kat/daire tıklanabilirliği için: modeldeki mesh'leri isimlendir (ör. `Kat_01`,
   `Daire_01_03`) ve `traverse` ile `onClick` bağla — mevcut seçim/kart mantığı
   (`selFloor`/`selUnit` + drei `Html`) aynen yeniden kullanılabilir.
4. `Ground`, `Boundary`, `OrbitControls`, kamera ve `Html` bilgi kartı **olduğu
   gibi kalır**. Gerekirse kamera başlangıç pozisyonunu yeni modelin ölçeğine göre ayarla.
5. `unitsPerFloor`/`floorCount` artık modelden geleceği için `tour3D` alanları
   opsiyonel meta olarak kalabilir veya kaldırılabilir.

## Bağımlılıklar
`three@^0.185`, `@react-three/fiber@^9` (React 19 uyumlu), `@react-three/drei@^10`.
