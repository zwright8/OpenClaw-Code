#!/usr/bin/env bash
set -euo pipefail

echo 'Skill: b04-media-image-audio-video'
echo 'Checking mapped command availability...'

items=(
  'gphoto2|gphoto2'
  'openimageio|openimageio'
  'viu|viu'
  'mplayer|mplayer'
  'cava|cava'
  'pulseaudio|pulseaudio'
  'ffmpeg@7|ffmpeg'
  'gmic|gmic'
  'kew|kew'
  'vhs|vhs'
  'cmus|cmus'
  'svtplay-dl|svtplay-dl'
  'theora|theora'
  'audacious|audacious'
  'mediamtx|mediamtx'
  'ncspot|ncspot'
  'immich-cli|immich-cli'
  'instaloader|instaloader'
  'timg|timg'
  'bchunk|bchunk'
  'feh|feh'
  'lame|lame'
  'agg|agg'
  'manim|manim'
  'lilypond|lilypond'
)
found=0
missing=0
for item in "${items[@]}"; do
  tool=${item%%|*}
  cmd=${item##*|}
  if command -v "$cmd" >/dev/null 2>&1; then
    printf '[FOUND]   %-28s -> %-16s (%s)\n' "$tool" "$cmd" "$(command -v "$cmd")"
    found=$((found+1))
  else
    printf '[MISSING] %-28s -> %s\n' "$tool" "$cmd"
    missing=$((missing+1))
  fi
done

echo
echo "Found mappings: $found"
echo "Missing mappings: $missing"
