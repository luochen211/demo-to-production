#!/usr/bin/env bash
# Render one film: a 1x master into out/, then picture, voice and music sped up
# together to 1.2x into docs/public/book/<id>.mp4.
#   ./render.sh <film-id>
set -euo pipefail
cd "$(dirname "$0")"
id="$1"
mkdir -p out
./node_modules/.bin/remotion render "films/$id/index.jsx" "$id" "out/$id-1x.mp4" --scale 1.5 --crf 16
ffmpeg -y -loglevel error -i "out/$id-1x.mp4" \
  -filter_complex "[0:v]setpts=PTS/1.2[v];[0:a]atempo=1.2[a]" -map "[v]" -map "[a]" \
  -r 30 -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart \
  "../docs/public/book/$id.mp4"
echo "wrote docs/public/book/$id.mp4"
