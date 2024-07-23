"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SCWSigner_1 = require("./scw/SCWSigner");
const SignerConfigurator_1 = require("./SignerConfigurator");
const WLSigner_1 = require("./walletlink/WLSigner");
const mockSetItem = jest.fn();
const mockGetItem = jest.fn();
const mockRemoveItem = jest.fn();
jest.mock(':core/storage/ScopedLocalStorage', () => {
    return {
        ScopedLocalStorage: jest.fn().mockImplementation(() => {
            return {
                getItem: mockGetItem,
                removeItem: mockRemoveItem,
                clear: jest.fn(),
                setItem: mockSetItem,
            };
        }),
    };
});
const mockPostMessageForResponse = jest.fn();
jest.mock(':core/communicator/PopUpCommunicator', () => {
    return {
        PopUpCommunicator: jest.fn().mockImplementation(() => {
            return {
                connect: jest.fn(),
                postMessage: jest.fn(),
                postMessageForResponse: mockPostMessageForResponse,
            };
        }),
    };
});
describe('SignerConfigurator', () => {
    let signerConfigurator;
    const updateListener = {
        onAccountsUpdate: jest.fn(),
        onChainUpdate: jest.fn(),
        onConnect: jest.fn(),
        onResetConnection: jest.fn(),
    };
    beforeEach(() => {
        signerConfigurator = new SignerConfigurator_1.SignerConfigurator({
            metadata: { appName: 'Test App', appLogoUrl: null, appChainIds: [1] },
            preference: { options: 'all' },
            updateListener,
        });
    });
    it('should handle disconnect correctly', async () => {
        signerConfigurator.clearStorage();
        expect(mockRemoveItem).toHaveBeenCalled();
    });
    it('should complete signerType selection correctly', async () => {
        mockPostMessageForResponse.mockResolvedValue({
            data: 'scw',
        });
        const signer = await signerConfigurator.selectSigner();
        expect(signer).toBeInstanceOf(SCWSigner_1.SCWSigner);
        expect(mockSetItem).toHaveBeenCalledWith('SignerType', 'scw');
    });
    describe('tryRestoringSignerFromPersistedType', () => {
        it('should init SCWSigner correctly', () => {
            mockGetItem.mockReturnValueOnce('scw');
            const signer = signerConfigurator.tryRestoringSignerFromPersistedType();
            expect(signer).toBeInstanceOf(SCWSigner_1.SCWSigner);
        });
        it('should init WLSigner correctly', () => {
            mockGetItem.mockReturnValueOnce('walletlink');
            const signer = signerConfigurator.tryRestoringSignerFromPersistedType();
            expect(signer).toBeInstanceOf(WLSigner_1.WLSigner);
        });
    });
});
//# sourceMappingURL=SignerConfigurator.test.js.map