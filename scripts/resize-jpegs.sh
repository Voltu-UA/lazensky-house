#!/usr/bin/env bash
set -euo pipefail

# Resize/compress JPEG images in-place (or to another folder).
#
# Requirements:
# - ImageMagick (`magick`) installed on your machine.
#
# Example:
#   ./scripts/resize-jpegs.sh \
#     --input "public/images/out-*.jpg" \
#     --max 1920 \
#     --quality 78 \
#     --strip
#
# Safe mode with output folder:
#   ./scripts/resize-jpegs.sh \
#     --input "public/images/out-*.jpg" \
#     --output "public/images-optimized" \
#     --max 1920 \
#     --quality 78 \
#     --strip

INPUT_GLOB=""
OUTPUT_DIR=""
MAX_DIM=1920
QUALITY=78
STRIP_METADATA=0

print_help() {
  cat <<'EOF'
Usage: resize-jpegs.sh --input "<glob>" [options]

Required:
  --input "<glob>"      Input files glob, e.g. public/images/out-*.jpg

Optional:
  --output "<dir>"      Output directory. If omitted, files are overwritten.
  --max <number>        Max width/height in px (default: 1920)
  --quality <0-100>     JPEG quality (default: 78)
  --strip               Remove EXIF/metadata
  -h, --help            Show help
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --input)
      INPUT_GLOB="${2:-}"
      shift 2
      ;;
    --output)
      OUTPUT_DIR="${2:-}"
      shift 2
      ;;
    --max)
      MAX_DIM="${2:-}"
      shift 2
      ;;
    --quality)
      QUALITY="${2:-}"
      shift 2
      ;;
    --strip)
      STRIP_METADATA=1
      shift
      ;;
    -h|--help)
      print_help
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      print_help
      exit 1
      ;;
  esac
done

if [[ -z "$INPUT_GLOB" ]]; then
  echo "Error: --input is required." >&2
  print_help
  exit 1
fi

IM_CMD=""
if command -v magick >/dev/null 2>&1; then
  IM_CMD="magick"
elif command -v convert >/dev/null 2>&1; then
  IM_CMD="convert"
else
  echo "Error: neither 'magick' nor 'convert' found. Install ImageMagick first." >&2
  exit 1
fi

shopt -s nullglob
files=( $INPUT_GLOB )
shopt -u nullglob

if [[ ${#files[@]} -eq 0 ]]; then
  echo "No files matched: $INPUT_GLOB" >&2
  exit 1
fi

if [[ -n "$OUTPUT_DIR" ]]; then
  mkdir -p "$OUTPUT_DIR"
fi

echo "Processing ${#files[@]} files..."
echo "Max dimension: ${MAX_DIM}px, quality: ${QUALITY}, strip metadata: ${STRIP_METADATA}"

before_total=0
after_total=0

for src in "${files[@]}"; do
  base="$(basename "$src")"
  dst="$src"
  if [[ -n "$OUTPUT_DIR" ]]; then
    dst="${OUTPUT_DIR%/}/$base"
  fi

  before_size="$(wc -c < "$src")"
  before_total=$((before_total + before_size))

  cmd=("$IM_CMD" "$src" -auto-orient -resize "${MAX_DIM}x${MAX_DIM}>" -quality "$QUALITY")
  if [[ $STRIP_METADATA -eq 1 ]]; then
    cmd+=(-strip)
  fi
  cmd+=("$dst")
  "${cmd[@]}"

  after_size="$(wc -c < "$dst")"
  after_total=$((after_total + after_size))
  printf "%s -> %s (%.2f MB -> %.2f MB)\n" \
    "$src" "$dst" \
    "$(awk "BEGIN {print $before_size/1024/1024}")" \
    "$(awk "BEGIN {print $after_size/1024/1024}")"
done

echo "-----"
printf "Total: %.2f MB -> %.2f MB\n" \
  "$(awk "BEGIN {print $before_total/1024/1024}")" \
  "$(awk "BEGIN {print $after_total/1024/1024}")"
