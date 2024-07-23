"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ExtensionSigner_1 = require("./ExtensionSigner"); // Adjust the import path as needed
// Mocking CBInjectedProvider and StateUpdateListener
const mockUpdateListener = {
    onChainUpdate: jest.fn(),
    onAccountsUpdate: jest.fn(),
};
const mockExtensionProvider = {
    setAppInfo: jest.fn(),
    on: jest.fn(),
    request: jest.fn(),
    disconnect: jest.fn(),
};
const eventListeners = {};
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
mockExtensionProvider.on = jest.fn((event, listener) => {
    eventListeners[event] = listener;
});
globalThis.coinbaseWalletExtension = mockExtensionProvider;
const metadata = {
    appName: 'TestApp',
    appLogoUrl: 'https://test.app/logo.png',
    appChainIds: [1, 4],
};
describe('ExtensionSigner', () => {
    let signer;
    beforeEach(() => {
        signer = new ExtensionSigner_1.ExtensionSigner({ metadata, updateListener: mockUpdateListener });
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should set app info on initialization', () => {
        expect(mockExtensionProvider.setAppInfo).toHaveBeenCalledWith('TestApp', 'https://test.app/logo.png', [1, 4]);
    });
    it('should throw error only if Coinbase Wallet extension is not found', () => {
        delete globalThis.coinbaseWalletExtension;
        expect(() => new ExtensionSigner_1.ExtensionSigner({ metadata, updateListener: mockUpdateListener })).toThrow('Coinbase Wallet extension not found');
        globalThis.coinbaseWalletExtension = mockExtensionProvider;
        expect(() => new ExtensionSigner_1.ExtensionSigner({ metadata, updateListener: mockUpdateListener })).not.toThrow();
    });
    it('should handle chainChanged events', () => {
        eventListeners['chainChanged']('1');
        expect(mockUpdateListener.onChainUpdate).toHaveBeenCalledWith({
            chain: { id: 1 },
            source: 'wallet',
        });
    });
    it('should handle accountsChanged events', () => {
        eventListeners['accountsChanged'](['0x123']);
        expect(mockUpdateListener.onAccountsUpdate).toHaveBeenCalledWith({
            accounts: ['0x123'],
            source: 'wallet',
        });
    });
    it('should request accounts during handshake', async () => {
        mockExtensionProvider.request.mockImplementation((args) => args.method === 'eth_requestAccounts' ? ['0x123'] : null);
        const accounts = await signer.handshake();
        expect(accounts).toEqual(['0x123']);
        expect(mockUpdateListener.onAccountsUpdate).toHaveBeenCalledWith({
            accounts: ['0x123'],
            source: 'wallet',
        });
    });
    it('should throw error if no accounts found during handshake', async () => {
        mockExtensionProvider.request.mockResolvedValue(null);
        await expect(signer.handshake()).rejects.toThrow('No account found');
    });
    it('should get results from extension provider', async () => {
        const requestArgs = { method: 'someReq' };
        mockExtensionProvider.request.mockResolvedValueOnce('resFromExt');
        const response = await signer.request(requestArgs);
        expect(response).toBe('resFromExt');
        expect(mockExtensionProvider.request).toHaveBeenCalledWith(requestArgs);
    });
    it('should disconnect from extension provider', async () => {
        await signer.disconnect();
        expect(mockExtensionProvider.disconnect).toHaveBeenCalled();
    });
});
//# sourceMappingURL=ExtensionSigner.test.js.map