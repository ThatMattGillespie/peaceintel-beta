#!/bin/sh
# Export one postcard direction (front + back) from postcard.html as a two-page,
# print-ready PDF: 6.25 x 4.25 in per page (6 x 4 in trim + 0.125 in bleed), fonts embedded.
#
# Needs the local preview server running from the repo root:
#   python3 -m http.server 8787 --bind 127.0.0.1
# Usage (from anywhere):
#   sh "Resources/Postcard/export-pdf.sh" c      # a, b or c; defaults to c
#
# The ?print= switch in postcard.html hides the other directions. The virtual time
# budget gives the web fonts time to load before Chrome renders the pages.

DIR=${1:-c}
OUT="$(cd "$(dirname "$0")" && pwd)/PeaceIntel-AfP-Postcard-$(echo "$DIR" | tr a-z A-Z)-6x4-bleed.pdf"

"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --no-pdf-header-footer \
  --virtual-time-budget=10000 \
  --print-to-pdf="$OUT" \
  "http://127.0.0.1:8787/postcard.html?print=$DIR" 2>/dev/null

echo "$OUT"
