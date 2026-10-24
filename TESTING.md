# pk-validators — Testing

## Node checks — PASS

- `node --check validators.js` — PASS
- `node --check app.js` — PASS
- `node --check data.js` — PASS

## Node unit tests — 42 passed, 0 failed

Run: `node test-validators.js`

Coverage (42 cases):
- CNIC: valid dashed/plain, invalid short/letters/empty, formatting,
  format-invalid returns null, gender hint odd/even, detailed error.
- Mobile: valid Jazz/dashed, invalid short/wrong-start/letters,
  formatting, operator detection for Jazz (0300, 0321), Zong (0315),
  Telenor (0345), Ufone (0333), SCOM (0355), Unknown (0399).
- NTN: valid 7-digit, valid suffix, invalid short/letters,
  formatting plain and suffix.
- IBAN: valid SCBL (PK36…) and HABB (PK29…) with MOD-97,
  valid with spaces, checksum fail on changed check digit and on
  changed last digit, wrong country, short format, grouped
  formatting, bank code extraction, mod97(valid) = 1.
- Edge cases: cleanInput trimming, empty mobile/IBAN invalid.

One bug found and fixed during testing: `formatNTN('12345678')`
initially returned null because `isNTN` only accepted the dashed
suffix form. `formatNTN` now also formats a plain 8-digit input
as `1234567-8`. All 42 tests pass after the fix.

## Playwright UI tests — PASS

Headless Chromium, served from `file://`, viewport 1400×900:
- CNIC card: valid example validates, shows formatted
  `35202-1234567-1` and gender hint.
- Mobile card: valid example validates, shows formatted
  `0300-1234567` and operator Jazz.
- NTN card: valid example validates, shows formatted `1234567-8`.
- IBAN card: valid example validates, shows grouped format and
  bank code SCBL.
- Invalid CNIC (`35202-12345-1`) shows an error state, not a
  false valid result.

## Screenshots — visually inspected

- `docs/screenshots/validators.png` (1400×900) — hero, green
  premium theme, CNIC + Mobile cards in valid state.
- `docs/screenshots/cnic.png` (1400×900) — all four cards in
  valid state, including IBAN grouped format.
- `docs/screenshots/iban.png` (1400×900) — IBAN card in valid
  state plus the valid/invalid examples section.

Fixes made after visual inspection: removed a flag emoji that
rendered as a box in headless Chromium, fixed a duplicated
gender-hint label, fixed the logo badge text colour (a CSS
selector was overriding it), and offset scrolled screenshots
so the sticky header does not cover card titles.

## How the testing screenshots were made

Screenshots are real captures of the running demo in headless
Chromium, not generated art. No live screen recording was made
for this project.
