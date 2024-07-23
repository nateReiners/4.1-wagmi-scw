"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CoinbaseWalletProvider_1 = require("./CoinbaseWalletProvider");
const error_1 = require("./core/error");
const util_1 = require("./sign/util");
function createProvider() {
    return new CoinbaseWalletProvider_1.CoinbaseWalletProvider({
        metadata: { appName: 'Test App', appLogoUrl: null, appChainIds: [1] },
        preference: { options: 'all' },
    });
}
describe('CoinbaseWalletProvider', () => {
    it('emits disconnect event on user initiated disconnection', async () => {
        const disconnectListener = jest.fn();
        const provider = createProvider();
        provider.on('disconnect', disconnectListener);
        await provider.disconnect();
        expect(disconnectListener).toHaveBeenCalledWith(error_1.standardErrors.provider.disconnected('User initiated disconnection'));
    });
    describe('Request Handling', () => {
        test('handles request correctly', async () => {
            const provider = createProvider();
            const response1 = await provider.request({ method: 'eth_chainId' });
            expect(response1).toBe('0x1');
        });
        test('throws error when handling invalid request', async () => {
            const provider = createProvider();
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error // testing invalid request args
            await expect(provider.request({})).rejects.toMatchObject({
                code: -32602,
                message: "'args.method' must be a non-empty string.",
            });
        });
    });
});
const mockHandshake = jest.fn();
const mockRequest = jest.fn();
jest.mock('./sign/util', () => {
    return {
        fetchSignerType: jest.fn(),
        loadSignerType: jest.fn(),
        storeSignerType: jest.fn(),
        createSigner: () => ({
            chain: { id: 1 },
            handshake: mockHandshake,
            request: mockRequest,
        }),
    };
});
describe('signer configuration', () => {
    it('should complete signerType selection correctly', async () => {
        util_1.fetchSignerType.mockResolvedValue('scw');
        mockHandshake.mockResolvedValueOnce(['0x123']);
        const provider = createProvider();
        await provider.request({ method: 'eth_requestAccounts' });
        expect(mockHandshake).toHaveBeenCalledWith();
    });
    it('should throw error if signer selection failed', async () => {
        const error = new Error('Signer selection failed');
        util_1.fetchSignerType.mockRejectedValue(error);
        const provider = createProvider();
        await expect(provider.request({ method: 'eth_requestAccounts' })).rejects.toMatchObject(expect.objectContaining({
            message: error.message,
        }));
        expect(mockHandshake).not.toHaveBeenCalled();
        expect(util_1.storeSignerType).not.toHaveBeenCalled();
    });
    it('should not store signer type unless handshake is successful', async () => {
        const error = new Error('Handshake failed');
        util_1.fetchSignerType.mockResolvedValueOnce('scw');
        mockHandshake.mockRejectedValueOnce(error);
        const provider = createProvider();
        await expect(provider.request({ method: 'eth_requestAccounts' })).rejects.toMatchObject(expect.objectContaining({
            message: error.message,
        }));
        expect(mockHandshake).toHaveBeenCalled();
        expect(util_1.storeSignerType).not.toHaveBeenCalled();
    });
    it('should load signer from storage when available', async () => {
        util_1.loadSignerType.mockReturnValueOnce('scw');
        const provider = createProvider();
        // @ts-expect-error // TODO: should be able to mock cached accounts
        provider.signer.accounts = ['0x123'];
        const request = { method: 'personal_sign', params: ['0x123', '0xdeadbeef'] };
        provider.request(request);
        expect(mockRequest).toHaveBeenCalledWith(request);
    });
    it('should throw error if signer is not initialized', async () => {
        const provider = createProvider();
        await expect(provider.request({ method: 'personal_sign' })).rejects.toMatchObject({
            code: error_1.standardErrorCodes.provider.unauthorized,
            message: `Must call 'eth_requestAccounts' before other methods`,
        });
    });
});
//# sourceMappingURL=CoinbaseWalletProvider.test.js.map