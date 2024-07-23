"use strict";
// Copyright (c) 2018-2024 Coinbase, Inc. <https://www.coinbase.com/>
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScopedStorage = void 0;
const BaseStorage_1 = require("./BaseStorage");
// TODO: clean up, or possibly deprecate Storage class
class ScopedStorage {
    constructor(scope, module, baseStorage) {
        this.scope = scope;
        this.module = module;
        if (baseStorage) {
            this.baseStorage = baseStorage;
        }
        else {
            if (!window.localStorage) {
                throw new Error('ScopedLocalStorage: baseStorage is required in non-browser contexts');
            }
            this.baseStorage = (0, BaseStorage_1.browserStorageAdapter)(window.localStorage);
        }
    }
    storeObject(key, item) {
        this.baseStorage.set(key, JSON.stringify(item));
    }
    loadObject(key) {
        const item = this.baseStorage.get(key);
        return item ? JSON.parse(item) : undefined;
    }
    setItem(key, value) {
        this.baseStorage.set(this.scopedKey(key), value);
    }
    getItem(key) {
        return this.baseStorage.get(this.scopedKey(key));
    }
    removeItem(key) {
        this.baseStorage.delete(this.scopedKey(key));
    }
    clear() {
        const prefix = this.scopedKey('');
        for (const key of this.baseStorage.getAllKeys()) {
            if (typeof key === 'string' && key.startsWith(prefix)) {
                this.baseStorage.delete(key);
            }
        }
    }
    scopedKey(key) {
        return `-${this.scope}${this.module ? `:${this.module}` : ''}:${key}`;
    }
    static clearAll(baseStorage) {
        new ScopedStorage('CBWSDK', undefined, baseStorage).clear();
        new ScopedStorage('walletlink', undefined, baseStorage).clear();
    }
}
exports.ScopedStorage = ScopedStorage;
//# sourceMappingURL=ScopedStorage.js.map