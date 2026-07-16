# Otellio — Tanıtım/Satış Web Sitesi PRD (Ürün Gereksinim Dokümanı)

> **Bu dokümanın amacı:** Antigravity (veya herhangi bir AI kod aracı) bu belgeyi girdi olarak alıp, aşağıda tanımlanan tanıtım/satış web sitesini eksiksiz üretebilmelidir. Tüm metinler, renkler, kurallar ve teslim kriterleri buradadır. Belirsizlik bırakılmamıştır; araç metin/renk/özellik uydurmamalıdır.

**Sürüm:** 1.0
**Kapsam:** Tek sayfa (single-page) tanıtım/satış web sitesi. Ürünün kendisi (tahmin motoru, uygulama) bu kapsamda DEĞİLDİR.
**Dil:** Tüm arayüz ve içerik Türkçe.

---

## 1. Proje Özeti

**Ürün adı:** Otellio

**Ürün nedir:** Otelcinin elindeki geçmiş rezervasyon verisini (Excel/CSV) yükleyip, önümüzdeki 30-90 gün için doluluk tahmini ve fiyat önerisi alabildiği, sade ve hızlı kurulan bir SaaS aracı.

**Bu iş nedir:** Yukarıdaki ürünü tanıtan, demo talebi toplayan tek sayfalık pazarlama web sitesi. Backend/uygulama entegrasyonu sonraki aşamadır.

**Tek cümlelik vaat:** "Odanız boş kalmadan önce bilin."

**Konumlandırma:** Pazardaki 25 modüllü, karmaşık ve pahalı kurumsal sistemlerin (ör. Wholebeds tarzı) aksine; bütçesi sınırlı küçük/orta tesisler için **basit, hızlı kurulan, anlaşılır** bir araç. Rakip karşılaştırması sitede isim vererek değil, "karmaşık büyük sistemler vs. size özel basit araç" tonuyla yapılır.

**Kurucu güveni (önemli):** Site "bu işi gerçekten anlayan biri yaptı" hissi vermeli. Aşırı kurumsal/soğuk değil, samimi ve güven verici. Kurucu Endüstri Mühendisliği mezunu; talep tahmini (SARIMA/zaman serisi) ve otel operasyonlarında (Antalya'da iki otelde staj) gerçek tecrübeye sahip.

---

## 2. Hedef Kitle & Ton

**Hedef kitle:** Antalya ve çevresinde 30-150 odalı bağımsız otel, pansiyon, apart otel ve butik otel sahipleri ile genel müdürleri.

**Kitlenin özellikleri:**
- Teknolojiye çok hakim değiller; karmaşık dashboard'lardan çekiniyorlar.
- Doluluk/fiyat tahmininin işlerine ciddi katkı yapacağını biliyorlar.
- Çoğu siteyi **telefondan** açacak → mobil öncelikli tasarım şart.
- Yaş ortalaması yüksek olabilir → okunaklı font, yüksek kontrast, büyük dokunma hedefleri.

**Ton ve dil kuralları:**
- Net, güven verici, abartısız.
- Somut, sayısal fayda vurgusu: "boş odanı önceden gör", "fiyatını zamanında ayarla", "doluluk tahmin hatasını azalt".
- Teknik jargondan kaçın (SARIMA, algoritma, model gibi kelimeler ana metinde geçmesin; sadece kurucu hikayesinde güven unsuru olarak hafifçe geçebilir).

**KAÇINILACAK ifadeler (kullanma):**
- "Devrim yaratan yapay zeka", "geleceğin teknolojisi", "sektörü değiştiren"
- Abartılı yüzde garantileri ("%40 daha fazla gelir garantisi" gibi kanıtlanamaz vaatler)
- Soğuk kurumsal klişeler ("çözüm ortağınız", "360 derece çözüm", "sinerjik")

---

## 3. Teknik Stack & Mimari

**Framework:** Next.js (App Router). Gerekçe: Türkçe SEO için sunucu tarafı render, hızlı yükleme, ve ileride backend/API rotalarının kolayca eklenebilmesi.

**Diller/araçlar:**
- TypeScript (tip güvenliği ve profesyonellik için).
- Stil: Tailwind CSS **veya** CSS Modules (tutarlı olması kaydıyla). Global renk/spacing token'ları tek yerde tanımlı olmalı.
- İkonlar: `lucide-react` (inline SVG, hafif). Harici ikon CDN'i KULLANMA.

**Mimari kuralları:**
- Tek sayfa (single-page). Tüm bölümler tek route (`/`) altında, bölümlere `id` ile anchor navigasyonu.
- Bölümler ayrı, yeniden kullanılabilir bileşenler olarak yazılmalı (`Hero`, `ProblemSolution`, `HowItWorks`, `Features`, `Founder`, `Pricing`, `FAQ`, `DemoForm`, `Footer`).
- İçerik metinleri kod içine gömülü sabitlerden değil, mümkünse tek bir `content.ts` (veya benzeri) dosyasından beslenmeli — böylece metin güncellemesi kolay olur.
- Temiz, okunabilir, yorumlanmış kod. Kullanılmayan bağımlılık bırakma.

**Performans hedefleri:**
- Lighthouse Performance ≥ 90 (mobil).
- İlk anlamlı boyama hızlı; ağır kütüphane yükleme yok.
- Görseller: stok fotoğraf YOK. Sadece inline SVG illüstrasyon/ikon. Gerçek otel fotoğrafı elde yoksa hiçbir fotoğraf kullanılmaz (placeholder stok görsel de kullanılmaz).
- Font: en fazla 2 aile, `next/font` ile self-host edilerek yüklenir (harici Google Fonts CDN çağrısı yerine self-host tercih edilir).

**Dosya yapısı (öneri):**
```
/app
  /layout.tsx        (lang="tr", meta etiketleri, font)
  /page.tsx          (bölümleri sırayla dizer)
/components
  Hero.tsx
  ProblemSolution.tsx
  HowItWorks.tsx
  Features.tsx
  Founder.tsx
  Pricing.tsx
  FAQ.tsx
  DemoForm.tsx
  Footer.tsx
  Navbar.tsx
/lib
  content.ts         (tüm Türkçe metinler)
/styles
  globals.css        (renk/spacing token'ları)
```

---

## 4. Sayfa Bölümleri (Sıra ile)

> Aşağıdaki her bölüm için amaç, düzen ve **hazır Türkçe metin** verilmiştir. Metinler doğrudan kullanılabilir; araç yeni metin uydurmamalıdır. Kesin kopya metinlerin tamamı **Bölüm 11**'de toplu halde de verilmiştir.

### 4.0 Navbar (üst menü)
- Sabit (sticky) üst çubuk. Sol: "Otellio" logo/kelime markası. Sağ: bölüm linkleri (Nasıl Çalışır, Özellikler, Fiyatlandırma, SSS) + belirgin "Demo İste" butonu.
- Mobilde: hamburger menü.

### 4.1 Hero
- **Amaç:** İlk 3 saniyede vaadi ve somut faydayı iletmek.
- **Düzen:** Sol tarafta metin (başlık + alt açıklama + CTA), sağ tarafta sade bir SVG illüstrasyon (ör. yükselen doluluk grafiği/takvim motifi — soyut, temiz). Mobilde metin üstte, illüstrasyon altta.
- **Başlık:** Odanız boş kalmadan önce bilin.
- **Alt açıklama:** Geçmiş rezervasyon verinizi yükleyin, önümüzdeki 30-90 gün için doluluk tahmininizi ve önerilen fiyatlarınızı görün. Karmaşık kurulum yok, ilk tahmininizi dakikalar içinde alın.
- **Güven şeridi (alt-vaat):** "Excel'inizi yükleyin, ilk tahmininizi 10 dakikada görün." (küçük, ikonlu tek satır)
- **Birincil CTA:** "Demo İste" → demo formuna kaydırır (`#demo`).

### 4.2 Problem / Çözüm
- **Amaç:** Otelcinin manuel/tahminî fiyatlama acısını gösterip çözümü karşıya koymak.
- **Düzen:** İki sütun. Sol "Bugün nasıl?" (problem), sağ "Otellio ile" (çözüm). Her tarafta 3 kısa madde. Problem tarafı nötr gri tonlarda, çözüm tarafı marka renkleriyle vurgulu.
- **Metin:** Bölüm 11.2'de.

### 4.3 Nasıl Çalışır (3 adım)
- **Amaç:** Kolaylığı görselleştirmek. Kod/teknik detay YOK.
- **Düzen:** 3 kart yatay (mobilde alt alta), her kartta numaralı sade ikon.
  1. **Verinizi yükleyin** — Elinizdeki Excel veya CSV rezervasyon dosyasını sürükleyip bırakın.
  2. **Tahmininizi alın** — Önümüzdeki 30-90 gün için doluluk tahmininizi anında görün.
  3. **Fiyatınızı ayarlayın** — Önerilen fiyatlarla dolu geçecek günleri değere, boş geçecek günleri satışa çevirin.

### 4.4 Özellikler (4 kart)
- **Amaç:** Somut yetenekleri göstermek. Her kart: ikon + başlık + 1-2 cümle fayda.
  1. **Doluluk Tahmini** — Önümüzdeki 30-90 gün için gün gün doluluk beklentinizi, tahmin aralığıyla birlikte görün.
  2. **Fiyat Önerisi** — Her gün için önerilen satış fiyatını alın; son kararı siz verin, dilediğinizde değiştirin.
  3. **Pazar / Sezon Trend Analizi** — Sezonluk ve haftalık talep hareketlerini görün, yoğun ve sakin dönemleri önceden planlayın.
  4. **Haftalık E-posta Raporu** — Her hafta gelecek dönem tahmininizi ve fiyat önerilerinizi özet halinde e-postanıza alın.
- **Not:** "Fiyat önerisi" ve tahminler **öneri/tahmin** olarak sunulur; "garanti/optimum" gibi kesinlik iddiası içeren dil kullanılmaz.

### 4.5 Neden Biz / Kurucu Hikayesi
- **Amaç:** İnsani güven. Kısa, samimi, 2-3 cümle.
- **Düzen:** Dar, ortalanmış metin bloğu. İstenirse basit bir avatar/monogram (fotoğraf yoksa baş harfli daire). Fotoğraf yoksa fotoğraf koyma.
- **Metin:** Bölüm 11.5'te.

### 4.6 Fiyatlandırma (3 paket) — **DÜZELTİLMİŞ SINIRLAR**
- **Amaç:** Şeffaf, karşılaştırılabilir paketler. Orta paket "En Popüler" olarak vurgulanır (hafif büyütme + rozet + aksan çerçeve).
- **ÖNEMLİ — oda sınırları örtüşmeyecek şekilde netleştirildi:**

| Paket | Hedef | Gösterge Fiyat | Öne çıkanlar |
|---|---|---|---|
| **Başlangıç** | 30 odaya kadar (≤30) | ~750–1.000 TL/ay | Doluluk tahmini, fiyat önerisi, aylık rapor |
| **Standart** *(En Popüler)* | 31–100 oda | ~1.500–2.500 TL/ay | Başlangıç'taki her şey + pazar/sezon trend analizi + haftalık e-posta raporu |
| **Kurumsal** | 100+ oda veya çoklu tesis | ~4.000–6.000 TL/ay *veya* "Bize Ulaşın" | Standart'taki her şey + çoklu tesis + öncelikli destek |

- **Notlar (araç için):**
  - Fiyatlar TL oynaklığı nedeniyle **kolayca güncellenebilir** olmalı (tek `content.ts` içinde). Sitede "gösterge fiyat" ibaresi küçük dipnotla belirtilir.
  - Her pakette CTA: "Demo İste" (forma kaydırır). Kurumsal'da opsiyonel "Bize Ulaşın".
  - Sınırların net olması kritik: "30 oda" sadece Başlangıç'a aittir; 31'den itibaren Standart başlar.

### 4.7 SSS (5 soru)
- Akordeon (aç/kapa) düzeni. Sorular ve cevaplar Bölüm 11.7'de.

### 4.8 CTA / İletişim — Demo Talep Formu
- **Amaç:** Ana dönüşüm. Bölüm 7'deki form spesifikasyonuna göre.
- Bölüm başında kısa bir kapanış cümlesi + form.

### 4.9 Footer
- Basit. Sol: "Otellio" + kısa bir cümle. Orta: bölüm linkleri. Sağ: iletişim (e-posta placeholder: `info@otellio.com`) + sosyal medya ikonları (placeholder linkler, `#`).
- Alt satır: telif "© 2026 Otellio" + **KVKK Aydınlatma Metni** ve **Gizlilik Politikası** linkleri (şimdilik `#` veya ayrı sade sayfa placeholder).

---

## 5. Tasarım Sistemi

### Renk Paleti (onaylı: lacivert/petrol + mercan/turuncu aksan)
| Rol | Renk | Hex |
|---|---|---|
| Ana koyu (başlık, footer, hero zemin) | Petrol/gece mavisi | `#0F2A43` |
| Ana koyu alternatif | Petrol mavisi | `#0B3B4A` |
| Aksan (CTA, vurgu) | Mercan/terracotta turuncu | `#E86A33` |
| Aksan hover | Koyu mercan | `#CF5622` |
| İkincil aksan (opsiyonel ikon/detay) | Deniz camı yeşili | `#4FA69A` |
| Zemin (açık) | Kum/kırık beyaz | `#F7F4EF` |
| Kart/beyaz yüzey | Beyaz | `#FFFFFF` |
| Ana metin | Neredeyse siyah | `#1A1A1A` |
| İkincil metin | Gri | `#5B6672` |

- Kontrast: Tüm metin/zemin kombinasyonları **WCAG AA** (normal metin ≥ 4.5:1, büyük metin ≥ 3:1) sağlamalı. Turuncu buton üzerinde beyaz metin kontrastı kontrol edilmeli; gerekirse buton metni koyulaştırılır veya buton tonu ayarlanır.

### Tipografi
- Başlık fontu: modern, güven verici bir sans-serif (ör. **Inter**, **Manrope** veya **Plus Jakarta Sans**). Gövde fontu aynı aile olabilir.
- **Türkçe karakter desteği zorunlu:** ş, ğ, ı, İ, ö, ü, ç doğru render edilmeli. Seçilen font Latin Extended alt kümesini içermeli; `next/font` ile `subsets: ['latin', 'latin-ext']`.
- Taban gövde font boyutu: **min 16px** (mobilde de). Başlıklar net hiyerarşi (h1 ~ 40-56px masaüstü, mobilde ölçekli).

### Boşluk & Düzen
- Bol beyaz alan (nefes alan tasarım). Bölümler arası cömert dikey boşluk.
- İçerik maksimum genişliği ~1152px, ortalanmış; kenar iç boşluk mobilde ≥16px.
- Kartlarda yumuşak köşe (radius ~12-16px) ve hafif gölge; aşırı gölge/neon efekt yok.

### Butonlar
- Birincil (CTA): mercan zemin, beyaz metin, radius ~10px, belirgin dokunma alanı (yükseklik ≥ 48px).
- İkincil: çerçeveli (outline) lacivert.
- Hover/focus durumları görünür; klavye focus halkası (focus ring) korunur.

### İkon yaklaşımı
- `lucide-react` inline SVG. Tutarlı çizgi kalınlığı. Dekoratif ikonlara `aria-hidden`.

### Mobil kırılım noktaları
- Mobil öncelikli. Kırılımlar: `sm 640`, `md 768`, `lg 1024`. Çok sütunlu bölümler mobilde tek sütuna iner. Dokunma hedefleri ≥ 44×44px.

---

## 6. Fiyatlandırma Tablosu (Uygulama Notu)
Bölüm 4.6'daki tablo esas alınır. Kart düzeninde 3 sütun (mobilde alt alta), orta kart "En Popüler" rozetiyle ölçekli. Fiyat metinleri `content.ts` içinden gelir. Her fiyatın altında küçük "gösterge fiyat, KDV hariç" dipnotu.

---

## 7. Demo Formu Spesifikasyonu

**Alanlar:**
| Alan | Tip | Zorunlu | Kural |
|---|---|---|---|
| Otel adı | text | Evet | 2-100 karakter |
| Oda sayısı | number | Evet | 1-2000 arası tam sayı |
| E-posta | email | Evet | Geçerli e-posta formatı (regex) |
| Telefon | tel | Evet | TR formatı toleranslı; sadece rakam/`+`/boşluk; 10-15 hane |
| Mesaj (opsiyonel) | textarea | Hayır | ≤ 500 karakter |
| KVKK onayı | checkbox | **Evet** | İşaretlenmeden gönderim engellenir |

**Validation (istemci tarafı):**
- Boş zorunlu alan, geçersiz e-posta/telefon durumunda **alan altında net Türkçe hata mesajı** ("Lütfen geçerli bir e-posta girin." gibi). Genel "hatalı giriş" mesajı YASAK.
- Gönder butonu, form geçerli değilken uyarı gösterir (disable yerine, erişilebilirlik için görünür hata tercih edilir).

**KVKK onayı (zorunlu):**
- Checkbox etiketi: "Kişisel verilerimin, demo talebimi değerlendirmek amacıyla işlenmesini kabul ediyorum. [Aydınlatma Metni]" — link Aydınlatma Metni'ne (şimdilik `#` placeholder ayrı sayfa).
- Onay işaretlenmeden gönderim yapılmaz.

**Şimdilik nereye kaydedilecek (backend yok):**
- Form gönderiminde veriler `console.log` ile yazılır **ve** React state'e eklenir; kullanıcıya başarı mesajı gösterilir: "Talebiniz alındı. En kısa sürede sizinle iletişime geçeceğiz."
- Kod içinde açık bir `// TODO: backend entegrasyonu (API route)` yorumu bırakılır ve **Bölüm 8**'deki backend güvenlik notlarına referans verilir.
- Hiçbir kişisel veri URL query string'ine yazılmaz.

**Bot/spam koruması (hafif, şimdilik):**
- Gizli honeypot alanı (ekranda görünmeyen, botların doldurduğu input). Doluysa gönderim sessizce yok sayılır.

---

## 8. Güvenlik & KVKK Gereksinimleri

> Bu bölüm iki katmanlıdır: **(A) şimdi** (statik site) ve **(B) backend eklenince**. Antigravity (A)'yı uygular, (B)'yi kod içinde TODO olarak belirtir.

### (A) Şimdi uygulanacak
- **KVKK:** Demo formunda zorunlu açık rıza checkbox'ı + Aydınlatma Metni linki (Bölüm 7). Kişisel veri (e-posta, telefon) toplandığı için bu zorunludur.
- **XSS'e karşı:** Tüm kullanıcı girdileri ekranda gösterilecekse React'in varsayılan escaping'i korunur; `dangerouslySetInnerHTML` **kullanılmaz**.
- **Harici kaynak:** Font ve ikonlar self-host/paket içi. Zorunlu bir harici script/stil varsa **Subresource Integrity (SRI)** hash'i ile ve yalnızca güvenilir kaynaktan eklenir. Gereksiz üçüncü parti script yok.
- **Bağımlılıklar:** Sadece gerekli paketler. `npm audit` temiz olmalı; bilinen kritik/yüksek açıklı paket kullanılmaz.
- **Gizli veri yok:** Repoda API anahtarı, sır, `.env` değeri commit edilmez. Örnek `.env.example` konur.
- **Güvenli varsayılanlar:** `next.config` içinde temel güvenlik başlıkları (ör. `X-Content-Type-Options: nosniff`, `Referrer-Policy`, mümkünse temel bir `Content-Security-Policy`) eklenir.
- **Form:** honeypot spam koruması (Bölüm 7).

### (B) Backend eklenince (kod içinde TODO olarak işaretlenecek)
- Form gönderimi **HTTPS** üzerinden bir API route'a POST edilir.
- Sunucu tarafında **tekrar validation** (istemci validation'a güvenilmez).
- **Rate limiting** ve daha güçlü **bot koruması** (ör. sunucu tarafı doğrulama/CAPTCHA — CAPTCHA seçilirse erişilebilirlik gözetilir).
- Girdiler sunucuda **sanitize** edilir; veriler güvenli/şifreli saklanır.
- KVKK: toplanan verinin saklama süresi, amacı ve silme talebi süreci Aydınlatma Metni'nde tanımlanır.

---

## 9. Erişilebilirlik (a11y) Gereksinimleri — WCAG AA hedefi
- `<html lang="tr">`.
- Semantik HTML: `header`, `nav`, `main`, `section`, `footer`, başlık hiyerarşisi (tek `h1`, sonra `h2`/`h3`).
- Tüm form alanlarında ilişkili `<label>`; hata mesajları `aria-describedby` ile bağlı.
- Renk kontrastı WCAG AA (Bölüm 5). Bilgi yalnızca renkle aktarılmaz.
- Klavye ile tüm etkileşimli öğelere erişim; görünür focus halkası.
- Dokunma hedefleri ≥ 44×44px. Taban font ≥16px.
- Dekoratif SVG'lere `aria-hidden="true"`; anlamlı ikon/görsellere `aria-label`/alt.
- Akordeon (SSS) ve mobil menü ARIA uyumlu (`aria-expanded`, `aria-controls`).

---

## 10. SEO & Meta (Türkçe)
- `metadata` (Next.js) içinde:
  - **Title:** `Otellio — Küçük ve Orta Ölçekli Oteller İçin Doluluk Tahmini ve Fiyat Önerisi`
  - **Description:** `Antalya'daki bağımsız otel, pansiyon ve apart oteller için sade bir doluluk tahmini ve fiyat önerisi aracı. Excel verinizi yükleyin, 30-90 günlük tahmininizi ve önerilen fiyatlarınızı dakikalar içinde alın.`
  - **lang:** tr, **charset:** UTF-8, **viewport** responsive.
- **Open Graph / Twitter Card:** başlık, açıklama, `og:type=website`, `og:locale=tr_TR`. OG görseli olarak basit markalı bir SVG'den üretilmiş statik görsel veya düz renkli/başlıklı bir kapak (stok fotoğraf değil).
- **Structured data (opsiyonel ama önerilir):** `SoftwareApplication` veya `Organization` JSON-LD.
- Anlamlı `alt` metinleri; tek `h1`.
- `sitemap.xml` ve `robots.txt` (temel).

---

## 11. İçerik Metinleri (Hazır Türkçe Kopya)

> Bu metinler doğrudan kullanılacaktır. Araç bu metinleri değiştirmemeli, kısaltmamalı veya yeni pazarlama metni uydurmamalıdır. Küçük tipografik düzeltmeler dışında birebir kullanılır.

### 11.1 Hero
- **Başlık:** Odanız boş kalmadan önce bilin.
- **Alt açıklama:** Geçmiş rezervasyon verinizi yükleyin, önümüzdeki 30-90 gün için doluluk tahmininizi ve önerilen fiyatlarınızı görün. Karmaşık kurulum yok, ilk tahmininizi dakikalar içinde alın.
- **Güven şeridi:** Excel'inizi yükleyin, ilk tahmininizi 10 dakikada görün.
- **CTA:** Demo İste

### 11.2 Problem / Çözüm
**Başlık:** Boş oda mı, düşük fiyat mı? İkisi de para kaybettirir.

**Bugün nasıl oluyor? (problem)**
- Fiyatları çoğu zaman "geçen yıl ne yapmıştık" hissiyle belirliyorsunuz.
- Yoğun günleri geç fark edip odayı olması gerekenden ucuza satıyorsunuz.
- Sakin dönemleri göremeyip son dakika indirimlerine mecbur kalıyorsunuz.

**Otellio ile (çözüm)**
- Önümüzdeki 30-90 günün doluluğunu önceden görüyorsunuz.
- Dolu geçecek günlerde fiyatınızı zamanında yukarı çekiyorsunuz.
- Sakin günleri erkenden görüp satışı planlı şekilde artırıyorsunuz.

### 11.3 Nasıl Çalışır
**Başlık:** Üç adımda, dakikalar içinde.
1. **Verinizi yükleyin** — Elinizdeki Excel veya CSV rezervasyon dosyasını yükleyin.
2. **Tahmininizi alın** — Önümüzdeki 30-90 gün için doluluk tahmininizi görün.
3. **Fiyatınızı ayarlayın** — Önerilen fiyatlarla her günü değerine göre satın.

### 11.4 Özellikler
**Başlık:** İşinizi kolaylaştıran, sade özellikler.
1. **Doluluk Tahmini** — Gelecek 30-90 gün için gün gün doluluk beklentinizi, tahmin aralığıyla birlikte görün.
2. **Fiyat Önerisi** — Her gün için önerilen satış fiyatını alın. Son kararı siz verirsiniz, dilediğinizde değiştirirsiniz.
3. **Pazar / Sezon Trend Analizi** — Sezonluk ve haftalık talep hareketlerini görün, yoğun ve sakin dönemleri önceden planlayın.
4. **Haftalık E-posta Raporu** — Gelecek dönemin tahmini ve fiyat önerileri her hafta özet halinde e-postanıza gelsin.

### 11.5 Kurucu Hikayesi
**Başlık:** Bu aracı, otelin içinden biri geliştirdi.

Otellio'yu, Antalya'da iki otelde saha deneyimi olan bir endüstri mühendisi olarak geliştirdim. Doluluğun ve fiyatın ne kadar önemli, tahmin etmenin ne kadar zor olduğunu bizzat yaşadım. Amacım basitti: büyük zincirlerin pahalı sistemlerinde olan tahmin gücünü, sizin de birkaç dakikada kullanabileceğiniz sade bir araca dönüştürmek.

### 11.6 Fiyatlandırma
**Başlık:** İhtiyacınıza göre, şeffaf paketler.
**Alt not:** Gösterge fiyatlardır, KDV hariçtir.
- **Başlangıç** — 30 odaya kadar — ~750–1.000 TL/ay — Doluluk tahmini, fiyat önerisi, aylık rapor. [Demo İste]
- **Standart** *(En Popüler)* — 31–100 oda — ~1.500–2.500 TL/ay — Başlangıç'taki her şey + pazar/sezon trend analizi + haftalık e-posta raporu. [Demo İste]
- **Kurumsal** — 100+ oda veya çoklu tesis — ~4.000–6.000 TL/ay veya Bize Ulaşın — Standart'taki her şey + çoklu tesis desteği + öncelikli destek. [Bize Ulaşın]

### 11.7 SSS
**Başlık:** Sık sorulan sorular

1. **Kurulum ne kadar sürer?**
   Ayrı bir kurulum gerekmez. Elinizdeki Excel veya CSV dosyasını yüklediğinizde ilk tahmininizi genellikle dakikalar içinde görürsünüz.

2. **Verim gerçekten artar mı, nasıl ölçerim?**
   Otellio size gelecekteki doluluğu ve önerilen fiyatları gösterir; kararı siz verirsiniz. Faydayı en iyi, önerilen fiyatları uyguladığınız dönemlerdeki doluluk ve gelirinizi, önceki dönemlerle karşılaştırarak görürsünüz. Kesin gelir garantisi vermiyoruz; size daha iyi karar verme imkânı sunuyoruz.

3. **Verilerim güvende mi?**
   Verilerinizi yalnızca size tahmin üretmek için kullanırız. Kişisel ve ticari verileriniz üçüncü kişilerle paylaşılmaz. Talebiniz üzerine verilerinizin silinmesini sağlarız.

4. **Mevcut sistemimle / PMS'imle çalışır mı?**
   Başlamak için tek ihtiyacınız geçmiş rezervasyon verinizi Excel veya CSV olarak dışa aktarabilmeniz. Çoğu otel yönetim sistemi bu aktarımı destekler.

5. **Teknik bilgim yok, kullanabilir miyim?**
   Evet. Otellio bilerek sade tutuldu. Dosyanızı yüklüyorsunuz, tahmininizi ve fiyat önerinizi anlaşılır bir ekranda görüyorsunuz. Karmaşık dashboard yok.

### 11.8 Demo/İletişim
**Başlık:** Otelinize özel bir demo görün.
**Alt açıklama:** Bilgilerinizi bırakın, size uygun bir zamanda Otellio'yu otelinizin verisiyle gösterelim.
**Buton:** Talep Gönder
**Başarı mesajı:** Talebiniz alındı. En kısa sürede sizinle iletişime geçeceğiz.

### 11.9 Footer
- Kısa cümle: "Otellio — küçük ve orta ölçekli oteller için sade doluluk tahmini ve fiyat önerisi."
- İletişim: info@otellio.com (placeholder)
- Linkler: Nasıl Çalışır · Özellikler · Fiyatlandırma · SSS · KVKK Aydınlatma Metni · Gizlilik Politikası
- Alt satır: © 2026 Otellio. Tüm hakları saklıdır.

---

## 12. Teslim Kriterleri (Definition of Done)

Site şu maddelerin tamamını sağladığında "tamam" sayılır:

**İçerik & Yapı**
- [ ] Tüm bölümler (4.0–4.9) sırasıyla mevcut ve Bölüm 11 metinleriyle dolu.
- [ ] İçerik tamamen Türkçe; Türkçe karakterler (ş, ğ, ı, İ, ö, ü, ç) her yerde doğru render ediliyor.
- [ ] Fiyat paketlerinin oda sınırları örtüşmüyor (≤30 / 31–100 / 100+).
- [ ] 4. özellik "Pazar / Sezon Trend Analizi" olarak geçiyor (rakip fiyat takibi DEĞİL).

**Tasarım**
- [ ] Renk paleti Bölüm 5 ile birebir; kontrastlar WCAG AA.
- [ ] Stok fotoğraf yok; yalnızca inline SVG illüstrasyon/ikon.
- [ ] Mobil öncelikli; 375px, 768px, 1280px genişliklerde düzgün görünüyor.

**Fonksiyon**
- [ ] Navbar linkleri ilgili bölümlere yumuşak kaydırıyor; "Demo İste" forma gidiyor.
- [ ] Demo formu: tüm validation kuralları (Bölüm 7) çalışıyor, hata mesajları alan bazında ve Türkçe.
- [ ] KVKK onayı işaretlenmeden gönderim engelleniyor.
- [ ] Honeypot spam koruması mevcut.
- [ ] Form gönderimi console + state'e yazıyor, başarı mesajı gösteriyor; `// TODO: backend` yorumu var.

**Güvenlik & Erişilebilirlik**
- [ ] `dangerouslySetInnerHTML` yok; gereksiz harici script yok.
- [ ] Temel güvenlik başlıkları `next.config`'de tanımlı.
- [ ] `npm audit` kritik/yüksek açık içermiyor.
- [ ] `lang="tr"`, semantik HTML, form label'ları, görünür focus, ≥44px dokunma hedefleri.

**SEO & Performans**
- [ ] Türkçe title/description ve Open Graph etiketleri (Bölüm 10) mevcut.
- [ ] `robots.txt` + `sitemap.xml` var.
- [ ] Lighthouse (mobil): Performance ≥ 90, Accessibility ≥ 90, SEO ≥ 90.

**Kod Kalitesi**
- [ ] Bölümler ayrı bileşenler; metinler tek `content.ts` içinde.
- [ ] TypeScript hatasız derleniyor; kullanılmayan bağımlılık yok.
- [ ] `.env.example` var, repoda sır yok.

---

## Ek Not: Antigravity'ye verirken

Bu dokümanı verirken şu kısa yönergeyi başına ekleyebilirsin:
> "Aşağıdaki PRD'ye birebir uy. Metinleri Bölüm 11'den al, uydurma. Renkleri Bölüm 5'ten al. Stok fotoğraf kullanma. Bölüm 12'deki teslim kriterlerinin hepsini karşıla."
