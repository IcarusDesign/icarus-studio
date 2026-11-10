#!/bin/sh
# Publica o site: atualiza o número de versão (para os navegadores
# carregarem logo os ficheiros novos) e envia tudo para o GitHub.
# Uso:  ./publicar.sh "mensagem opcional"
cd "$(dirname "$0")" || exit 1
V=$(date +%Y%m%d%H%M)
sed -i '' -E "s#href=\"styles.css(\?v=[0-9]+)?\"#href=\"styles.css?v=$V\"#; s#src=\"(products|pagamento|app).js(\?v=[0-9]+)?\"#src=\"\1.js?v=$V\"#g" index.html
git pull -q --ff-only
git add -A
git commit -q -m "${1:-Atualiza site}" && git push -q && echo "Publicado! O site atualiza em ~1 minuto."
