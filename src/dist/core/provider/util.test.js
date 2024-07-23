"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../error");
const util_1 = require("./util");
// @ts-expect-error-next-line
const invalidArgsError = (args) => error_1.standardErrors.rpc.invalidRequest({
    message: 'Expected a single, non-array, object argument.',
    data: args,
});
// @ts-expect-error-next-line
const invalidMethodError = (args) => error_1.standardErrors.rpc.invalidRequest({
    message: "'args.method' must be a non-empty string.",
    data: args,
});
// @ts-expect-error-next-line
const invalidParamsError = (args) => error_1.standardErrors.rpc.invalidRequest({
    message: "'args.params' must be an object or array if provided.",
    data: args,
});
describe('eip1193Utils', () => {
    describe('getErrorForInvalidRequestArgs', () => {
        it('should throw if args is not an object', () => {
            const args = 'not an object';
            expect(
            // @ts-expect-error-next-line
            (0, util_1.checkErrorForInvalidRequestArgs)(args)).toEqual(invalidArgsError(args));
        });
        it('should throw if args is an array', () => {
            const args = ['an array'];
            expect(
            // @ts-expect-error-next-line
            (0, util_1.checkErrorForInvalidRequestArgs)(args)).toEqual(invalidArgsError(args));
        });
        it('should throw if args.method is not a string', () => {
            const args = { method: 123 };
            expect(
            // @ts-expect-error-next-line
            (0, util_1.checkErrorForInvalidRequestArgs)(args)).toEqual(invalidMethodError(args));
            const args2 = { method: { method: 'string' } };
            expect(
            // @ts-expect-error-next-line
            (0, util_1.checkErrorForInvalidRequestArgs)(args2)).toEqual(invalidMethodError(args2));
        });
        it('should throw if args.method is an empty string', () => {
            const args = { method: '' };
            expect((0, util_1.checkErrorForInvalidRequestArgs)(args)).toEqual(invalidMethodError(args));
        });
        it('should throw if args.params is not an array or object', () => {
            const args = { method: 'foo', params: 'not an array or object' };
            expect(
            // @ts-expect-error-next-line
            (0, util_1.checkErrorForInvalidRequestArgs)(args)).toEqual(invalidParamsError(args));
            const args2 = { method: 'foo', params: 123 };
            expect(
            // @ts-expect-error-next-line
            (0, util_1.checkErrorForInvalidRequestArgs)(args2)).toEqual(invalidParamsError(args2));
        });
        it('should throw if args.params is null', () => {
            const args = { method: 'foo', params: null };
            expect(
            // @ts-expect-error-next-line
            (0, util_1.checkErrorForInvalidRequestArgs)(args)).toEqual(invalidParamsError(args));
        });
        it('should not throw if args.params is undefined', () => {
            expect((0, util_1.checkErrorForInvalidRequestArgs)({ method: 'foo', params: undefined })).toBeUndefined();
            expect((0, util_1.checkErrorForInvalidRequestArgs)({ method: 'foo' })).toBeUndefined();
        });
        it('should not throw if args.params is an array', () => {
            expect((0, util_1.checkErrorForInvalidRequestArgs)({ method: 'foo', params: ['an array'] })).toBeUndefined();
        });
        it('should not throw if args.params is an object', () => {
            expect((0, util_1.checkErrorForInvalidRequestArgs)({ method: 'foo', params: { foo: 'bar' } })).toBeUndefined();
        });
        it('should not throw if args.params is an empty array', () => {
            expect((0, util_1.checkErrorForInvalidRequestArgs)({ method: 'foo', params: [] })).toBeUndefined();
        });
        it('should not throw if args.params is an empty object', () => {
            expect((0, util_1.checkErrorForInvalidRequestArgs)({ method: 'foo', params: {} })).toBeUndefined();
        });
    });
});
//# sourceMappingURL=util.test.js.map