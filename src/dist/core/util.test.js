"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const type_1 = require("./type");
const util_1 = require("./util");
const uint8ArrVal = new Uint8Array(6);
const hexString = 'E556B9bfEFDd5B190c67b521ED0A7d19Ab89a311';
describe('util', () => {
    test('randomBytesHex', () => {
        expect((0, util_1.randomBytesHex)(8)).toHaveLength(16);
        expect((0, util_1.randomBytesHex)(8)).not.toEqual((0, util_1.randomBytesHex)(8));
        expect((0, util_1.randomBytesHex)(32)).not.toEqual((0, util_1.randomBytesHex)(32));
    });
    test('uint8ArrayToHex', () => {
        expect((0, util_1.uint8ArrayToHex)(uint8ArrVal)).toEqual('000000000000');
    });
    test('hexStringToUint8Array', () => {
        expect((0, util_1.hexStringToUint8Array)('9298119f5025')).toEqual(new Uint8Array([146, 152, 17, 159, 80, 37]));
    });
    test('hexStringFromBuffer', () => {
        expect((0, util_1.hexStringFromBuffer)(Buffer.alloc(3))).toEqual('000000');
        expect((0, util_1.hexStringFromBuffer)(Buffer.alloc(3), true)).toEqual('0x000000');
    });
    test('bigIntStringFromBigInt', () => {
        expect((0, util_1.bigIntStringFromBigInt)(BigInt(0b11111111111111111111111111111111111111111111111111111))).toEqual('9007199254740991');
    });
    test('intNumberFromHexString', () => {
        expect((0, util_1.intNumberFromHexString)((0, type_1.HexString)('0x1fffffffffffff'))).toEqual(9007199254740991);
    });
    test('hexStringFromIntNumber', () => {
        expect((0, util_1.hexStringFromIntNumber)((0, type_1.IntNumber)(1234))).toEqual('0x4d2');
        expect((0, util_1.hexStringFromIntNumber)((0, type_1.IntNumber)(112341234234))).toEqual('0x1a280f323a');
    });
    test('has0xPrefix', () => {
        expect((0, util_1.has0xPrefix)('91234')).toBeFalsy();
        expect((0, util_1.has0xPrefix)('ox91234')).toBeFalsy();
        expect((0, util_1.has0xPrefix)('0x91234')).toBeTruthy();
        expect((0, util_1.has0xPrefix)('0X91234')).toBeTruthy();
    });
    test('strip0x', () => {
        expect((0, util_1.strip0x)('0x91234')).toEqual('91234');
        expect((0, util_1.strip0x)('70x91234')).toEqual('70x91234');
    });
    test('prepend0x', () => {
        expect((0, util_1.prepend0x)('0X91234')).toEqual('0x91234');
        expect((0, util_1.prepend0x)('8181003')).toEqual('0x8181003');
    });
    test('isHexString', () => {
        expect((0, util_1.isHexString)(8173290)).toBeFalsy();
        expect((0, util_1.isHexString)('8173290')).toBeTruthy();
        expect((0, util_1.isHexString)('apple-sauce')).toBeFalsy();
    });
    test('ensureHexString', () => {
        expect(() => (0, util_1.ensureHexString)(123)).toThrowError('"123" is not a hexadecimal string');
        expect(() => (0, util_1.ensureHexString)('az123456')).toThrowError();
        expect((0, util_1.ensureHexString)('123456')).toEqual('123456');
        expect((0, util_1.ensureHexString)('123456', true)).toEqual('0x123456');
    });
    test('ensureEvenLengthHexString', () => {
        expect((0, util_1.ensureEvenLengthHexString)('0x1234')).toEqual('1234');
        expect((0, util_1.ensureEvenLengthHexString)('123456789')).toEqual('0123456789');
        expect((0, util_1.ensureEvenLengthHexString)('123456789', true)).toEqual('0x0123456789');
    });
    test('ensureAddressString', () => {
        expect(() => (0, util_1.ensureAddressString)(1234)).toThrowError('Invalid Ethereum address');
        expect(() => (0, util_1.ensureAddressString)('E556B9bfEFDd5B190')).toThrowError('Invalid Ethereum address');
        expect(() => (0, util_1.ensureAddressString)('E556B9bfEFDd5B190c67b521ED0A7d19Ab89a3111')).toThrowError('Invalid Ethereum address');
        expect((0, util_1.ensureAddressString)(hexString)).toEqual('0xe556b9bfefdd5b190c67b521ed0a7d19ab89a311');
        expect((0, util_1.ensureAddressString)('0XE556B9bfEFDd5B190c67b521ED0A7d19Ab89a311')).toEqual('0xe556b9bfefdd5b190c67b521ed0a7d19ab89a311');
    });
    test('ensureBuffer', () => {
        const bufferVal = Buffer.from('I AM THE WALRUS');
        expect((0, util_1.ensureBuffer)(bufferVal).toString()).toEqual('I AM THE WALRUS');
        expect((0, util_1.ensureBuffer)('I am the cheshire cat')).toBeInstanceOf(Buffer);
        expect((0, util_1.ensureBuffer)(hexString).buffer).toEqual(Uint8Array.from([
            140, 22, 81, 137, 137, 56, 98, 28, 52, 215, 100, 110, 146, 161, 33, 228, 175, 127, 154, 17,
            189, 218, 72, 67, 182, 57, 17, 81, 245, 199, 172, 231,
        ]).buffer);
        expect(() => (0, util_1.ensureBuffer)(new Set([12, 23]))).toThrowError();
    });
    test('ensureIntNumber', () => {
        expect((0, util_1.ensureIntNumber)(1234)).toEqual(1234);
        expect((0, util_1.ensureIntNumber)('1234')).toEqual(1234);
        expect((0, util_1.ensureIntNumber)('E556B9bfEFDd')).toEqual(252160646311901);
        expect((0, util_1.ensureIntNumber)('252160646311901')).toEqual(252160646311901);
        expect(() => (0, util_1.ensureIntNumber)([1, 3, 4])).toThrowError();
        expect(() => (0, util_1.ensureIntNumber)('hexString')).toThrowError();
    });
    test('ensureRegExpString', () => {
        const HEXADECIMAL_STRING_REGEX = /^[a-f0-9]*$/;
        expect(() => (0, util_1.ensureRegExpString)('^&1234')).toThrowError();
        expect((0, util_1.ensureRegExpString)(HEXADECIMAL_STRING_REGEX)).toEqual('/^[a-f0-9]*$/');
    });
    test('ensureBigInt', () => {
        expect((0, util_1.ensureBigInt)(12345678910).toString()).toEqual('12345678910');
        expect((0, util_1.ensureBigInt)(BigInt(41234124)).toString()).toEqual('41234124');
        expect(Number((0, util_1.ensureBigInt)('12345667'))).toEqual(12345667);
        expect(Number((0, util_1.ensureBigInt)('ab12345667'))).toEqual(734744827495);
        expect(() => (0, util_1.ensureBigInt)('ax123456')).toThrowError();
        expect(() => (0, util_1.ensureBigInt)(['cat'])).toThrowError();
    });
    test('ensureParsedJSONObject', () => {
        const testObj = {
            a: 1,
            b: 2,
        };
        expect((0, util_1.ensureParsedJSONObject)('{"a":1,"b":2}')).toMatchObject(testObj);
        expect((0, util_1.ensureParsedJSONObject)({
            a: 1,
            b: 2,
        })).toMatchObject(testObj);
    });
    test('range', () => {
        expect((0, util_1.range)(1, 5)).toMatchObject([1, 2, 3, 4]);
    });
    describe('getFavicon', () => {
        test('return https', () => {
            document.head.innerHTML = `
      <link rel="shortcut icon" sizes="16x16 24x24" href="https://coinbase.com/favicon.ico">
    `;
            expect((0, util_1.getFavicon)()).toEqual('https://coinbase.com/favicon.ico');
        });
        test('return http', () => {
            document.head.innerHTML = `
      <link rel="shortcut icon" sizes="16x16 24x24" href="//coinbase.com/favicon.ico">
    `;
            expect((0, util_1.getFavicon)()).toEqual('http://coinbase.com/favicon.ico');
        });
        test('return localhost', () => {
            document.head.innerHTML = `
      <link rel="shortcut icon" sizes="16x16 24x24" href="/favicon.ico">
    `;
            expect((0, util_1.getFavicon)()).toEqual('http://localhost/favicon.ico');
        });
    });
});
//# sourceMappingURL=util.test.js.map