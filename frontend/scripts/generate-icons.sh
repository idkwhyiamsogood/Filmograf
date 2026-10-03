#!/usr/bin/env bash
# Иконки приложения из SVG-исходников assets/icon → Android (mipmap) и сайт (public).
# Нужны rsvg-convert (librsvg) и python3 + Pillow (для favicon.ico).
# Запуск: bun run icons
set -euo pipefail
cd "$(dirname "$0")/.."

SRC=assets/icon
RES=android/app/src/main/res
PUB=public
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

render() { rsvg-convert -w "$2" -h "$2" "$1" -o "$3"; }

# Круглая версия для ic_launcher_round
sed 's|<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">|&<clipPath id="c"><circle cx="512" cy="512" r="512"/></clipPath><g clip-path="url(#c)">|; s|</svg>|</g></svg>|' \
  "$SRC/icon.svg" > "$TMP/icon-round.svg"

# Adaptive icon: лаунчер показывает только центральные 72dp из 108dp, поэтому
# рисунок ужимаем до этой зоны (иначе F раздувается, пятна обрезаются).
# Поля фона заливаем тем же тёмным цветом.
adaptive_svg() { # $1 — исходник, $2 — результат, $3 — заливка полей (или none)
  python3 - "$1" "$2" "$3" <<'PY'
import sys
src, out, fill = sys.argv[1:4]
s = open(src).read()
head, body = s.split(">", 1)
body = body.rsplit("</svg>", 1)[0]
pad = f'<rect width="1024" height="1024" fill="{fill}"/>' if fill != "none" else ""
open(out, "w").write(f'{head}>{pad}<g transform="translate(512 512) scale({72/108:.4f}) translate(-512 -512)">{body}</g></svg>')
PY
}
adaptive_svg "$SRC/icon-foreground.svg" "$TMP/adaptive-fg.svg" none
adaptive_svg "$SRC/icon-background.svg" "$TMP/adaptive-bg.svg" "#16130F"

# Android: adaptive (108dp) + legacy (48dp)
for pair in mdpi:1 hdpi:1.5 xhdpi:2 xxhdpi:3 xxxhdpi:4; do
  d=${pair%%:*}; k=${pair##*:}
  adaptive=$(python3 -c "print(round(108*$k))")
  legacy=$(python3 -c "print(round(48*$k))")
  dir="$RES/mipmap-$d"
  render "$TMP/adaptive-fg.svg" "$adaptive" "$dir/ic_launcher_foreground.png"
  render "$TMP/adaptive-bg.svg" "$adaptive" "$dir/ic_launcher_background.png"
  render "$SRC/icon-rounded.svg" "$legacy" "$dir/ic_launcher.png"
  render "$TMP/icon-round.svg" "$legacy" "$dir/ic_launcher_round.png"
done

# Сайт / PWA
cp "$SRC/icon-rounded.svg" "$PUB/favicon.svg"
render "$SRC/icon.svg" 180 "$PUB/apple-touch-icon.png"          # iOS скругляет сам
render "$SRC/icon-rounded.svg" 192 "$PUB/icon-192.png"
render "$SRC/icon-rounded.svg" 512 "$PUB/icon-512.png"
render "$SRC/icon.svg" 512 "$PUB/icon-maskable-512.png"         # во весь квадрат — маску задаёт ОС
for s in 16 32 48; do render "$SRC/icon-rounded.svg" $s "$TMP/f$s.png"; done
python3 - "$TMP" "$PUB/favicon.ico" <<'PY'
import sys
from PIL import Image
tmp, out = sys.argv[1], sys.argv[2]
imgs = [Image.open(f"{tmp}/f{s}.png") for s in (48, 32, 16)]
imgs[0].save(out, sizes=[(48, 48), (32, 32), (16, 16)], append_images=imgs[1:])
PY

echo "Иконки обновлены: $RES/mipmap-*, $PUB"
