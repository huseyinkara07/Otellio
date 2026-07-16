# Proje Ici Uyumluluk Kurallari

Bu kurallar, projede (Next.js 15 + React 19 + TypeScript + Tailwind) zamanla
ortaya cikabilecek uyumluluk/versiyon problemlerini onlemek veya erken
yakalamak icin. `Hooks/post-commit` her commit'ten sonra bir kismini otomatik
kontrol eder (bkz. [README.md](README.md)).

## 1. Bagimlilik (dependency) surumleri

- Yeni bir paket eklerken once `npm ls --all` ile mevcut peer dependency
  agacinda catisma olup olmadigina bakilir.
- `package.json` ve `package-lock.json` **birlikte** commit'lenir; biri
  guncellenip digeri unutulmaz.
- Major surum yukseltmeleri (orn. Next.js 15 -> 16, React 19 -> 20) ayri bir
  commit/branch'te yapilir, ayni commit icinde feature degisikligiyle
  karistirilmaz.
- `engines` alaninda belirtilen Node.js surumu (varsa) yerel gelistirme
  ortamiyla eslesmeli; eslesmiyorsa once o duzeltilir.

## 2. TypeScript / ESLint tutarliligi

- `tsconfig.json` icindeki `strict: true` kapatilmaz. Tip hatalarini
  `// @ts-ignore` ile gizlemek yerine kok neden duzeltilir.
- `any` tipi sadece gercekten kacinilmazsa ve neden gerektigi bir yorumla
  belirtilerek kullanilir.
- ESLint kurallari (`eslint.config.mjs`, `next/core-web-vitals`) proje
  genelinde gecerlidir; dosya bazinda `eslint-disable` sadece gerekcesiyle
  birlikte kullanilir.

## 3. Ortam degiskenleri (.env)

- Kodda kullanilan her `process.env.X` degiskeni `.env.example` icinde
  (deger olmadan, sadece isim/aciklama olarak) yer alir.
- `.env.example` guncel tutulur; yeni bir entegrasyon (bkz. PRD Bolum 8-B)
  eklendiginde gerekli degiskenler oraya eklenir.
- Gercek degerler (`.env`, `.env.local`) asla commit'lenmez.

## 4. App Router / dosya yapisi

- `app/` klasoru altinda Next.js App Router kurallarina uyulur (`page.tsx`,
  `layout.tsx`, `loading.tsx` vb. isimlendirmeler degistirilmez).
- `@/*` path alias'i (`tsconfig.json`) tum importlarda tutarli kullanilir;
  goreli (`../../..`) ve alias importlar karistirilmaz.

## 5. Stil / Tailwind tutarliligi

- `tailwind.config.ts` icindeki tema degerleri (renk, spacing vb.) disinda
  komponentlerde "sihirli" (hardcoded) deger kullanilmaz; tema genisletilir.
- Yeni bir tasarim tokeni gerekiyorsa once `tailwind.config.ts`'e eklenir,
  sonra komponentlerde kullanilir.

## 6. Otomatik kontrol edilenler (post-commit)

`Hooks/post-commit` her commit sonrasi su kontrolleri **bilgilendirme
amacli** (commit'i durdurmadan) calistirir:

- `npm run lint`
- `npm run type-check`
- `npm ls --all` (bagimlilik/peer dependency uyumsuzlugu)
- Kodda kullanilan `process.env.*` degiskenlerinin `.env.example` ile
  senkronu

Bu uyarilar cikarsa, bir sonraki commit'ten once (en gec push'tan once)
duzeltilmelidir; `pre-push` zaten lint/type-check/build hatalarinda push'u
engeller.
