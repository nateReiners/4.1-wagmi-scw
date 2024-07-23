"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtensionSigner = void 0;
const util_1 = require("../../core/type/util");
class ExtensionSigner {
    constructor(params) {
        var _a;
        this.metadata = params.metadata;
        this.updateListener = params.updateListener;
        const extensionProvider = globalThis.coinbaseWalletExtension;
        if (!extensionProvider) {
            throw new Error('Coinbase Wallet extension not found');
        }
        const { appName, appLogoUrl, appChainIds } = this.metadata;
        (_a = extensionProvider.setAppInfo) === null || _a === void 0 ? void 0 : _a.call(extensionProvider, appName, appLogoUrl, appChainIds);
        this.extensionProvider = extensionProvider;
        this.extensionProvider.on('chainChanged', (chainId) => {
            this.updateListener.onChainIdUpdate(Number(chainId));
        });
        this.extensionProvider.on('accountsChanged', (accounts) => this.updateListener.onAccountsUpdate(accounts));
    }
    get accounts() {
        return this.extensionProvider.send({ method: 'eth_accounts' });
    }
    get chain() {
        const hexString = this.extensionProvider.send({ method: 'eth_chainId' });
        // TODO: currently, provider expects `rpcUrl` for fetch requests
        return { id: (0, util_1.intNumberFromHexString)(hexString) };
    }
    async handshake() {
        await this.request({
            method: 'eth_requestAccounts',
        });
    }
    async request(request) {
        return await this.extensionProvider.request(request);
    }
    async disconnect() {
        var _a;
        await ((_a = this.extensionProvider) === null || _a === void 0 ? void 0 : _a.disconnect());
    }
}
exports.ExtensionSigner = ExtensionSigner;
