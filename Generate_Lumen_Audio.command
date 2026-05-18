#!/bin/zsh
cd "$(dirname "$0")"
node tools/generate_lumen_audio.js
echo ""
echo "Done. WAV saved in exports/audio/"
echo "Press any key to close this window."
read -k 1
