/* Node tests for pk-validators. Run: node test-validators.js */
const V = require('./validators.js');
let pass = 0, fail = 0;
function check(name, actual, expected) {
  const ok = actual === expected;
  if (ok) pass++; else { fail++; console.log('FAIL:', name, 'expected', expected, 'got', actual); }
}
// CNIC
check('CNIC valid dashed', V.isCNIC('35202-1234567-1'), true);
check('CNIC valid plain', V.isCNIC('3520212345671'), true);
check('CNIC invalid short', V.isCNIC('35202-12345-1'), false);
check('CNIC invalid letters', V.isCNIC('35202-abcdefg-1'), false);
check('CNIC invalid empty', V.isCNIC(''), false);
check('CNIC format', V.formatCNIC('3520212345671'), '35202-1234567-1');
check('CNIC format invalid', V.formatCNIC('123'), null);
check('CNIC gender odd=male hint', V.parseCNIC('35202-1234567-1').genderHint, 'Male');
check('CNIC gender even=female hint', V.parseCNIC('35202-1234567-2').genderHint, 'Female');
check('CNIC error length', V.validateCNIC('123').valid, false);
// Mobile
check('Mobile valid Jazz', V.isPakMobile('03001234567'), true);
check('Mobile valid dashed', V.isPakMobile('0300-1234567'), true);
check('Mobile invalid short', V.isPakMobile('030012345'), false);
check('Mobile invalid start', V.isPakMobile('04001234567'), false);
check('Mobile invalid letters', V.isPakMobile('0300-abcdefg'), false);
check('Mobile format', V.formatMobile('03001234567'), '0300-1234567');
check('Operator Jazz 0300', V.getOperator('03001234567'), 'Jazz');
check('Operator Jazz 0321', V.getOperator('03211234567'), 'Jazz');
check('Operator Zong 0315', V.getOperator('03151234567'), 'Zong');
check('Operator Telenor 0345', V.getOperator('03451234567'), 'Telenor');
check('Operator Ufone 0333', V.getOperator('03331234567'), 'Ufone');
check('Operator SCOM 0355', V.getOperator('03551234567'), 'SCOM');
check('Operator Unknown 0399', V.getOperator('03991234567'), 'Unknown');
// NTN
check('NTN valid 7', V.isNTN('1234567'), true);
check('NTN valid suffix', V.isNTN('1234567-8'), true);
check('NTN invalid short', V.isNTN('12345'), false);
check('NTN invalid letters', V.isNTN('123456a'), false);
check('NTN format suffix', V.formatNTN('12345678'), '1234567-8');
check('NTN format plain', V.formatNTN('1234567'), '1234567');
// IBAN
check('IBAN valid SCBL', V.isPakIBAN('PK36SCBL0000001123456702'), true);
check('IBAN valid spaced', V.isPakIBAN('PK36 SCBL 0000 0011 2345 6702'), true);
check('IBAN valid HABB', V.isPakIBAN('PK29HABB0001234567890123'), true);
check('IBAN checksum fail wrong digit', V.isPakIBAN('PK37SCBL0000001123456702'), false);
check('IBAN checksum fail last digit', V.isPakIBAN('PK36SCBL0000001123456703'), false);
check('IBAN format wrong country', V.isPakIBAN('GB36SCBL0000001123456702'), false);
check('IBAN format short', V.isPakIBAN('PK36SCBL00000011234567'), false);
check('IBAN format groups', V.formatIBAN('PK36SCBL0000001123456702'), 'PK36 SCBL 0000 0011 2345 6702');
check('IBAN bank code', V.validateIBAN('PK36SCBL0000001123456702').bankCode, 'SCBL');
check('IBAN mod97 valid =1', V.mod97('PK36SCBL0000001123456702'), 1);
// Clean / edge
check('cleanInput trims', V.cleanInput('  0300-1234567 '), '0300-1234567');
check('empty mobile invalid', V.validateMobile('').valid, false);
check('empty IBAN invalid', V.validateIBAN('').valid, false);
console.log(`\n${pass} passed, ${fail} failed, ${pass + fail} total`);
process.exit(fail ? 1 : 0);
