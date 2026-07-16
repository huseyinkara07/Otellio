#!/bin/sh
# Bu repo'yu klonlayan herkesin Hooks/ klasorundeki script'leri kullanmasini
# saglar (varsayilan .git/hooks yerine). Bir kere calistirmak yeterli.
git config core.hooksPath Hooks
echo "core.hooksPath 'Hooks' olarak ayarlandi. pre-push ve post-commit artik aktif."
