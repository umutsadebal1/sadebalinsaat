# 3D Bina Turu — Özet & Bakım Notları

Artık **gerçek `.glb` modeli** yüklüyor (önceki "basit kutu" sürümünün yerine),
tamamen **veri-driven**: her proje kendi modeline + ayarlarına sahip olabilir.

## Nasıl çalışır
- `data/projects.json > <proje>.tour3D` verisine göre `BuildingTour3D` kendini
  kurar. Component'te hiçbir proje adı/dosya yolu hardcoded değildir.
- Model `useGLTF(modelUrl, true)` ile yüklenir (DRACO + meshopt desteği açık).
- Model otomatik olarak **yatayda ortalanır**, **tabanı zemine** (y=0) oturur ve
  `modelScale` verilmemişse **hedef yüksekliğe (~14 birim) otomatik ölçeklenir**.
- Model **dünya merkezine (0,0,0)** oturur; ince ayar için `modelPosition`.
- **Uydu zemini kaldırıldı.** Yerine stilize bir **şehir ortamı** kurulur
  (terrain + yol ızgarası + prosedürel bina blokları + dağ silsilesi + ağaçlar +
  sis). Bkz. aşağıdaki "Şehir ortamı" bölümü.
- **Kat tıklama:** gerçek model tek mesh olduğu için, modelin üstüne kat başına
  **görünmez "hit box"** (raycast katmanı) konur. Modelin geometrisine dokunulmaz;
  model mesh'lerinin raycast'i kapatılır, sadece hit box'lar tıklama/hover alır.
  Hover'da kat hafif altın renkle vurgulanır; tıkla → daireler (renkli, durum
  bazlı) → daireye tıkla → bilgi kartı (kat/daire, ~m², durum, WhatsApp).
- Yükleme sırasında `useProgress` ile **"3D model yükleniyor… %X (Y/Z MB)"**.
- `next/dynamic ssr:false` korunur (three yalnızca tarayıcıda, talep üzerine).

## tour3D veri şeması (`data/projects.json`)
```jsonc
"tour3D": {
  "enabled": true,
  "modelUrl": "/models/sadebal-citylife.glb",
  "floorCount": 10,
  "unitsPerFloor": 4,
  "satelliteImageUrl": "…",     // ARTIK KULLANILMIYOR (uydu zemini kaldırıldı)
  "modelScale": 1.0,            // opsiyonel — yoksa auto-fit
  "modelRotationY": 0,          // opsiyonel — radyan
  "modelPosition": { "x": 0, "y": 0, "z": 0 } // opsiyonel — merkeze göre kaydırma
}
```
`enabled:false` veya `modelUrl` yoksa, `/portfoy/<slug>/3d-tur` **proje detayına
yönlendirir** (redirect).

## YENİ PROJE EKLEME (adım adım)
1. Modeli `.glb` olarak hazırla, **`public/models/<slug>.glb`** olarak ekle
   (ör. `public/models/loca-life.glb`).
2. `data/projects.json` içinde o projenin `tour3D` objesini doldur:
   `enabled:true`, `modelUrl:"/models/<slug>.glb"`, `floorCount`, `unitsPerFloor`.
   (`satelliteImageUrl` artık kullanılmıyor.)
3. Proje detay sayfasında "3D Bina Turunu Başlat" butonu otomatik görünür
   (sadece `tour3D.enabled` olanlarda).
4. Sahnede modelin oturuşunu kontrol et; gerekiyorsa ince ayar:
   - **Yamuk/küçük/büyük** → `modelScale` ekle (ör. 0.8, 1.5). Yoksa auto-fit ~14 birim.
   - **Ön cephe yanlış yöne bakıyor** → `modelRotationY` (radyan; 90° = `1.5708`,
     180° = `3.1416`).
   - **Sınırın dışına taşıyor / kaymış** → `modelPosition: { x, y, z }` ile kaydır.
5. Şehir ortamı (yollar/komşular/dağlar) **yalnız Citylife'a** özeldir; başka
   projede sade terrain görünür. Genişletmek istersen `BuildingTour3D.tsx >
   CityEnvironment` ve alt bileşenlerine bak.

## ⚠️ Performans — ÖNEMLİ
- Mevcut `sadebal-citylife.glb` **~54 MB** (texture ağırlıklı). Bu, her ziyaretçi
  için büyük bir indirme — **mutlaka sıkıştırılmalı.** DRACO sadece geometriyi
  küçültür (burada geometri zaten küçük); asıl kazanç **texture sıkıştırma**dadır.
- Önerilen (gltf-transform ile, kalite/boyut dengesi):
  ```bash
  npx --yes @gltf-transform/cli optimize public/models/sadebal-citylife.glb \
    public/models/sadebal-citylife.glb --texture-compress webp --texture-size 1024
  ```
  (texture'ları webp + 1024px'e indirir; 54 MB → genelde birkaç MB. Geometri için
  `--compress draco` da eklenebilir — kod zaten DRACO destekli.)
- Sıkıştırma **lossy** olduğundan, orijinali yedekte tut. Boyut hedefi: < 8–10 MB.

## Dosyalar
| Dosya | Görev |
|---|---|
| `public/models/<slug>.glb` | Her projenin 3D modeli |
| `src/lib/projects.ts` | `Tour3DConfig` (modelUrl, modelScale, modelRotationY, modelPosition) |
| `data/projects.json` | Her projenin `tour3D` verisi |
| `src/components/BuildingTour3D.tsx` | useGLTF + hit box katmanı + useProgress |
| `src/components/BuildingTourClient.tsx` | dynamic ssr:false + UI overlay (başlık, lejant, geri) |
| `src/app/(site)/portfoy/[slug]/3d-tur/page.tsx` | route + redirect (tour kapalıysa) |

## Gerçek kat planı, daireler & durum sistemi

- **Gerçek kat planı verisi:** `tour3D.floorUnits` → her katta tekrar eden daireler
  (Citylife: 6 daire — A,B,C,D,E,F; her birinde `type`, `netM2`, `cephe`, oda→m²
  dağılımı). Katta soldan sağa yerleşim `position` alanına göre `orderedFloorUnits`
  ile sıralanır (sol_köşe→sol_orta→orta_sol→orta_sag→sag_orta→sag_köşe = A,B,E,F,C,D).
- **Hit box'lar:** binanın X genişliği **`floorUnits.length` (6) eşit parçaya** bölünür;
  her parça bir daire, yüksekliği tek kat. Tüm daireler her zaman görünür (düşük
  opacity), cepheye hafif taşarak (`model.d * 1.04`) oturur.
- **`BODY_FRACTION` (0.72):** grid yüksekliğin alt %72'sine (konut cephesi) yerleşir;
  çatıdaki inşaat/teknik kütle açıkta kalır.
- **`commercialFloors` (Citylife: 1):** tabanda dükkan/ticari kat(lar). Konut grid'i
  bu kadar slot yukarıdan başlar (`slots = floorCount + commercialFloors`); en alt
  kat(lar) boş bırakılır (modelin ham ticari zemini görünür). 2 yapılırsa zemin+1.kat
  ticari olur.
- **`unitGalleries` (tip→görsel[] ):** karttaki tipe özel galeri (2+1 / 3+1 ayrı).
  Doluysa kartta oda dağılımının altında küçük görsel şeridi (`tour.gallery`) çıkar;
  boşsa gizli. Görseller `public/images/...` altına konup URL'leri buraya eklenir.
- **Durum sistemi:** `tour3D.unitStatuses` → `"<kat>-<daireId>"` (ör. `"5-B"`) →
  `"Müsait"|"Rezerve"|"Satıldı"` (varsayılan Müsait, 10×6=60 kayıt). Renk buradan gelir
  (🟢/🟡/🔴). `unitAvailability()` yardımcıyla okunur.
- **Zengin bilgi kartı:** KAT · DAİRE id → `type · netM2 m²` → Cephe → **Oda Dağılımı**
  (emoji + i18n oda adı + m²) → durum → WhatsApp (mesajda tip+m²). Oda/cephe adları
  4 dilde çevrili (`tour.rooms.*`, `tour.dir.*`, `tour.facade`, `tour.roomsTitle`).
- **Admin:** `ProjectForm` → "Daire Durumları" bölümü (yalnız `tour3D.enabled` +
  `floorUnits` olan projede). 10×6 renk-kodlu dropdown; kaydet → PUT `tour3D`'yi
  koruyarak `projects.json`'a yazar. (Not: Vercel FS salt-okunur olduğundan canlıda
  admin değişikliği kalıcı olmaz; yerel/veri düzeyinde çalışır.)
## Şehir ortamı (yalnız Citylife, `CityEnvironment`)

Yön ekseni: `−X=BATI (giriş cephesi), +X=DOĞU, −Z=KUZEY, +Z=GÜNEY`.
Ana model dünya merkezinde; her şey hardcoded (projects.json'a veri eklenmedi).

- **Terrain (`CityGround`):** büyük tek düzlem (320×320), toprak/yeşil ton. Uydu yok.
- **Yollar (`Roads`):** 2 K–G + 2 D–B asfalt şerit → ızgara + kesişimler, orta
  çizgili; ana binanın altında beton **plot pad**. Ön (batı) avenüsü giriş cephesinin
  önünden geçer.
- **Şehir binaları (`CityBuildings`):** seeded (`mulberry32`) prosedürel bloklar,
  ~50-60 `BoxGeometry` (paylaşılan geometri + 6 palet, pencere dokulu). Bloklar:
  doğu, kuzey, kuzeybatı, güneydoğu, batı-uzak. **Plot, yollar ve iki hero komşu
  üzerine denk gelenler elenir.**
- **Görüş koridoru (`inViewCorridor`):** kamera→bina hattına düşen binalar elenir →
  **ön cephe (batı) her zaman açık.** Uzaktaki batı binaları koridorun dışında
  kaldığından görünür ama engellemez (client: "ön cephe kapalı kalmayacak, bina
  koyacaksan uzağına").
- **Hero komşular (`HeroNeighbours`):** KUZEY pembe/somon (~8 kat, `#D4A5A5`),
  DOĞU krem daha yüksek (~11 kat, `#E8E4DC`). Yolların karşısında, **ana binaya
  girmeyecek** şekilde sabit konumlanır (eski overlap düzeltildi).
- **Dağlar (`Mountains`):** perimetrede ~18 low-poly koni (flatShading), yeşil/kahve;
  **sis** (`<fog>` petrol, 80→215) ile ufkta erir.
- **Ağaçlar (`Trees`):** giriş önünde kısa ağaç sırası + serpiştirilmiş birkaç ağaç.
- **Kamera:** güneybatıdan (`[-30, 22, 34]`) kuzeydoğuya, giriş cephesine bakar;
  şehir arkada, dağlar ufukta.

## Verilen kararlar
- **Auto-fit:** `modelScale` yoksa model hedef yüksekliğe (~14 birim) ölçeklenir —
  model birimini bilmeden "çalışır" gelsin diye. Data'da `modelScale` verilince o kullanılır.
- **Raycast:** model mesh'lerinin + çevre (bina/ağaç/dağ) `raycast`'i no-op
  yapıldı; sadece **daire hücreleri** olay alır → tıklama hep doğru daireye gider.
- **DRACO açık** (`useGLTF(url, true)`): şu anki model draco değil (zararsız), ama
  sıkıştırılmış model gelince hazır. (Decoder gstatic CDN'den yüklenir.)
- UI elementlerine (başlık, geri butonu, lejant, arka plan) dokunulmadı; yalnızca
  geometri kaynağı (kutu → gerçek model) ve kat mekanizması değişti.
