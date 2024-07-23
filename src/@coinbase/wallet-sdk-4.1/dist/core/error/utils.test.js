"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Web3Response_1 = require("../../sign/walletlink/relay/type/Web3Response");
const constants_1 = require("./constants");
const errors_1 = require("./errors");
const utils_1 = require("./utils");
describe('errors', () => {
    test('getErrorCode', () => {
        expect((0, utils_1.getErrorCode)(4137)).toEqual(4137);
        expect((0, utils_1.getErrorCode)({ code: 4137 })).toEqual(4137);
        expect((0, utils_1.getErrorCode)({ errorCode: 4137 })).toEqual(4137);
        expect((0, utils_1.getErrorCode)({ code: 4137, errorCode: 4137 })).toEqual(4137);
        expect((0, utils_1.getErrorCode)({ code: '4137' })).toEqual(undefined);
        expect((0, utils_1.getErrorCode)({ code: undefined })).toEqual(undefined);
        expect((0, utils_1.getErrorCode)({ errorCode: '4137' })).toEqual(undefined);
        expect((0, utils_1.getErrorCode)({ errorCode: undefined })).toEqual(undefined);
        expect((0, utils_1.getErrorCode)({})).toEqual(undefined);
        expect((0, utils_1.getErrorCode)('4137')).toEqual(undefined);
        expect((0, utils_1.getErrorCode)(new Error('generic error'))).toEqual(undefined);
        expect((0, utils_1.getErrorCode)(null)).toEqual(undefined);
        expect((0, utils_1.getErrorCode)(undefined)).toEqual(undefined);
        const errorResponse = {
            method: 'generic',
            errorMessage: 'test error message',
            errorCode: 4137,
        };
        expect((0, Web3Response_1.isErrorResponse)(errorResponse)).toEqual(true);
        expect((0, utils_1.getErrorCode)(errorResponse)).toEqual(4137);
    });
    test('standardErrorMessage', () => {
        // default error message
        expect((0, utils_1.getMessageFromCode)(constants_1.standardErrorCodes.provider.userRejectedRequest)).toEqual(expect.stringContaining('rejected'));
        // non-standard error code
        expect((0, utils_1.getMessageFromCode)(0)).toEqual('Unspecified error message.');
    });
    test('unsupportedChain error', () => {
        const errorWithoutChainID = errors_1.standardErrors.provider.unsupportedChain();
        expect(errorWithoutChainID.code).toEqual(constants_1.standardErrorCodes.provider.unsupportedChain);
        expect(errorWithoutChainID.message).toEqual(expect.stringContaining('Unrecognized chain ID'));
    });
});
//# sourceMappingURL=utils.test.js.map