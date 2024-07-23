"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CoinbaseWalletProvider_1 = require("./CoinbaseWalletProvider");
const CoinbaseWalletSDK_1 = require("./CoinbaseWalletSDK");
const util_1 = require("./core/type/util");
const window = globalThis;
jest.mock(':core/type/util');
jest.mock(':util/provider');
jest.mock('./CoinbaseWalletProvider');
const mockCipherProvider = { isCoinbaseBrowser: true };
describe('CoinbaseWalletSDK', () => {
    test('@makeWeb3Provider - return Coinbase Injected Provider', () => {
        window.ethereum = mockCipherProvider;
        const SDK = new CoinbaseWalletSDK_1.CoinbaseWalletSDK({
            appName: 'Test',
            appLogoUrl: 'http://coinbase.com/wallet-logo.png',
        });
        expect(SDK.makeWeb3Provider()).toBe(mockCipherProvider);
    });
    test('@makeWeb3Provider - return new CoinbaseWalletProvider', () => {
        window.ethereum = undefined;
        const SDK = new CoinbaseWalletSDK_1.CoinbaseWalletSDK({
            appName: 'Test',
            appLogoUrl: 'http://coinbase.com/wallet-logo.png',
        });
        SDK.makeWeb3Provider();
        expect(CoinbaseWalletProvider_1.CoinbaseWalletProvider).toHaveBeenCalledWith({
            metadata: {
                appName: 'Test',
                appLogoUrl: 'http://coinbase.com/wallet-logo.png',
                appChainIds: [],
            },
            preference: {
                options: 'all',
            },
        });
    });
    test('@makeWeb3Provider - default values for metadata', () => {
        util_1.getFavicon.mockReturnValue('https://dapp.xyz/pic.png');
        const SDK = new CoinbaseWalletSDK_1.CoinbaseWalletSDK({
            appName: '',
            appLogoUrl: '',
        });
        SDK.makeWeb3Provider();
        expect(CoinbaseWalletProvider_1.CoinbaseWalletProvider).toHaveBeenCalledWith({
            metadata: {
                appName: 'Dapp',
                appLogoUrl: 'https://dapp.xyz/pic.png',
                appChainIds: [],
            },
            preference: {
                options: 'all',
            },
        });
    });
});
//# sourceMappingURL=CoinbaseWalletSDK.test.js.map