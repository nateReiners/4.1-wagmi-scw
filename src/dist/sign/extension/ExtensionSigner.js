"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtensionSigner = void 0;
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
            this.updateListener.onChainUpdate({ id: Number(chainId) });
        });
        this.extensionProvider.on('accountsChanged', (accounts) => this.updateListener.onAccountsUpdate(accounts));
    }
    async handshake() {
        const accounts = await this.request({
            method: 'eth_requestAccounts',
        });
        this.updateListener.onAccountsUpdate(accounts);
        return accounts;
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
