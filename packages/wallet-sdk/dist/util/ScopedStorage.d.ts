import { BaseStorage } from './BaseStorage';
export declare class ScopedStorage {
    private scope;
    private module?;
    private baseStorage;
    constructor(scope: 'CBWSDK' | 'walletlink', module?: string | undefined, baseStorage?: BaseStorage);
    storeObject<T>(key: string, item: T): void;
    loadObject<T>(key: string): T | undefined;
    setItem(key: string, value: string): void;
    getItem(key: string): string | null;
    removeItem(key: string): void;
    clear(): void;
    scopedKey(key: string): string;
    static clearAll(baseStorage: BaseStorage | undefined): void;
}
