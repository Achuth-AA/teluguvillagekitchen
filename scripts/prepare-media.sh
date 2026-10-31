#!/usr/bin/env bash
# Rebuilds every web asset from the source video.
# Usage: npm run media            (uses source-media/hero-original.mp4)
#        bash scripts/prepare-media.sh path/to/new-video.mp4
#
# Produces: public/media/hero-video.mp4 (16:9, ≤5MB), hero-video-mobile.mp4 (9:16),
# poster.webp (4s frame), poster-mobile.webp, gallery/*.webp, dishes/*.webp,
# source-media/og-base.jpg (final frame for the OG image).
set -euo pipefail
cd "$(dirname "$0")/.."

SRC="${1:-source-media/hero-original.mp4}"
OUT=public/media
mkdir -p "$OUT/gallery" "$OUT/dishes"

# The generated film has a garbled pseudo-text artifact at the top of its last 6 seconds.
# delogo paints it out. Remove/adjust CLEAN if you swap in a different video.
CLEAN="delogo=x=505:y=68:w=270:h=64"
CLEAN_LATE="$CLEAN:enable='gte(t,9.0)'"

ffmpeg -v error -y -i "$SRC" -vf "$CLEAN_LATE" -c:v libx264 -preset slow -crf 27 -maxrate 2200k -bufsize 4400k \
  -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 96k "$OUT/hero-video.mp4"
ffmpeg -v error -y -i "$SRC" -vf "$CLEAN_LATE,crop=ih*9/16:ih,scale=540:960" -c:v libx264 -preset slow -crf 28 -maxrate 1500k \
  -bufsize 3000k -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 96k "$OUT/hero-video-mobile.mp4"

ffmpeg -v error -y -ss 4 -i "$SRC" -frames:v 1 -vf scale=1280:-2 -c:v libwebp -quality 72 "$OUT/poster.webp"
ffmpeg -v error -y -ss 4 -i "$SRC" -frames:v 1 -vf "crop=ih*9/16:ih,scale=540:960" -c:v libwebp -quality 72 "$OUT/poster-mobile.webp"
ffmpeg -v error -y -ss 14.9 -i "$SRC" -frames:v 1 -vf "$CLEAN,scale=1200:630:force_original_aspect_ratio=increase,crop=1200:630" -q:v 3 source-media/og-base.jpg

for t in 1 2.5 4.5 5.5 6.5 7.5 8.5; do
  ffmpeg -v error -y -ss "$t" -i "$SRC" -frames:v 1 -vf scale=960:-2 -c:v libwebp -quality 70 "$OUT/gallery/f-$t.webp"
done
for t in 10 11.5 13 14.5; do
  ffmpeg -v error -y -ss "$t" -i "$SRC" -frames:v 1 -vf "$CLEAN,scale=960:-2" -c:v libwebp -quality 70 "$OUT/gallery/f-$t.webp"
done

# Square dish close-ups: crop <time> <centerX> <centerY> <size> <name>
crop() { ffmpeg -v error -y -ss "$1" -i "$SRC" -frames:v 1 -vf "crop=$4:$4:$(( $2 - $4/2 )):$(( $3 - $4/2 )),scale=360:360" -c:v libwebp -quality 74 "$OUT/dishes/$5.webp"; }
crop 6.8 640 400 300 rice
crop 5.5 430 420 280 gongura
crop 6.5 650 400 240 ghee
crop 8.0 790 330 320 pappu
crop 9.0 600 330 520 chicken
crop 13 222 478 130 buttermilk
crop 13 900 440 120 appadam

ls -la "$OUT"/*.mp4
ffmpeg -v error -y -ss 12 -i "$SRC" -frames:v 1 -vf "crop=640:560:0:160,scale=800:-2" -c:v libwebp -quality 74 "$OUT/veg-meal.webp"

echo "Done. Re-render the share image with: node scripts/make-og.cjs"
