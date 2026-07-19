# Ortak kontrol fonksiyonlari.
# Bu dosya tek basina calismaz; Hooks/pre-push ve Hooks/post-commit tarafindan
# "source" edilir (bkz. Hooks/README.md).

run_lint() {
  echo "-> eslint (npm run lint)"
  npm run --silent lint
}

run_typecheck() {
  echo "-> tsc --noEmit (npm run type-check)"
  npm run --silent type-check
}

run_tests() {
  echo "-> vitest (npm test)"
  npm run --silent test
}

run_build() {
  echo "-> next build (npm run build)"
  npm run --silent build
}

# Bagimlilik/uyumluluk kontrolu: eksik veya cakisan peer dependency var mi?
# Bu kontrol commit/push'u durdurmaz, sadece uyari basar.
run_dependency_check() {
  echo "-> npm ls (peer dependency / surum cakismasi kontrolu)"
  if ! npm ls --all >/tmp/otellio-npm-ls.$$ 2>&1; then
    echo "   UYARI: npm ls uyumsuz veya eksik bagimlilik bildirdi."
    echo "   Detay icin: npm ls --all"
  fi
  rm -f /tmp/otellio-npm-ls.$$
}

# .env.example gercekten kullanilan degiskenlerle senkron mu, kaba bir kontrol.
# Yeni bir env degiskeni kodda kullanilip .env.example'a eklenmemisse uyarir.
run_env_sync_check() {
  echo "-> .env.example senkron kontrolu"
  if [ ! -f .env.example ]; then
    return 0
  fi
  used_vars=$(grep -rhoE "process\.env\.[A-Z0-9_]+" app lib components 2>/dev/null | sed -E 's/process\.env\.//' | sort -u)
  missing=""
  for var in $used_vars; do
    if ! grep -q "^${var}=" .env.example 2>/dev/null; then
      missing="$missing $var"
    fi
  done
  if [ -n "$missing" ]; then
    echo "   UYARI: Kodda kullanilan ama .env.example icinde olmayan degiskenler:$missing"
  fi
}
