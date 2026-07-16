# Hooks

Bu klasor, `.git/hooks` yerine version-control'e dahil edilebilen git hook'larini
icerir (`.git/hooks` repo ile birlikte push edilmez, bu yuzden script'ler
buraya konup git'e `core.hooksPath` ile gosterilir).

## Kurulum (tek seferlik, her klonda calistirilir)

PowerShell:

```powershell
.\Hooks\install.ps1
```

veya Git Bash:

```sh
sh Hooks/install.sh
```

Bu, sunu yapar: `git config core.hooksPath Hooks`

## Icerik

| Dosya | Ne zaman calisir | Ne yapar |
|---|---|---|
| `pre-push` | `git push` oncesi | lint + type-check + build calistirir. Biri basarisiz olursa **push'u engeller**. |
| `post-commit` | her `git commit` sonrasi | lint + type-check + bagimlilik/env senkron kontrolu calistirir. Sonuc sadece **uyari** basar, commit'i etkilemez. |
| `lib/checks.sh` | - | Yukaridaki iki hook'un paylastigi ortak fonksiyonlar. |
| `install.ps1` / `install.sh` | bir kere | `core.hooksPath` ayarlar. |
| `GIT_PUSH_RULES.md` | - | GitHub'a push/commit/branch kurallari. |
| `COMPATIBILITY_RULES.md` | - | Projedeki uyumluluk problemlerini onlemek/cozmek icin kurallar. |

## Neden pre-push + post-commit birlikte?

- `post-commit` her commit'ten hemen sonra calisir ve sorunlari **erken**
  gosterir, ama commit'i geri alamayacagi icin (git bu hook'un exit kodunu
  yok sayar) sadece bilgilendirir.
- `pre-push` GitHub'a gitmeden hemen once calisir ve gercek bir engel
  gorevi gorur: lint, type-check veya build basarisiz olursa push durur.

Boylece hem "surekli" geri bildirim (her commit'te) hem de push oncesi kesin
bir kalite kapisi saglanmis olur.

## Kontrolleri gecici atlamak

Gercek bir zorunluluk varsa: `git push --no-verify`. Sebebini commit/PR
aciklamasinda belirtin (bkz. `GIT_PUSH_RULES.md`).
