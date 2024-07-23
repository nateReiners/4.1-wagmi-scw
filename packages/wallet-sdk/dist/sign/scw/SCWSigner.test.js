"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SCWKeyManager_1 = require("./SCWKeyManager");
const SCWSigner_1 = require("./SCWSigner");
const Communicator_1 = require("../../core/communicator/Communicator");
const error_1 = require("../../core/error");
const cipher_1 = require("../../util/cipher");
const ScopedStorage_1 = require("../../util/ScopedStorage");
jest.mock('./SCWKeyManager');
const storageStoreSpy = jest.spyOn(ScopedStorage_1.ScopedStorage.prototype, 'storeObject');
jest.mock(':core/communicator/Communicator', () => ({
    Communicator: jest.fn(() => ({
        postRequestAndWaitForResponse: jest.fn(),
        waitForPopupLoaded: jest.fn(),
    })),
}));
jest.mock(':util/cipher', () => ({
    decryptContent: jest.fn(),
    encryptContent: jest.fn(),
    exportKeyToHexString: jest.fn(),
    importKeyFromHexString: jest.fn(),
}));
const mockCryptoKey = {};
const encryptedData = {};
const mockChains = {
    '1': 'https://eth-rpc.example.com/1',
    '2': 'https://eth-rpc.example.com/2',
};
const mockCapabilities = {};
const mockError = error_1.standardErrors.provider.unauthorized();
const mockSuccessResponse = {
    id: '1-2-3-4-5',
    requestId: '1-2-3-4-5',
    sender: '0xPublicKey',
    content: { encrypted: encryptedData },
    timestamp: new Date(),
};
describe('SCWSigner', () => {
    let signer;
    let mockMetadata;
    let mockCommunicator;
    let mockUpdateListener;
    let mockKeyManager;
    beforeEach(() => {
        mockMetadata = {
            appName: 'test',
            appLogoUrl: null,
            appChainIds: [1],
        };
        mockCommunicator = new Communicator_1.Communicator();
        mockCommunicator.waitForPopupLoaded.mockResolvedValue({});
        mockCommunicator.postRequestAndWaitForResponse.mockResolvedValue(mockSuccessResponse);
        mockUpdateListener = {
            onAccountsUpdate: jest.fn(),
            onChainIdUpdate: jest.fn(),
        };
        mockKeyManager = new SCWKeyManager_1.SCWKeyManager();
        SCWKeyManager_1.SCWKeyManager.mockImplementation(() => mockKeyManager);
        storageStoreSpy.mockReset();
        cipher_1.importKeyFromHexString.mockResolvedValue(mockCryptoKey);
        cipher_1.exportKeyToHexString.mockResolvedValueOnce('0xPublicKey');
        mockKeyManager.getSharedSecret.mockResolvedValue(mockCryptoKey);
        cipher_1.encryptContent.mockResolvedValueOnce(encryptedData);
        signer = new SCWSigner_1.SCWSigner({
            metadata: mockMetadata,
            communicator: mockCommunicator,
            updateListener: mockUpdateListener,
        });
    });
    describe('handshake', () => {
        it('should perform a successful handshake', async () => {
            cipher_1.decryptContent.mockResolvedValueOnce({
                result: {
                    value: ['0xAddress'],
                },
                data: {
                    chains: mockChains,
                    capabilities: mockCapabilities,
                },
            });
            await signer.handshake();
            expect(cipher_1.importKeyFromHexString).toHaveBeenCalledWith('public', '0xPublicKey');
            expect(mockKeyManager.setPeerPublicKey).toHaveBeenCalledWith(mockCryptoKey);
            expect(cipher_1.decryptContent).toHaveBeenCalledWith(encryptedData, mockCryptoKey);
            expect(storageStoreSpy).toHaveBeenCalledWith('availableChains', [
                { id: 1, rpcUrl: 'https://eth-rpc.example.com/1' },
                { id: 2, rpcUrl: 'https://eth-rpc.example.com/2' },
            ]);
            expect(storageStoreSpy).toHaveBeenCalledWith('walletCapabilities', mockCapabilities);
            expect(storageStoreSpy).toHaveBeenCalledWith('accounts', ['0xAddress']);
        });
        it('should throw an error if failure in response.content', async () => {
            const mockResponse = {
                id: '1-2-3-4-5',
                requestId: '1-2-3-4-5',
                sender: '0xPublicKey',
                content: { failure: mockError },
                timestamp: new Date(),
            };
            mockCommunicator.postRequestAndWaitForResponse.mockResolvedValue(mockResponse);
            await expect(signer.handshake()).rejects.toThrowError(mockError);
        });
    });
    describe('request', () => {
        it('should perform a successful request', async () => {
            const mockRequest = {
                method: 'personal_sign',
                params: ['0xMessage', '0xAddress'],
            };
            cipher_1.decryptContent.mockResolvedValueOnce({
                result: {
                    value: '0xSignature',
                },
            });
            const result = await signer.request(mockRequest);
            expect(cipher_1.encryptContent).toHaveBeenCalled();
            expect(mockCommunicator.postRequestAndWaitForResponse).toHaveBeenCalledWith(expect.objectContaining({
                sender: '0xPublicKey',
                content: { encrypted: encryptedData },
            }));
            expect(result).toEqual('0xSignature');
        });
        it('should throw an error if error in decrypted response', async () => {
            const mockRequest = {
                method: 'personal_sign',
                params: ['0xMessage', '0xAddress'],
            };
            cipher_1.decryptContent.mockResolvedValueOnce({
                result: {
                    error: mockError,
                },
            });
            await expect(signer.request(mockRequest)).rejects.toThrowError(mockError);
        });
        it('should update internal state for successful wallet_switchEthereumChain', async () => {
            const mockRequest = {
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x1' }],
            };
            cipher_1.decryptContent.mockResolvedValueOnce({
                result: {
                    value: null,
                },
                data: {
                    chains: mockChains,
                    capabilities: mockCapabilities,
                },
            });
            await signer.request(mockRequest);
            expect(storageStoreSpy).toHaveBeenCalledWith('availableChains', [
                { id: 1, rpcUrl: 'https://eth-rpc.example.com/1' },
                { id: 2, rpcUrl: 'https://eth-rpc.example.com/2' },
            ]);
            expect(storageStoreSpy).toHaveBeenCalledWith('walletCapabilities', mockCapabilities);
            expect(mockUpdateListener.onChainIdUpdate).toHaveBeenCalledWith(1);
        });
    });
    describe('disconnect', () => {
        it('should disconnect successfully', async () => {
            await signer.disconnect();
            expect(mockKeyManager.clear).toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=SCWSigner.test.js.map