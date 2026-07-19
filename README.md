# Otellio

Antalya ve çevresindeki 30-150 odalı bağımsız otel, pansiyon ve apart oteller için doluluk tahmini ve fiyat önerisi SaaS'ı. Otelci geçmiş rezervasyon verisini (Excel/CSV) yükler; önümüzdeki 30-90 gün için doluluk tahmini ve gecelik fiyat önerisi alır.

Pazarlama sitesi metinleri ve tasarım kuralları için tek gerçek kaynak: [otellio-website-PRD.md](otellio-website-PRD.md).

## Teknoloji

- Next.js 15 (App Router) + React 19 + TypeScript (strict)
- Tailwind CSS — tema token'ları [tailwind.config.ts](tailwind.config.ts) içinde
- Supabase (Postgres + Auth), `xlsx` (SheetJS), `pg`, `lucide-react`
- Vitest (birim testleri), GitHub Actions (CI), yerel git hook'ları ([Hooks/](Hooks/))

## Kurulum

```bash
npm install
cp .env.example .env.local   # degerleri Supabase Dashboard'dan doldur
git config core.hooksPath Hooks
npm run dev
```

Veritabanı şeması [supabase/migrations/](supabase/migrations/) altındadır; yeni bir Supabase projesinde dosyaları sırayla (0001, 0002, ...) SQL editöründen çalıştırın.

### Ortam değişkenleri

Tümü [.env.example](.env.example) içinde placeholder olarak listelidir:

| Değişken | Amaç |
|---|---|
| `SUPABASE_DB_URL` | Doğrudan Postgres bağlantısı (yalnızca sunucu; demo talepleri + cron) |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Auth/istemci (RLS korumalı) |
| `CRON_SECRET`, `RESEND_API_KEY`, `REPORT_FROM_EMAIL` | Haftalık e-posta raporu |
| `NEXT_PUBLIC_SITE_URL` | E-postalardaki panel linki |

## Komutlar

| Komut | Açıklama |
|---|---|
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Production build |
| `npm run lint` / `npm run type-check` / `npm test` | Kalite kontrolleri (pre-push kancası ve CI da bunları çalıştırır) |

## Mimari notları

- **İki veritabanı erişim yolu:** Kullanıcıya özel veri (`hotels`, `reservations`) RLS politikalı `@supabase/ssr` istemcileriyle okunur/yazılır ([lib/supabase/](lib/supabase/)). `demo_talepleri` tablosu ise anon/authenticated rollerinden tamamen izoledir; yalnızca sunucu tarafındaki doğrudan Postgres bağlantısı ([lib/db.ts](lib/db.ts)) yazabilir.
- **Oturum koruması:** [middleware.ts](middleware.ts) her istekte oturumu `getUser()` ile sunucuya doğrulatır, `/dashboard/*` rotalarını korur ve otel profili tamamlanmamış kullanıcıyı Ayarlar'a yönlendirir.
- **Hesap açma davetle olur; self-servis kayıt yoktur.** Supabase Dashboard > Authentication > Users > "Invite User" ile hesap açılır; davet e-postasındaki bağlantı `/sifre-yenile` üzerinden şifre belirletir. E-posta şablonundaki bağlantı şu formatta olmalıdır: `{{ .SiteURL }}/sifre-yenile?token_hash={{ .TokenHash }}&type=invite` (şifre sıfırlama şablonunda `type=recovery`).
- **Tahmin motoru** ([lib/forecast/simpleForecast.ts](lib/forecast/simpleForecast.ts)): haftanın günü ortalaması × aylık sezon endeksi × sezondan arındırılmış trend. Daha güçlü bir modele (ör. SARIMA) geçiş yalnızca bu dosyanın export ettiği fonksiyon değiştirilerek yapılır.
- **Haftalık rapor:** [/api/cron/weekly-report](app/api/cron/weekly-report/route.ts), `Authorization: Bearer CRON_SECRET` ile çağrılır (Vercel Cron zamanlaması [vercel.json](vercel.json) içinde) ve Resend üzerinden gönderir.

## Katkı kuralları

Kurallar [Hooks/GIT_PUSH_RULES.md](Hooks/GIT_PUSH_RULES.md) ve [Hooks/COMPATIBILITY_RULES.md](Hooks/COMPATIBILITY_RULES.md) dosyalarındadır. Özet: master'a doğrudan push yok (`feature/*`, `fix/*`, `chore/*` branch + PR), Conventional Commits, atomik commit, sır asla commit edilmez, `.env.example` güncel tutulur.
