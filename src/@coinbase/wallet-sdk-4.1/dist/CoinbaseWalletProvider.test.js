"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const CoinbaseWalletProvider_1 = require("./CoinbaseWalletProvider");
const error_1 = require("./core/error");
const util = __importStar(require("./sign/util"));
const type_1 = require("./core/type");
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
const mockFetchSignerType = jest.spyOn(util, 'fetchSignerType');
const mockLoadSignerType = jest.spyOn(util, 'loadSignerType');
const mockStoreSignerType = jest.spyOn(util, 'storeSignerType');
const mockHandshake = jest.fn();
const mockRequest = jest.fn();
jest.mock('./sign/scw/SCWSigner', () => {
    return {
        SCWSigner: jest.fn().mockImplementation(() => {
            return {
                handshake: mockHandshake,
                request: mockRequest,
            };
        }),
    };
});
describe('signer configuration', () => {
    it('should complete signerType selection correctly', async () => {
        mockFetchSignerType.mockResolvedValue('scw');
        mockHandshake.mockResolvedValueOnce(['0x123']);
        const provider = createProvider();
        const accounts = await provider.request({ method: 'eth_requestAccounts' });
        expect(accounts).toEqual(['0x123']);
        expect(mockHandshake).toHaveBeenCalledWith();
    });
    it('should throw error if signer selection failed', async () => {
        const error = new Error('Signer selection failed');
        mockFetchSignerType.mockRejectedValueOnce(error);
        const provider = createProvider();
        await expect(provider.request({ method: 'eth_requestAccounts' })).rejects.toThrow(error);
        expect(mockHandshake).not.toHaveBeenCalled();
        expect(mockStoreSignerType).not.toHaveBeenCalled();
    });
    it('should not store signer type unless handshake is successful', async () => {
        const error = new Error('Handshake failed');
        mockFetchSignerType.mockResolvedValueOnce('scw');
        mockHandshake.mockRejectedValueOnce(error);
        const provider = createProvider();
        await expect(provider.request({ method: 'eth_requestAccounts' })).rejects.toThrow(error);
        expect(mockHandshake).toHaveBeenCalled();
        expect(mockStoreSignerType).not.toHaveBeenCalled();
    });
    it('should load signer from storage when available', async () => {
        mockLoadSignerType.mockReturnValueOnce('scw');
        const provider = createProvider();
        // @ts-expect-error // TODO: should be able to mock cached accounts
        provider.accounts = [(0, type_1.AddressString)('0x123')];
        const request = { method: 'personal_sign', params: ['0x123', '0xdeadbeef'] };
        provider.request(request);
        expect(mockRequest).toHaveBeenCalledWith(request);
    });
    it('should throw error if signer is not initialized', async () => {
        const provider = createProvider();
        await expect(provider.request({ method: 'personal_sign' })).rejects.toThrow(`Must call 'eth_requestAccounts' before other methods`);
    });
});
//# sourceMappingURL=CoinbaseWalletProvider.test.js.map