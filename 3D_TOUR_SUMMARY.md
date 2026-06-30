# 3D Bina Turu — Özet & Bakım Notları

Artık **gerçek `.glb` modeli** yüklüyor (önceki "basit kutu" sürümünün yerine),
tamamen **veri-driven**: her proje kendi modeline + ayarlarına sahip olabilir.

## Nasıl çalışır
- `data/projects.json > <proje>.tour3D` verisine göre `BuildingTour3D` kendini
  kurar. Component'te hiçbir proje adı/dosya yolu hardcoded değildir.
- Model `useGLTF(modelUrl, true)` ile yüklenir (DRACO + meshopt desteği açık).
- Model otomatik olarak **yatayda ortalanır**, **tabanı zemine** (y=0) oturur ve
  `modelScale` verilmemişse **hedef yüksekliğe (~14 birim) otomatik ölçeklenir**.
- Arsa sınırı poligonunun **centroid**'ine yerleşir; ince ayar için `modelPosition`.
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
  "satelliteImageUrl": "/images/satellite/sadebal-citylife-satellite.jpg",
  "modelScale": 1.0,            // opsiyonel — yoksa auto-fit
  "modelRotationY": 0,          // opsiyonel — radyan
  "modelPosition": { "x": 0, "y": 0, "z": 0 } // opsiyonel — centroid'e göre kaydırma
}
```
`enabled:false` veya `modelUrl` yoksa, `/portfoy/<slug>/3d-tur` **proje detayına
yönlendirir** (redirect).

## YENİ PROJE EKLEME (adım adım)
1. Modeli `.glb` olarak hazırla, **`public/models/<slug>.glb`** olarak ekle
   (ör. `public/models/loca-life.glb`).
2. `data/projects.json` içinde o projenin `tour3D` objesini doldur:
   `enabled:true`, `modelUrl:"/models/<slug>.glb"`, `floorCount`, `unitsPerFloor`,
   `satelliteImageUrl` (varsa).
3. Proje detay sayfasında "3D Bina Turunu Başlat" butonu otomatik görünür
   (sadece `tour3D.enabled` olanlarda).
4. Sahnede modelin oturuşunu kontrol et; gerekiyorsa ince ayar:
   - **Yamuk/küçük/büyük** → `modelScale` ekle (ör. 0.8, 1.5). Yoksa auto-fit ~14 birim.
   - **Ön cephe yanlış yöne bakıyor** → `modelRotationY` (radyan; 90° = `1.5708`,
     180° = `3.1416`).
   - **Sınırın dışına taşıyor / kaymış** → `modelPosition: { x, y, z }` ile kaydır.
5. Uydu üstündeki arsa poligonunu projeye göre ayarlamak istersen:
   `BuildingTour3D.tsx > ARSA_BOUNDARY_POINTS` (oransal 0–1 noktalar).

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

## Verilen kararlar
- **Auto-fit:** `modelScale` yoksa model hedef yüksekliğe (~14 birim) ölçeklenir —
  model birimini bilmeden "çalışır" gelsin diye. Data'da `modelScale` verilince o kullanılır.
- **Hit box raycast:** model mesh'lerinin `raycast`'i no-op yapıldı; sadece kat
  hit box'ları olay alır → tıklama hep doğru kata gider.
- **DRACO açık** (`useGLTF(url, true)`): şu anki model draco değil (zararsız), ama
  sıkıştırılmış model gelince hazır. (Decoder gstatic CDN'den yüklenir.)
- UI elementlerine (başlık, geri butonu, lejant, arka plan) dokunulmadı; yalnızca
  geometri kaynağı (kutu → gerçek model) ve kat mekanizması değişti.
