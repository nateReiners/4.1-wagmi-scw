"use strict";
// Copyright (c) 2018-2024 Coinbase, Inc. <https://www.coinbase.com/>
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinbaseWalletSDK = void 0;
const wallet_logo_1 = require("./assets/wallet-logo");
const CoinbaseWalletProvider_1 = require("./CoinbaseWalletProvider");
const ScopedLocalStorage_1 = require("./util/ScopedLocalStorage");
const version_1 = require("./version");
const util_1 = require("./core/type/util");
class CoinbaseWalletSDK {
    constructor(metadata) {
        this.metadata = {
            appName: metadata.appName || 'Dapp',
            appLogoUrl: metadata.appLogoUrl || (0, util_1.getFavicon)(),
            appChainIds: metadata.appChainIds || [],
        };
        this.storeLatestVersion();
    }
    makeWeb3Provider(preference = { options: 'all' }) {
        var _a, _b;
        try {
            const window = globalThis;
            const ethereum = (_a = window.ethereum) !== null && _a !== void 0 ? _a : (_b = window.top) === null || _b === void 0 ? void 0 : _b.ethereum;
            if (ethereum === null || ethereum === void 0 ? void 0 : ethereum.isCoinbaseBrowser) {
                return ethereum;
            }
        }
        catch (_c) {
            // Ignore
        }
        return new CoinbaseWalletProvider_1.CoinbaseWalletProvider({ metadata: this.metadata, preference });
    }
    /**
     * Official Coinbase Wallet logo for developers to use on their frontend
     * @param type Type of wallet logo: "standard" | "circle" | "text" | "textWithLogo" | "textLight" | "textWithLogoLight"
     * @param width Width of the logo (Optional)
     * @returns SVG Data URI
     */
    getCoinbaseWalletLogo(type, width = 240) {
        return (0, wallet_logo_1.walletLogo)(type, width);
    }
    storeLatestVersion() {
        const versionStorage = new ScopedLocalStorage_1.ScopedLocalStorage('CBWSDK');
        versionStorage.setItem('VERSION', version_1.LIB_VERSION);
    }
}
exports.CoinbaseWalletSDK = CoinbaseWalletSDK;
