# HT OptiSchedule — Revize Geliştirme Planı (v2)

**Tarih:** 23 Eylül 2026
**Değişikliğin özü:** v1 planı "Bilsa/CSV içe aktar → hesapla" akışına dayanıyordu. v2'de **uygulamanın kendi veri modeli tek doğruluk kaynağıdır**; öğretmen, ders yükü, kapalı gün/saat, kural ve tercihler **tamamen elle girilebilir ve düzenlenebilir**. İçe aktarma (Bilsa PDF / a.txt / CSV) yalnızca bu modeli hızlı doldurmak için isteğe bağlı bir kısayoldur.

Mevcut prototip koddan (`~/.gemini/antigravity/scratch/solver_pro.py`, `parse_csv.py`, `map_names.py`) doğrulanan gerçek durum:

| Konu | Prototipte durum | v2'de yapılacak |
|---|---|---|
| Kısıt kaynağı | Yalnız CSV (`;` ayraçlı, satır = öğretmen+gün, 8 saat sütunu) | Elle grid + CSV/Bilsa içe aktarma seçenekleri |
| Ders yükü | Mevcut program PDF'inden türetiliyor (`analysis_data.json` → `curriculum.txt`) | Elle girilen ders yükü tablosu; PDF/a.txt yalnızca ön doldurma |
| İsim eşleme | `map_names.py` sessiz "içerir" eşlemesi, eşleşmeyen sessizce atlanıyor | Eşleme onay ekranı; kullanıcı elle bağlar |
| Yetersiz müsaitlik | Müsait saat < ders yükü ise CSV kısıtları **sessizce yok sayılıyor** (`ignored_csv_teachers`) | Kırmızı uyarı; kullanıcı ya saat açar ya "yumuşak kısıt" der, sessiz atlama yok |
| VIP kuralı | `"HASAN TURHAN"` koda gömülü | Genel "öğretmen kuralı" editörü (herkes için tanımlanabilir) |
| 4 gün kuralı | Sabit `req_days = 4` | Okul ayarı + öğretmen bazlı geçersiz kılma |
| Blok deseni | 3 saat = 2+1, 5 = 2+2+1 sabit | Ders bazlı düzenlenebilir desen |
| Canlı geri bildirim | Yok (yalnız bitişte KY basıyor) | `CpSolverSolutionCallback` + JSON Lines olay akışı |
| Kısmi kilitleme | Yok | `AddHint` + sabitleme kısıtları |
| Thread | Sabit 4 | Ayarlardan (CPU % → worker sayısı) |

---

## 1. Hedef ve Kapsam

- **Kullanıcı:** Müdür / Müdür Yardımcısı. Teknik bilgi beklenmez.
- **Çıktı:** Öğretmen boşluklarını (Karnı Yarık, KY) en aza indiren haftalık program; kıyaslama, geçmiş ve dışa aktarma.
- **Platform:** macOS + Windows masaüstü (Tauri 2).
- **Çalışma modu:** Tamamen çevrimdışı. Tüm veri yerel proje dosyasında.

## 2. Veri Modeli (Uygulamanın Tek Doğruluk Kaynağı)

Depolama: SQLite (`tauri-plugin-sql`) + `.htos` proje dosyası (JSON, dışa/içe aktarılabilir, yedeklenebilir). Her kayıt UI'dan elle oluşturulur/düzenlenir/silinir.

```
Okul (School)
  ├─ ayarlar: gün sayısı (5), günlük ders saati (8), blok başlangıç saatleri [1,3,5,7],
  │           öğle arası konumu, varsayılan zorunlu gün sayısı (4), KY ağırlıkları
  ├─ Öğretmen (Teacher): ad, branş, kısaltma, aktif mi, zorunlu gün sayısı (opsiyonel)
  │     ├─ Müsaitlik (Availability): 5×8 hücre, her hücre ∈ {MÜSAİT, KAPALI, İSTEMİYOR}
  │     │     KAPALI = sert kısıt (asla ders konmaz)
  │     │     İSTEMİYOR = yumuşak kısıt (cezalı, gerekirse konur)
  │     ├─ Kural (TeacherRule): "Pazartesi boş", "Cuma erken bitir", "sabahçı", "öğlenci",
  │     │     "en fazla N gün", "günde en fazla N saat", ağırlık 1-100
  │     └─ Not (serbest metin: "hamile, 4. saatten sonra gelmesin")
  ├─ Sınıf/Şube (ClassSection): "9/A", seviye, mevcut
  ├─ Ders Ataması (Assignment): öğretmen × şube × ders kodu × haftalık saat × blok deseni
  │     örn. BAYRAM BAKIR × 11/A × TÜRE1 × 5 saat × [2,2,1]
  ├─ Şube Kısıtı: şubede belirli saat kapalı (beden eğitimi salonu, laboratuvar vb.)
  └─ Çözüm (Solution): tarih, etiket, parametreler, KY toplamı, kilitli öğretmen seti,
        program JSON'u, kaynak çözüm id'si (hangi çözümden türetildi)
```

**İçe aktarma katmanı** (isteğe bağlı): Bilsa PDF / a.txt / CSV → **Ön İzleme + Eşleme ekranı** → kullanıcı onaylar → modele yazılır. Hiçbir içe aktarma doğrudan modeli ezmez; "mevcut kayıtla birleştir / üzerine yaz / atla" seçilir.

## 3. Ekranlar ve Elle Veri Girişi

### 3.1 Okul Ayarları
- Gün sayısı, günlük saat sayısı, blok saatleri, öğle arası.
- Varsayılan zorunlu gün kuralı (4 gün) aç/kapat; öğretmen bazlı geçersiz kılınabilir.
- KY ağırlıkları: boşluk saati (10), "ortada başlayıp ortada bitme" cezası (2), İSTEMİYOR cezası (5) — slider ile.

### 3.2 Öğretmen Yönetimi
- Liste: ad, branş, haftalık yük (atamalardan otomatik), müsait saat, uyarı rozeti.
- **Hızlı ekleme:** tek satırda "Ad Soyad, Branş" yaz + Enter; toplu yapıştırma (Excel'den kopyalanan sütun).
- Sil/pasife al (pasif öğretmen çözüme girmez, verisi kalır).

### 3.3 Ders Yükü Editörü (Assignment Grid)
- Satır: öğretmen; sütun: şube. Hücreye tıkla → ders kodu + saat + blok deseni.
- Toplamlar canlı: öğretmen satır toplamı, şube sütun toplamı (şube > 40 saat ise kırmızı).
- Blok deseni varsayılanı ayarlardan gelir (5 → 2+2+1), hücrede değiştirilebilir.
- Excel'den yapıştır: "Öğretmen;Şube;Ders;Saat" satırlarını tanır.

### 3.4 Müsaitlik Grid'i — **elle gün/saat kapatma (bu revizyonun merkezi)**
Sol: öğretmen listesi (arama + branş filtresi). Sağ: 5 gün × 8 saat matris.

**Hücre etkileşimleri**
- Tıkla: MÜSAİT → KAPALI → İSTEMİYOR → MÜSAİT döngüsü (üç durum, üç renk: yeşil / kırmızı / sarı).
- **Sürükle-boya:** mouse basılı tutup sürükle; ilk hücrenin yeni durumu sürüklenen tüm hücrelere uygulanır.
- **Gün başlığına tıkla:** o günün 8 saatini birden kapat/aç ("Pazartesi kapalı" tek tık).
- **Saat başlığına tıkla:** o saati tüm günlerde kapat (örn. her gün 1. saat kapalı).
- **Sabah / Öğleden sonra düğmeleri:** gün başlığında iki yarım-gün düğmesi (1-4 / 5-8).
- Sağ tık menüsü: "Bu günü kapat", "Bu günü İSTEMİYOR yap", "Öğretmenin tüm haftasını temizle".

**Klavye kısayolları**
- ↑↓ öğretmen değiştir, ←→ / hücre gezinme, `K` kapat, `M` müsait, `I` istemiyor, `1-5` gün kapat/aç toggle, `Cmd/Ctrl+Z` geri al, `Cmd/Ctrl+C / V` bir öğretmenin matrisini diğerine kopyala.

**Toplu işlemler**
- Çoklu öğretmen seç (checkbox) → "Seçili 12 öğretmen için Cuma'yı kapat".
- Şablon uygula: "Sabahçı", "Öğlenci", "Pazartesi boş + Cuma erken", "Ücretli öğretmen (3 gün)". Şablonlar kullanıcı tarafından kaydedilip düzenlenebilir.
- CSV içe aktar (mevcut format: `Öğretmen;Gün;1..8`) → önce fark ön izlemesi, sonra uygula.

**Anlık doğrulama (grid üzerinde)**
- Sağ üstte canlı sayaç: "Müsait 24 saat / Yük 26 saat" — yetersizse kırmızı; hangi günün açılmasının yeteceği önerilir.
- Zorunlu gün sayısı ile kapalı gün sayısı çelişirse uyarı ("4 gün zorunlu ama 2 gün kapalı").

### 3.5 Kural Editörü (VIP kuralının genelleştirilmesi)
- Öğretmen seç → kural ekle: tür (gün boş / erken bitir / geç başla / max gün / max günlük saat / ardışık ders üst sınırı) + ağırlık.
- Kurallar "sert" veya "yumuşak" işaretlenir. Sert kurallar çözümsüzlüğe yol açarsa doğrulama ekranı bunu isimle söyler.

### 3.6 Doğrulama Ekranı (hesaplama öncesi kapı)
Hesapla düğmesi ancak **kırmızı** hata yokken aktif. Sarı uyarılarla devam edilebilir.
- 🔴 Müsait saat < ders yükü.
- 🔴 Şube haftalık toplamı > gün×saat.
- 🔴 Ders yükü olup hiç müsaitliği olmayan öğretmen.
- 🔴 Sert kurallar birbirini imkânsız kılıyor (örn. 4 gün zorunlu + 2 gün kapalı).
- ⚠️ İSTEMİYOR saatleri kullanılmadan yük sığmıyor.
- ⚠️ Ders yükü 0 olan aktif öğretmen.
- ⚠️ İçe aktarmada eşleşmeyen isim (elle bağla veya yeni öğretmen oluştur).

### 3.7 Çözücü Ayarları
- Süre: 1 / 5 / 15 dk / sınırsız (durdur düğmesi her zaman var; durdurulunca **o ana kadarki en iyi çözüm** kaydedilir).
- CPU yükü: %25 / %50 / %100 → `num_search_workers = max(1, floor(cores × oran))`.
- Rastgele tohum (aynı veriyle farklı çözüm denemek için "Yeniden karıştır").
- Başlangıç çözümü: "Önceki çözümden başla" (warm start, `AddHint`).

### 3.8 Canlı Takip Ekranı
- Büyük sayı: mevcut en iyi KY; küçük: alt sınır (solver `BestObjectiveBound`) → "En iyi 18, teorik alt sınır 12" ilerleme hissi verir.
- Zaman çizgisi grafiği: KY'nin zamana göre düşüşü.
- CPU/RAM (sysinfo), geçen/kalan süre.
- **Durdur ve Kabul Et** / **İptal** düğmeleri.
- Çözümsüzlük halinde: "INFEASIBLE" yerine hangi kısıtların gevşetilmesinin çözüm verdiği (varsayım tabanlı çelişki analizi, `AddAssumption` + `SufficientAssumptionsForInfeasibility`).

### 3.9 Sonuç Ekranı ve Elle Düzenleme
- Görünümler: Öğretmen bazlı / Şube bazlı / Gün bazlı.
- **Sürükle-bırak elle düzenleme:** bir ders bloğunu başka saate taşı; hedefte çakışma (öğretmen/şube) anında kırmızı; KY sayacı anında güncellenir. Elle düzenlenen hücreler "kilitli" işaretlenir.
- **Kilitle:** öğretmen satırını kilitle → yeniden hesaplamada sabit kalır.
- **Kısmi Yeniden Hesapla:** kilitsiz öğretmenler için yeniden çöz; kilitli olanlar `X == 1` sabitlenir.
- "Neden burada boşluk var?" tooltip: o boşluğa hangi dersin konamadığı (şube dolu / öğretmen kapalı / blok sığmıyor).

### 3.10 Geçmiş ve Karşılaştırma
- Çözüm listesi: tarih, etiket, KY, öğretmen sayısı, parametreler, türetildiği çözüm.
- A/B karşılaştırma: iki çözüm yan yana; toplam KY, KY'si olan öğretmen sayısı, en yüksek tekil KY, ortalama, dağılım histogramı, gün bazlı çubuk grafik, öğretmen bazlı fark tablosu (yeşil/kırmızı).
- "Mevcut okul programı" da bir çözüm kaydı olarak içe aktarılır (PDF/a.txt) → aynı ekranda kıyaslanır.

### 3.11 Dışa Aktarma
- PDF: okul geneli, öğretmen bazlı (her öğretmen ayrı sayfa), şube bazlı, "kapıya asılacak" günlük.
- Excel/CSV.
- Bilsa uyumlu format (format örneği alındıktan sonra).
- `.htos` proje dosyası (tam yedek).

## 4. Teknik Mimari

### 4.1 Yığın (iskelet mevcut, doğrulandı)
- Tauri 2 + React 19 + TypeScript 6 + Vite 8 + Tailwind 4.
- Durum yönetimi: Zustand (küçük, geri al/ileri al için `zundo`).
- Grid: kendi bileşenimiz (5×8 ve öğretmen×şube için kütüphane gerekmez); sürükle-bırak için `@dnd-kit`.
- Grafik: Recharts.
- Depolama: `tauri-plugin-sql` (SQLite) + `tauri-plugin-fs` (proje dosyası) + `tauri-plugin-dialog`.
- Sidecar: `tauri-plugin-shell` `externalBin` (Tauri 2'de sidecar bu eklentiyle çalışır; hedef üçlüsü son ekli isim zorunlu: `solver-aarch64-apple-darwin`, `solver-x86_64-pc-windows-msvc.exe`).

⚠️ İskelet düzeltmeleri (şu an bozuk): Tailwind 4 kuruluyken `postcss.config.js` eski `tailwindcss` eklentisini ve `index.css` eski `@tailwind` direktiflerini kullanıyor. Tailwind 4'te `@tailwindcss/vite` eklentisi + `@import "tailwindcss";` gerekir; `tailwind.config.js` ve `postcss.config.js` kaldırılır.

### 4.2 Python Sidecar mı, Rust mı? — Karar: **Python sidecar (OR-Tools CP-SAT)**
| Ölçüt | Python + OR-Tools sidecar | Saf Rust |
|---|---|---|
| CP-SAT erişimi | Resmi, tam, `SolutionCallback` var | Resmi Rust bağlaması yok; `good_lp` LP/MIP içindir, CP-SAT değil; üçüncü parti `cp_sat` kasaları bakımsız |
| Model geliştirme hızı | Prototip zaten Python'da | Yeniden yazım, aylar |
| Paket boyutu | +60-90 MB (PyInstaller onedir) | +0 |
| Başlatma | 1-2 sn | anlık |
| İmzalama | Her ikili ayrı imzalanır (Mac notarization için tüm .so/.dylib'ler) | tek ikili |

Karar gerekçesi: KY problemi CP-SAT'a mükemmel uyar; LP/MIP çözücülerle (good_lp/HiGHS) aynı modeli kurmak hem zor hem yavaş. Boyut ve imzalama maliyeti kabul edilebilir. **Protokol (4.3) motor-bağımsız tasarlanır**; ileride Rust motor gerekirse yalnızca sidecar değişir.

### 4.3 IPC Protokolü (Rust ↔ Python)
- Girdi: tek JSON dosyası (stdin değil; Windows'ta büyük stdin sorunlu). Rust `temp/run-<id>/input.json` yazar, yolu argümanla verir.
- Çıktı: **JSON Lines** stdout, her satır tek olay:
  ```json
  {"ev":"started","workers":4,"vars":18320}
  {"ev":"solution","ky":27,"bound":12,"t":4.2,"n":3}
  {"ev":"progress","t":30.0,"bound":14}
  {"ev":"done","status":"FEASIBLE","ky":22,"file":"result.json"}
  {"ev":"infeasible","conflicts":["4gün:AYŞE K.","kapalı:Cuma:MEHMET T."]}
  {"ev":"error","msg":"..."}
  ```
- Rust satır satır okur (`BufReader::lines`), `app.emit("solver://event", json)` ile React'e iletir. Log/uyarı satırları stderr'e gider, stdout yalnızca protokol taşır.
- İptal: Rust `child.kill()`; Python `signal` yakalayıp son en iyi çözümü `result.json`'a yazar (SIGTERM Mac; Windows'ta stdin'e `STOP\n` yazılır, callback `StopSearch()` çağırır → iki platform için tek yol: **stdin STOP komutu**).
- Çözüm dosyası büyük olabileceğinden program JSON'u stdout'a değil dosyaya yazılır; stdout yalnızca özet taşır.

### 4.4 Çözücü Değişiklikleri (`solver_pro.py` → `engine/solver.py`)
1. Girdi: dosyadan tek JSON (öğretmenler, atamalar, müsaitlik, kurallar, ayarlar, kilitler, ipucu).
2. Kodda gömülü isim/sayı kalmaz (HASAN TURHAN, 4, 8, [0,2,4,6] → parametre).
3. Üç durumlu müsaitlik: KAPALI → `X==0`; İSTEMİYOR → hedefe ağırlıklı ceza.
4. Kural motoru: genel kural türleri → kısıt/ceza üretimi.
5. `SolutionCallback` → JSON Lines olayı; `BestObjectiveBound` ile birlikte.
6. Kısmi kilit: kilitli öğretmen için önceki çözümdeki `X` sabitlenir; diğerleri `AddHint`.
7. Çözümsüzlük analizi: sert kısıtlar varsayım literali ile eklenir; INFEASIBLE'da çelişen küme raporlanır.
8. `num_search_workers`, `random_seed`, `max_time` parametre.
9. Birim test: 5 öğretmenlik sentetik veri ile KY hesabı, kilit, çözümsüzlük senaryoları (`pytest`).

### 4.5 Paketleme ve İmzalama Darboğazları
- **PyInstaller:** `--onedir` kullan (`--onefile` her açılışta temp'e açar, Mac notarization ile çakışır). OR-Tools `.so/.dylib`'leri hidden import olarak belirtilir.
- **macOS:** Developer ID sertifikası; sidecar klasöründeki her Mach-O `codesign --options runtime --timestamp` ile ayrı imzalanır; sonra `.app` imzalanır; `notarytool` ile notarize; `stapler`. Entitlements: `com.apple.security.cs.allow-unsigned-executable-memory` gerekebilir (Python). Universal ikili yerine ayrı arm64/x86_64 paketleri (PyInstaller universal üretmez).
- **Windows:** Kod imzalama sertifikası yoksa SmartScreen uyarısı çıkar; MSI/NSIS ile `externalBin` yolu `resources` altına gider. Antivirüs yanlış pozitifi PyInstaller'da yaygın → EV sertifika veya kullanıcıya not.
- **CI:** GitHub Actions matris (macos-14 arm64, macos-13 x64, windows-latest); Python sidecar önce her runner'da derlenir, sonra `tauri build`. Sürüm etiketi (`v*`) ile tetiklenir (mevcut Tahta projesi deseni).
- **Boyut:** ~80-120 MB toplam; kabul edilir.

### 4.6 Performans ve Kilitlenme Önlemleri
- Grid'ler `React.memo` + hücre bazlı state; 80 öğretmen × 40 hücre = 3.200 hücre sorun değil.
- Çözüm sonuçları SQLite'a yazılır, bellekte tutulmaz.
- Otomatik kayıt: her değişiklik SQLite'a; ayrıca 5 dakikada bir `.htos` yedek.

## 5. Geliştirme Aşamaları (revize)

| Aşama | İçerik | Kabul kriteri |
|---|---|---|
| 1. İskelet düzeltme | Tailwind 4 düzeltmesi, Zustand, tauri-plugin-sql/fs/dialog/shell, pencere 1280×800, Türkçe UI | `npm run tauri dev` açılıyor, boş proje oluşturuluyor |
| 2. **Elle veri girişi** | Okul ayarları, öğretmen CRUD, ders yükü grid'i, müsaitlik grid'i (tıkla/sürükle/gün kapat/klavye), kural editörü, geri al | 10 öğretmenlik okul sıfırdan 15 dk'da elle giriliyor; CSV'siz çalışıyor |
| 3. Doğrulama | 3.6'daki kontroller, canlı sayaçlar | Yetersiz müsaitlik kırmızıyla engelleniyor |
| 4. Motor | `engine/solver.py` yeniden yazımı, JSON Lines, kilit, ipucu, çözümsüzlük analizi, pytest | Prototipteki veriyle prototiple aynı/daha iyi KY; callback akıyor |
| 5. Sidecar + canlı ekran | PyInstaller, externalBin, Rust okuyucu, emit, durdur/iptal | Mac'te 5 dk'lık koşuda canlı KY düşüşü görülüyor, durdurunca en iyi çözüm kaydediliyor |
| 6. Sonuç + elle düzenleme | Üç görünüm, sürükle-bırak, kilit, kısmi yeniden hesapla, "neden boşluk" | 2 öğretmen için yeniden hesap diğerlerini değiştirmiyor |
| 7. Geçmiş + karşılaştırma | Çözüm listesi, A/B ekranı, grafikler | Mevcut program ile yeni program yan yana |
| 8. İçe aktarma | CSV (mevcut format), Bilsa PDF (prototip ayrıştırıcı), a.txt (örnek alınınca), isim eşleme onay ekranı | İçe aktarım sonrası her satır ön izlemede görülüp onaylanıyor |
| 9. Dışa aktarma | PDF (3 tür), Excel, `.htos`, Bilsa formatı | Yazıcıdan A4 öğretmen programı çıkıyor |
| 10. Paketleme | CI matrisi, imzalama, notarization, sürüm | Temiz Mac ve Windows'ta kurulup çalışıyor |

Aşama 2, içe aktarmadan (8) **önce** gelir: uygulama içe aktarma olmadan da tam işlevseldir.

## 6. Ek Özellikler ("mutlaka olmalı")

1. **Geri al / ileri al** her ekranda (grid girişinde hata kaçınılmaz).
2. **Durdur ve kabul et:** sınırsız koşuda kullanıcı istediği an en iyi çözümü alır.
3. **Alt sınır göstergesi:** "daha iyisi olabilir mi?" sorusuna cevap.
4. **Çözümsüzlük açıklaması:** isimle "kimin hangi kısıtı" çelişiyor.
5. **Adalet metriği:** toplam KY yanında en yüksek tekil KY ve KY'si olan öğretmen sayısı; hedefe "max KY" terimi (bir hocaya 8 boşluk yığmasın).
6. **Ne-olursa (what-if) analizi:** "Ayşe Hoca'nın Cuma'sını kapatırsam" → 30 sn hızlı koşu, KY farkı gösterilir.
7. **Elle düzenleme + çakışma kontrolü:** idareci son dokunuşu kendisi yapar, sistem sadece engel olur.
8. **Öğretmen bazlı PDF ve "kapı listesi"** (sınıf kapısına asılan günlük).
9. **Yumuşak tercih (İSTEMİYOR)** üçüncü durumu: "mümkünse değil" ile "asla" ayrımı gerçek hayatta şart.
10. **Proje dosyası ve otomatik yedek:** `.htos` ile başka bilgisayara taşıma.
11. **Tohumla yeniden karıştır:** aynı veriyle 3 farklı aday üret, en beğenileni seç (prototipteki `plan_opt1..3` akışının ürünleşmiş hali).
12. **Değişiklik günlüğü:** kim ne zaman hangi hücreyi kapattı (tek kullanıcı da olsa "bunu ben mi kapattım?" sorusu için).

## 7. Açık Konulara Cevaplar

1. **Rust mı Python mı?** Python sidecar (4.2). Protokol motor-bağımsız.
2. **a.txt formatı?** Elimizde örnek yok; prototip Bilsa **PDF** çıktısını ayrıştırıyor (`analysis_data.json`'daki `page`, `pdf_hs` alanları). Örnek `a.txt` alınana kadar içe aktarma PDF + CSV ile sınırlı; elle giriş bu bağımlılığı kaldırır. Örnek gelince: sabit genişlikli mi, ayraçlı mı tek bakışta belli olur; ayrıştırıcı 8. aşamada yazılır.
3. **Karşılaştırmada sadece toplam yeterli mi?** Hayır. Toplam KY + öğretmen dağılımı (histogram) + gün bazlı çubuk + en yüksek tekil KY. Toplam düşerken tek bir hocanın KY'si artabilir; idareci bunu görmeli.

## 8. Riskler

- ⚠️ PyInstaller + macOS notarization ilk seferde zaman alır (1-2 gün ayrılmalı).
- ⚠️ Windows'ta imzasız ikili SmartScreen/antivirüs uyarısı.
- ⚠️ 80+ öğretmen, 40+ şube ile model boyutu; prototip 10 dk'da çözüyor, kısmi kilit ile pratik.
- ⚠️ Bilsa dışa aktarma formatı bilinmiyor; örnek gerekli.

## 9. Hasan'dan Gerekenler

- Örnek Bilsa `a.txt` ve (varsa) Bilsa içe aktarma formatı örneği.
- Apple Developer ID sertifikası (mevcut Tahta projesinde var mı teyit).
- Windows kod imzalama sertifikası kararı (yok ise SmartScreen uyarısı kabul).
- Uygulama adı kararı (HT OptiSchedule öneriliyor; kısa, tab başlığına sığıyor).
- Ders yükü girişinde şube bazlı mı öğretmen bazlı mı başlanacağı tercihi (plan ikisini de destekliyor; varsayılan öğretmen satırı).
