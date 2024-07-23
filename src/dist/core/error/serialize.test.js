"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const errors_1 = require("./errors");
const serialize_1 = require("./serialize");
describe('serializeError', () => {
    test('with ErrorResponse object', () => {
        const errorResponse = {
            method: 'generic',
            errorMessage: 'test ErrorResponse object',
            errorCode: constants_1.standardErrorCodes.provider.unsupportedMethod,
        };
        const serialized = (0, serialize_1.serializeError)(errorResponse);
        expect(serialized.code).toEqual(constants_1.standardErrorCodes.provider.unsupportedMethod);
        expect(serialized.message).toEqual('test ErrorResponse object');
        expect(serialized.docUrl).toMatch(/.*version=\d+\.\d+\.\d+.*/);
        expect(serialized.docUrl).toContain(`code=${constants_1.standardErrorCodes.provider.unsupportedMethod}`);
    });
    test('with standardError', () => {
        const error = errors_1.standardErrors.provider.userRejectedRequest({});
        const serialized = (0, serialize_1.serializeError)(error);
        expect(serialized.code).toEqual(constants_1.standardErrorCodes.provider.userRejectedRequest);
        expect(serialized.message).toEqual(error.message);
        expect(serialized.stack).toEqual(expect.stringContaining('User rejected'));
        expect(serialized.docUrl).toMatch(/.*version=\d+\.\d+\.\d+.*/);
        expect(serialized.docUrl).toContain(`code=${constants_1.standardErrorCodes.provider.userRejectedRequest}`);
    });
    test('with unsupportedChain', () => {
        const error = errors_1.standardErrors.provider.unsupportedChain();
        const serialized = (0, serialize_1.serializeError)(error);
        expect(serialized.code).toEqual(constants_1.standardErrorCodes.provider.unsupportedChain);
        expect(serialized.message).toEqual(error.message);
        expect(serialized.stack).toEqual(expect.stringContaining('Unrecognized chain ID'));
        expect(serialized.docUrl).toMatch(/.*version=\d+\.\d+\.\d+.*/);
        expect(serialized.docUrl).toContain(`code=${constants_1.standardErrorCodes.provider.unsupportedChain}`);
    });
    test('with Error object', () => {
        const error = new Error('test Error object');
        const serialized = (0, serialize_1.serializeError)(error);
        expect(serialized.code).toEqual(constants_1.standardErrorCodes.rpc.internal);
        expect(serialized.message).toEqual('test Error object');
        expect(serialized.stack).toEqual(expect.stringContaining('test Error object'));
        expect(serialized.docUrl).toMatch(/.*version=\d+\.\d+\.\d+.*/);
        expect(serialized.docUrl).toContain(`code=${constants_1.standardErrorCodes.rpc.internal}`);
    });
    test('with string', () => {
        const error = 'test error with just string';
        const serialized = (0, serialize_1.serializeError)(error);
        expect(serialized.code).toEqual(constants_1.standardErrorCodes.rpc.internal);
        expect(serialized.message).toEqual('test error with just string');
        expect(serialized.docUrl).toMatch(/.*version=\d+\.\d+\.\d+.*/);
        expect(serialized.docUrl).toContain(`code=${constants_1.standardErrorCodes.rpc.internal}`);
    });
    test('with unknown type', () => {
        const error = { unknown: 'error' };
        const serialized = (0, serialize_1.serializeError)(error);
        expect(serialized.code).toEqual(constants_1.standardErrorCodes.rpc.internal);
        expect(serialized.message).toEqual('Unspecified error message.');
        expect(serialized.docUrl).toMatch(/.*version=\d+\.\d+\.\d+.*/);
        expect(serialized.docUrl).toContain(`code=${constants_1.standardErrorCodes.rpc.internal}`);
    });
});
//# sourceMappingURL=serialize.test.js.map