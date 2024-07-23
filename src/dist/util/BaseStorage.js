"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.browserStorageAdapter = browserStorageAdapter;
exports.mmkvStorageAdapter = mmkvStorageAdapter;
/**
 * An adapter that transforms a web {@link Storage} object into a {@link BaseStorage}
 *
 * @example
 * let storage = browserStorageAdapter(window.localStorage);
 * let sdk = new CoinbaseWalletSDK({
 *   storage,
 *   // ...options
 * });
 *
 * @param storage A web {@link Storage} object like {@link localStorage}
 * @returns A {@link BaseStorage} object that wraps the passed in storage
 */
function browserStorageAdapter(storage) {
    return {
        get: (key) => storage.getItem(key),
        set: (key, value) => storage.setItem(key, value),
        delete: (key) => storage.removeItem(key),
        getAllKeys: () => {
            const keys = [];
            for (let i = 0; i < storage.length; i++) {
                const key = storage.key(i);
                if (key) {
                    keys.push(key);
                }
            }
            return keys;
        },
    };
}
/**
 * An adapter that transforms a React Native MMKV storage object into a {@link BaseStorage}
 *
 * @example
 * let mmkv = new MMKV();
 * let storage = mmkvStorageAdapter(mmkv);
 * let sdk = new CoinbaseWalletSDK({
 *   storage,
 *   // ...options
 * });
 *
 * @param storage A React Native MMKV storage object
 * @returns A {@link BaseStorage} object that wraps the passed in storage
 */
function mmkvStorageAdapter(storage) {
    return {
        get: (key) => { var _a; return (_a = storage.getString(key)) !== null && _a !== void 0 ? _a : null; },
        set: (key, value) => storage.set(key, value),
        delete: (key) => storage.delete(key),
        getAllKeys: () => storage.getAllKeys(),
    };
}
