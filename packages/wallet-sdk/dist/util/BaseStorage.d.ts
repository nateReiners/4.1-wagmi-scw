export type BaseStorage = {
    get: (key: string) => string | null;
    set: (key: string, value: string) => void;
    delete: (key: string) => void;
    getAllKeys: () => string[];
};
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
export declare function browserStorageAdapter(storage: Storage): BaseStorage;
type MMKVStorage = {
    getString: (key: string) => string | undefined;
    set: (key: string, value: string) => void;
    delete: (key: string) => void;
    getAllKeys: () => string[];
};
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
export declare function mmkvStorageAdapter(storage: MMKVStorage): BaseStorage;
export {};
