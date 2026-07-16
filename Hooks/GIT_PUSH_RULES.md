# GitHub'a Push Kurallari

Bu depoda GitHub'a push atmadan once ve commit atarken uyulmasi gereken kurallar.
Otomatik kontroller `Hooks/pre-push` ve `Hooks/post-commit` tarafindan uygulanir
(kurulum icin bkz. [README.md](README.md)).

## 1. Push engelleri (otomatik, `pre-push`)

Asagidakilerden biri basarisiz olursa push otomatik olarak durur:

- `npm run lint` hatasiz gecmeli.
- `npm run type-check` (`tsc --noEmit`) hatasiz gecmeli.
- `npm run build` basarili olmali.

Bu kontrolleri atlamak icin `git push --no-verify` kullanilabilir ama **sadece
gercek bir acil durumda ve bilerek** kullanilmali; normal akiste kullanilmamali.

## 2. Commit ve branch kurallari

- **main / master dogrudan push edilmez.** Degisiklikler `feature/*`, `fix/*`
  veya `chore/*` gibi bir branch'te yapilir, gerekirse PR ile birlestirilir.
- **Commit mesajlari** [Conventional Commits](https://www.conventionalcommits.org/)
  formatinda yazilir: `feat: ...`, `fix: ...`, `chore: ...`, `docs: ...`,
  `refactor: ...`, `test: ...`.
- Bir commit tek bir mantiksal degisikligi icermeli (atomic commit). Alakasiz
  degisiklikler ayri commit'lere bolunmeli.
- Force-push (`git push --force`) sadece kendi feature branch'inde ve gerekcesi
  acikca biliniyorsa kullanilir. `main` uzerinde **kesinlikle** force-push
  yapilmaz.

## 3. Gizli/istenmeyen dosyalar

- `.env`, `.env.local`, `node_modules`, `.next`, `*.log` gibi dosyalar
  `.gitignore` icinde tanimlidir; bunlarin yanlislikla stage edilip
  edilmedigi `git status` ile push'tan once kontrol edilir.
- API anahtari, token, sifre gibi degerler asla dogrudan kod veya commit
  mesaji icine yazilmaz; `.env.example` icinde sadece placeholder / aciklama
  bulunur.

## 4. PR / merge (uzak repo GitHub uzerinde ise)

- `main`'e giden her degisiklik bir Pull Request uzerinden gecer.
- PR aciklamasinda ne degisti ve neden degisti kisaca belirtilir.
- Mumkunse merge etmeden once CI/pre-push kontrolleri yesil olmali.

## 5. Kurallari atlama

Herhangi bir kontrolun bilerek atlanmasi gerekiyorsa (`--no-verify` gibi),
bunun nedeni commit mesajinda veya PR aciklamasinda belirtilir.
