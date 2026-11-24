# Copies the game to the GitHub Pages repo (with doctype, charset and phone viewport), commits and pushes. Arg 1: commit message.
cd "$(dirname "$0")/../joc-repo" && { printf '<!doctype html><html lang="ca"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'; cat ../joc/joc-bestioles.html; } > index.html && git add index.html && git commit -q -m "$1

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01HWEPpLbew7DVBocsMZjsZA" && git push -q
