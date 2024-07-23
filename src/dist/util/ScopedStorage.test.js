"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseStorage_1 = require("./BaseStorage");
const ScopedStorage_1 = require("./ScopedStorage");
describe('ScopedStorage', () => {
    describe('public methods', () => {
        afterEach(() => localStorage.clear());
        const scopedLocalStorage = new ScopedStorage_1.ScopedStorage('CBWSDK', 'testing');
        test('@setItem', () => {
            scopedLocalStorage.setItem('foo', 'bar');
            expect(localStorage.getItem('-CBWSDK:testing:foo')).toEqual('bar');
            expect(localStorage.length).toEqual(1);
        });
        test('@getItem', () => {
            scopedLocalStorage.setItem('foo', 'bar');
            const getVal = scopedLocalStorage.getItem('foo');
            expect(getVal).toEqual('bar');
        });
        test('@removeItem', () => {
            scopedLocalStorage.removeItem('foo');
            expect(localStorage.length).toEqual(0);
        });
        test('@clear', () => {
            scopedLocalStorage.setItem('foo1', 'bar1');
            scopedLocalStorage.setItem('foo2', 'bar2');
            scopedLocalStorage.setItem('foo3', 'bar3');
            expect(localStorage.length).toEqual(3);
            scopedLocalStorage.clear();
            expect(localStorage.length).toEqual(0);
        });
    });
    describe('with base storage', () => {
        const scopedLocalStorage = new ScopedStorage_1.ScopedStorage('CBWSDK', 'testing', (0, BaseStorage_1.browserStorageAdapter)(localStorage));
        afterEach(() => localStorage.clear());
        test('@setItem', () => {
            scopedLocalStorage.setItem('foo', 'bar');
            expect(localStorage.getItem('-CBWSDK:testing:foo')).toEqual('bar');
            expect(localStorage.length).toEqual(1);
        });
        test('@getItem', () => {
            scopedLocalStorage.setItem('foo', 'bar');
            const getVal = scopedLocalStorage.getItem('foo');
            expect(getVal).toEqual('bar');
        });
        test('@removeItem', () => {
            scopedLocalStorage.removeItem('foo');
            expect(localStorage.length).toEqual(0);
        });
        test('@clear', () => {
            scopedLocalStorage.setItem('foo1', 'bar1');
            scopedLocalStorage.setItem('foo2', 'bar2');
            scopedLocalStorage.setItem('foo3', 'bar3');
            expect(localStorage.length).toEqual(3);
            scopedLocalStorage.clear();
            expect(localStorage.length).toEqual(0);
        });
        test('@clear - only clear unscoped items', () => {
            localStorage.setItem('unscoped-item', 'foo');
            scopedLocalStorage.setItem('foo1', 'bar1');
            scopedLocalStorage.setItem('foo2', 'bar2');
            scopedLocalStorage.setItem('foo3', 'bar3');
            expect(localStorage.length).toEqual(4);
            scopedLocalStorage.clear();
            expect(localStorage.length).toEqual(1);
        });
    });
});
//# sourceMappingURL=ScopedStorage.test.js.map