/* pk-validators — Pakistani ID and number validation.
 * Plain JavaScript, no dependencies. Works in the browser (window.PKValidators)
 * and in Node (module.exports). FORMAT-ONLY for CNIC/NTN: see README. */
(function (root) {
  'use strict';

  function cleanDigits(value) {
    return String(value == null ? '' : value).replace(/[\s-]/g, '');
  }
  function cleanIBAN(value) {
    return String(value == null ? '' : value).replace(/[\s-]/g, '').toUpperCase();
  }
  function cleanInput(value) {
    return String(value == null ? '' : value).trim();
  }

  // ---------------- CNIC ----------------
  // 13 digits, written as 35202-1234567-1 or 3520212345671.
  function isCNIC(value) {
    var raw = cleanInput(value);
    if (!raw) return false;
    if (!/^\d{5}-\d{7}-\d$/.test(raw) && !/^\d{13}$/.test(raw)) return false;
    return /^\d{13}$/.test(cleanDigits(raw));
  }
  function formatCNIC(value) {
    var d = cleanDigits(value);
    if (!/^\d{13}$/.test(d)) return null;
    return d.slice(0, 5) + '-' + d.slice(5, 12) + '-' + d.slice(12);
  }
  function parseCNIC(value) {
    if (!isCNIC(value)) return null;
    var d = cleanDigits(value);
    var last = parseInt(d.slice(12), 10);
    return {
      digits: d,
      formatted: formatCNIC(d),
      firstPart: d.slice(0, 5),
      serialPart: d.slice(5, 12),
      lastDigit: d.slice(12),
      // Hint only, from the last digit convention: odd = male, even = female.
      // This is NOT a verified identity fact.
      genderHint: last % 2 === 1 ? 'Male' : 'Female'
    };
  }
  function validateCNIC(value) {
    var raw = cleanInput(value);
    if (!raw) return { valid: false, error: 'CNIC khali hai. 13 digits likhen.' };
    var d = cleanDigits(raw);
    if (/[^0-9\s-]/.test(raw)) return { valid: false, error: 'CNIC me sirf digits aur dashes hone chahiye.' };
    if (d.length !== 13) return { valid: false, error: 'CNIC 13 digits ka hona chahiye, abhi ' + d.length + ' digits hain.' };
    if (!/^\d{13}$/.test(d)) return { valid: false, error: 'CNIC ka format ghalat hai.' };
    var p = parseCNIC(d);
    return { valid: true, formatted: p.formatted, genderHint: p.genderHint, digits: d };
  }

  // ---------------- Mobile ----------------
  // 11 digits, starts with 03. Prefix table: 4-digit prefixes.
  var OPERATOR_PREFIXES = [
    { operator: 'Jazz', prefixes: ['0300', '0301', '0302', '0303', '0304', '0305', '0306', '0307', '0308', '0309', '0321', '0322', '0323', '0324'] },
    { operator: 'Zong', prefixes: ['0310', '0311', '0312', '0313', '0314', '0315', '0316', '0317', '0318', '0319'] },
    { operator: 'Telenor', prefixes: ['0340', '0341', '0342', '0343', '0344', '0345', '0346', '0347', '0348', '0349'] },
    { operator: 'Ufone', prefixes: ['0330', '0331', '0332', '0333', '0334', '0335', '0336', '0337', '0338', '0339'] },
    { operator: 'SCOM', prefixes: ['0355'] }
  ];
  function getOperator(value) {
    var d = cleanDigits(value);
    if (d.length < 4) return 'Unknown';
    var prefix = d.slice(0, 4);
    for (var i = 0; i < OPERATOR_PREFIXES.length; i++) {
      if (OPERATOR_PREFIXES[i].prefixes.indexOf(prefix) !== -1) return OPERATOR_PREFIXES[i].operator;
    }
    return 'Unknown';
  }
  function isPakMobile(value) {
    var d = cleanDigits(value);
    return /^03\d{9}$/.test(d);
  }
  function formatMobile(value) {
    var d = cleanDigits(value);
    if (!/^03\d{9}$/.test(d)) return null;
    return d.slice(0, 4) + '-' + d.slice(4);
  }
  function validateMobile(value) {
    var raw = cleanInput(value);
    if (!raw) return { valid: false, error: 'Mobile number khali hai. 03XX se shuru hone wala 11-digit number likhen.' };
    var d = cleanDigits(raw);
    if (/[^0-9\s-]/.test(raw)) return { valid: false, error: 'Mobile number me sirf digits aur dashes hone chahiye.' };
    if (!/^03/.test(d)) return { valid: false, error: 'Pakistani mobile number 03 se shuru hona chahiye.' };
    if (d.length !== 11) return { valid: false, error: 'Mobile number 11 digits ka hona chahiye, abhi ' + d.length + ' digits hain.' };
    return { valid: true, formatted: formatMobile(d), operator: getOperator(d), digits: d };
  }

  // ---------------- NTN ----------------
  // 7 digits, optionally with a 1-digit suffix: 1234567 or 1234567-8.
  function isNTN(value) {
    var raw = cleanInput(value);
    return /^\d{7}$/.test(raw) || /^\d{7}-\d$/.test(raw);
  }
  function formatNTN(value) {
    var raw = cleanInput(value);
    var d = cleanDigits(raw);
    if (/^\d{8}$/.test(d)) return d.slice(0, 7) + '-' + d.slice(7);
    if (!isNTN(raw)) return null;
    return d;
  }
  function validateNTN(value) {
    var raw = cleanInput(value);
    if (!raw) return { valid: false, error: 'NTN khali hai. 7 digits likhen.' };
    var d = cleanDigits(raw);
    if (/[^0-9\s-]/.test(raw)) return { valid: false, error: 'NTN me sirf digits aur dash hone chahiye.' };
    if (d.length !== 7 && d.length !== 8) return { valid: false, error: 'NTN 7 digits ka hona chahiye (suffix ke sath 8), abhi ' + d.length + ' digits hain.' };
    if (!isNTN(raw)) return { valid: false, error: 'NTN ka format ghalat hai. Misal: 1234567 ya 1234567-8.' };
    return { valid: true, formatted: formatNTN(raw), digits: d };
  }

  // ---------------- IBAN (Pakistan) ----------------
  // PK + 2 check digits + 4-letter bank code + 16 digits = 24 characters.
  function isPakIBANFormat(value) {
    return /^PK\d{2}[A-Z]{4}\d{16}$/.test(cleanIBAN(value));
  }
  function mod97(iban) {
    // ISO 13616: move first 4 chars to the end, convert letters A=10..Z=35,
    // compute mod 97 iteratively (avoids big-integer overflow).
    var rearranged = iban.slice(4) + iban.slice(0, 4);
    var numeric = '';
    for (var i = 0; i < rearranged.length; i++) {
      var ch = rearranged[i];
      if (ch >= 'A' && ch <= 'Z') numeric += String(ch.charCodeAt(0) - 55);
      else numeric += ch;
    }
    var remainder = 0;
    for (var j = 0; j < numeric.length; j++) {
      remainder = (remainder * 10 + parseInt(numeric[j], 10)) % 97;
    }
    return remainder;
  }
  function validateIBANChecksum(value) {
    var iban = cleanIBAN(value);
    if (!isPakIBANFormat(iban)) return false;
    return mod97(iban) === 1;
  }
  function formatIBAN(value) {
    var iban = cleanIBAN(value);
    if (!iban) return null;
    return iban.replace(/(.{4})/g, '$1 ').trim();
  }
  function validateIBAN(value) {
    var raw = cleanInput(value);
    if (!raw) return { valid: false, error: 'IBAN khali hai. PK se shuru hone wala 24-character IBAN likhen.' };
    var iban = cleanIBAN(raw);
    if (iban.length !== 24) return { valid: false, error: 'Pakistani IBAN 24 characters ka hota hai, abhi ' + iban.length + ' hain.' };
    if (!/^PK/.test(iban)) return { valid: false, error: 'Pakistani IBAN PK se shuru hona chahiye.' };
    if (!isPakIBANFormat(iban)) return { valid: false, error: 'IBAN ka format ghalat hai: PK + 2 digits + 4-letter bank code + 16 digits.' };
    if (!validateIBANChecksum(iban)) return { valid: false, error: 'IBAN checksum ghalat hai (MOD-97 check fail). Check digits ghalat ho sakte hain.' };
    return { valid: true, formatted: formatIBAN(iban), bankCode: iban.slice(4, 8), checkDigits: iban.slice(2, 4), iban: iban };
  }
  function isPakIBAN(value) {
    return validateIBAN(value).valid;
  }

  var api = {
    cleanInput: cleanInput, cleanDigits: cleanDigits, cleanIBAN: cleanIBAN,
    isCNIC: isCNIC, formatCNIC: formatCNIC, parseCNIC: parseCNIC, validateCNIC: validateCNIC,
    isPakMobile: isPakMobile, formatMobile: formatMobile, getOperator: getOperator, validateMobile: validateMobile,
    isNTN: isNTN, formatNTN: formatNTN, validateNTN: validateNTN,
    isPakIBAN: isPakIBAN, isPakIBANFormat: isPakIBANFormat, formatIBAN: formatIBAN,
    validateIBANChecksum: validateIBANChecksum, validateIBAN: validateIBAN, mod97: mod97,
    OPERATOR_PREFIXES: OPERATOR_PREFIXES
  };
  root.PKValidators = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
