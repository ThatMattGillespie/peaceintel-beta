#!/bin/sh
# Export the two use case documents as print-ready Letter PDFs, two pages each,
# fonts embedded.
#
# Needs the local preview server running from the repo root:
#   python3 -m http.server 8787 --bind 127.0.0.1
# Usage (from anywhere):
#   sh "Resources/UseCases/export-pdf.sh"
#
# ?print=1|2 isolates one document so each exports on its own. The virtual time
# budget gives Nanum Myeongjo, Space Mono and DIN 2014 time to load before
# Chrome renders; without it the pages export in the fallback face and every
# line break moves.
#
# archive-abc/ holds the one-page A/B/C comparison exported on 2026-09-16, which
# pairs with use-cases-directions.html. Direction A won and became this file.

OUTDIR="$(cd "$(dirname "$0")" && pwd)"

set -- "1:ConflictResolution" "2:ConflictPrevention"
for PAIR in "$@"; do
  S="${PAIR%%:*}"; NAME="${PAIR#*:}"
  OUT="$OUTDIR/PeaceIntel-UseCases-$NAME.pdf"
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    --headless=new --disable-gpu --no-pdf-header-footer \
    --virtual-time-budget=10000 \
    --print-to-pdf="$OUT" \
    "http://127.0.0.1:8787/use-cases.html?print=$S" 2>/dev/null
  echo "$OUT"
done
