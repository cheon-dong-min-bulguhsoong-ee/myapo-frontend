# Fonts

The design system loads web fonts from CDN (no local TTF files needed):

- **Pretendard Variable** — `https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css`
- **Work Sans** — `https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700&display=swap`

Both are imported inside `typography.css`.

## Offline / bundled use

If you need offline fonts:

1. Download Pretendard Variable from https://github.com/orioncactus/pretendard/releases (`PretendardVariable.woff2`)
2. Download Work Sans from https://fonts.google.com/specimen/Work+Sans
3. Place under `fonts/`
4. Replace the `@import url(…)` lines in `typography.css` with local `@font-face` declarations.

## ⚠️ No font substitution required

Both Pretendard and Work Sans are the exact families the source design system specifies. No stand-ins were needed.
