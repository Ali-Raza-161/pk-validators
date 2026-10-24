/* pk-validators demo data: examples and code snippets. */
(function (root) {
  'use strict';
  var EXAMPLES = {
    cnic: {
      valid: '35202-1234567-1',
      invalid: '35202-12345-1',
      validNote: '13 digits, dashes ke sath',
      invalidNote: 'Sirf 11 digits — length ghalat hai'
    },
    mobile: {
      valid: '0300-1234567',
      invalid: '0300-12345',
      validNote: 'Jazz prefix 0300, 11 digits',
      invalidNote: 'Sirf 9 digits — length ghalat hai'
    },
    ntn: {
      valid: '1234567-8',
      invalid: '12345',
      validNote: '7 digits + suffix',
      invalidNote: 'Sirf 5 digits — length ghalat hai'
    },
    iban: {
      valid: 'PK36 SCBL 0000 0011 2345 6702',
      invalid: 'PK37 SCBL 0000 0011 2345 6702',
      validNote: 'MOD-97 checksum pass',
      invalidNote: 'Check digit badal diya — checksum fail'
    }
  };
  var SNIPPETS = {
    cnic: "import { isCNIC, formatCNIC } from 'pk-validators';\n\nisCNIC('35202-1234567-1'); // true\nformatCNIC('3520212345671'); // '35202-1234567-1'",
    mobile: "import { isPakMobile, getOperator, formatMobile } from 'pk-validators';\n\nisPakMobile('03001234567'); // true\ngetOperator('03001234567'); // 'Jazz'\nformatMobile('03001234567'); // '0300-1234567'",
    ntn: "import { isNTN, formatNTN } from 'pk-validators';\n\nisNTN('1234567-8'); // true\nformatNTN('12345678'); // '1234567-8'",
    iban: "import { isPakIBAN, formatIBAN } from 'pk-validators';\n\nisPakIBAN('PK36SCBL0000001123456702'); // true (MOD-97 pass)\nformatIBAN('PK36SCBL0000001123456702');\n// 'PK36 SCBL 0000 0011 2345 6702'"
  };
  var OPERATORS = [
    { name: 'Jazz', prefixes: '0300–0309, 0321–0324' },
    { name: 'Zong', prefixes: '0310–0319' },
    { name: 'Telenor', prefixes: '0340–0349' },
    { name: 'Ufone', prefixes: '0330–0339' },
    { name: 'SCOM', prefixes: '0355' }
  ];
  var api = { EXAMPLES: EXAMPLES, SNIPPETS: SNIPPETS, OPERATORS: OPERATORS };
  root.PKDemoData = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
