# pk-validators — Pakistani CNIC, Mobile, NTN & IBAN Validation

A small, dependency-free JavaScript library for the four fields every
Pakistani form needs — plus a premium demo website to try it live.
No API key, no backend, no external libraries. Works from `file://`
and on GitHub Pages.

## Why this exists

Every Pakistani form needs the same checks, and developers usually
copy-paste a regex each time — often a wrong one. This library gives
one tested answer for each field, with plain-language errors,
formatting, operator detection, and a real IBAN checksum.

## Use it

```html
<script src="validators.js"></script>
<script>
  const V = window.PKValidators;
</script>
```

Or in Node:

```js
const V = require('./validators.js');
```

### CNIC — 13 digits

```js
V.isCNIC('35202-1234567-1');      // true
V.isCNIC('3520212345671');         // true (dashes optional)
V.formatCNIC('3520212345671');     // '35202-1234567-1'
V.parseCNIC('35202-1234567-1');
// { digits, formatted, firstPart, serialPart, lastDigit,
//   genderHint: 'Male' }  // hint only, see below
```

### Mobile — 03XX-XXXXXXX, with operator detection

```js
V.isPakMobile('03001234567');      // true
V.formatMobile('03001234567');     // '0300-1234567'
V.getOperator('03001234567');      // 'Jazz'
V.getOperator('03151234567');      // 'Zong'
V.getOperator('03451234567');      // 'Telenor'
V.getOperator('03331234567');      // 'Ufone'
V.getOperator('03551234567');      // 'SCOM'
V.getOperator('03991234567');      // 'Unknown' — never guessed
```

Operator prefixes used (commonly published 4-digit prefixes):

| Operator | Prefixes |
|---|---|
| Jazz | 0300–0309, 0321–0324 |
| Zong | 0310–0319 |
| Telenor | 0340–0349 |
| Ufone | 0330–0339 |
| SCOM | 0355 |

**Prefix tables change over time** (new series are issued, operators
merge). Update `OPERATOR_PREFIXES` in `validators.js` when that
happens. An unlisted prefix returns `'Unknown'`, never a guess.

### NTN — 7 digits, optional suffix

```js
V.isNTN('1234567');     // true
V.isNTN('1234567-8');   // true
V.formatNTN('12345678'); // '1234567-8'
```

### IBAN — Pakistan, 24 characters, real MOD-97 checksum

```js
V.isPakIBAN('PK36SCBL0000001123456702');  // true
V.isPakIBAN('PK37SCBL0000001123456702');  // false — checksum fails
V.formatIBAN('PK36SCBL0000001123456702');
// 'PK36 SCBL 0000 0011 2345 6702'
V.validateIBAN('PK36SCBL0000001123456702');
// { valid: true, formatted, bankCode: 'SCBL', checkDigits: '36' }
```

Format: `PK` + 2 check digits + 4-letter bank code + 16 digits
= 24 characters. The checksum follows ISO 13616 MOD-97: move the
first 4 characters to the end, convert letters (A=10 … Z=35),
and the remainder mod 97 must be 1.

### Detailed results and errors

Every validator also has a detailed form that returns a
plain-language reason on failure, for example:

```js
V.validateCNIC('123');
// { valid: false, error: 'CNIC 13 digits ka hona chahiye, abhi 3 digits hain.' }
V.validateIBAN('PK37SCBL0000001123456702');
// { valid: false, error: 'IBAN checksum ghalat hai (MOD-97 check fail)...' }
```

Other helpers: `cleanInput`, `cleanDigits`, `cleanIBAN`,
`validateCNIC`, `validateMobile`, `validateNTN`, `validateIBAN`.

## Demo website

Open `index.html` directly, or:

```bash
cd pk-validators
python3 -m http.server 8000
# open http://localhost:8000
```

Four validator cards with live validation, Format buttons,
valid/invalid examples, operator table, and a copyable code
snippet for each validator.

## Screenshots

### Main demo

![pk-validators demo](docs/screenshots/validators.png)

### CNIC card

![pk-validators CNIC](docs/screenshots/cnic.png)

### IBAN card

![pk-validators IBAN](docs/screenshots/iban.png)

## Honest limitations — please read

- **CNIC and NTN validation is FORMAT-ONLY.** It checks length,
  digits, dashes and shape. It does **NOT** verify a real person
  or business against NADRA or FBR, because that data is not
  public and no offline library can check it. A correctly
  formatted number is not proof that it belongs to anyone.
- **CNIC gender is a hint only.** By convention the last digit
  is odd for male and even for female. The library labels this
  as a hint, never as a verified fact.
- **IBAN checksum is a real mathematical check**, and it will
  catch a mistyped check digit. It does **not** prove the
  account exists or belongs to anyone.
- **Mobile prefixes change.** See the table above; keep it updated.

## Files

- `validators.js` — the library (browser + Node)
- `data.js` — demo examples, snippets, operator table
- `app.js` — demo website logic
- `index.html`, `styles.css` — demo website
- `test-validators.js` — Node tests (42 cases)
- `TESTING.md` — test results
- `docs/screenshots/` — screenshots of the running demo

## GitHub

Code is pushed to `Ali-Raza-161/pk-validators` on the main branch.
GitHub Pages is **not** enabled yet — to make the demo live, enable
it in Settings > Pages, deploy from the main branch, /(root).
