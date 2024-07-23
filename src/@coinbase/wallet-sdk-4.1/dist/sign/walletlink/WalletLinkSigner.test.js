"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const preact_1 = require("@testing-library/preact");
const constants_1 = require("./relay/constants");
const fixtures_1 = require("./relay/mocks/fixtures");
const relay_1 = require("./relay/mocks/relay");
const WalletLinkSigner_1 = require("./WalletLinkSigner");
const constants_2 = require("../../core/constants");
const error_1 = require("../../core/error");
const ScopedLocalStorage_1 = require("../../util/ScopedLocalStorage");
jest.mock('./relay/WalletLinkRelay', () => {
    return {
        WalletLinkRelay: relay_1.mockedWalletLinkRelay,
    };
});
const testStorage = new ScopedLocalStorage_1.ScopedLocalStorage('walletlink', constants_2.WALLETLINK_URL);
const createAdapter = (options) => {
    const adapter = new WalletLinkSigner_1.WalletLinkSigner({
        metadata: { appName: 'test', appLogoUrl: null, appChainIds: [1] },
        updateListener: {
            onAccountsUpdate: () => { },
            onChainUpdate: () => { },
        },
    });
    if (options === null || options === void 0 ? void 0 : options.relay) {
        adapter._relay = options.relay;
    }
    return adapter;
};
describe('LegacyProvider', () => {
    afterEach(() => {
        testStorage.clear();
    });
    it('handles enabling the provider successfully', async () => {
        const provider = createAdapter();
        const response = await provider.request({ method: 'eth_requestAccounts' });
        expect(response[0]).toBe(fixtures_1.MOCK_ADDERESS.toLowerCase());
    });
    it('handles close', async () => {
        const relay = (0, relay_1.mockedWalletLinkRelay)();
        const spy = jest.spyOn(relay, 'resetAndReload');
        const provider = createAdapter({ relay });
        await provider.disconnect();
        expect(spy).toHaveBeenCalled();
    });
    it('handles making a rpc request', async () => {
        const provider = createAdapter();
        const response = await provider.request({
            method: 'eth_requestAccounts',
        });
        expect(response[0]).toBe(fixtures_1.MOCK_ADDERESS.toLowerCase());
    });
    it("does NOT update the providers address on a postMessage's 'addressesChanged' event", () => {
        const provider = createAdapter();
        // @ts-expect-error _addresses is private
        expect(provider._addresses).toEqual([]);
        const url = 'dapp.finance';
        Object.defineProperty(window, 'location', { value: { origin: url } });
        (0, preact_1.fireEvent)(window, new MessageEvent('message', {
            data: {
                data: {
                    action: 'addressesChanged',
                    addresses: ['0x0000000000000000000000000000000000001010'],
                },
                type: 'walletLinkMessage',
            },
            origin: url,
            source: window,
        }));
        // @ts-expect-error _addresses is private
        expect(provider._addresses).toEqual([]);
    });
    it('returns the users address on future eth_requestAccounts calls', async () => {
        const provider = createAdapter();
        // Set the account on the first request
        const response1 = await provider.request({
            method: 'eth_requestAccounts',
        });
        expect(response1[0]).toBe(fixtures_1.MOCK_ADDERESS.toLowerCase());
        // @ts-expect-error accessing private value for test
        expect(provider._addresses).toEqual([fixtures_1.MOCK_ADDERESS.toLowerCase()]);
        // Set the account on the first request
        const response2 = await provider.request({
            method: 'eth_requestAccounts',
        });
        expect(response2[0]).toBe(fixtures_1.MOCK_ADDERESS.toLowerCase());
    });
    it('gets the users address from storage on init', async () => {
        testStorage.setItem(constants_1.LOCAL_STORAGE_ADDRESSES_KEY, fixtures_1.MOCK_ADDERESS.toLowerCase());
        const provider = createAdapter();
        // @ts-expect-error accessing private value for test
        expect(provider._addresses).toEqual([fixtures_1.MOCK_ADDERESS.toLowerCase()]);
        // Set the account on the first request
        const response = await provider.request({
            method: 'eth_requestAccounts',
        });
        expect(response[0]).toBe(fixtures_1.MOCK_ADDERESS.toLowerCase());
    });
    describe('RPC Methods', () => {
        let provider = null;
        beforeEach(() => {
            testStorage.setItem(constants_1.LOCAL_STORAGE_ADDRESSES_KEY, fixtures_1.MOCK_ADDERESS.toLowerCase());
            provider = createAdapter();
        });
        afterEach(() => {
            provider = null;
        });
        test('eth_accounts', async () => {
            const response = await (provider === null || provider === void 0 ? void 0 : provider.request({
                method: 'eth_accounts',
            }));
            expect(response).toEqual([fixtures_1.MOCK_ADDERESS.toLowerCase()]);
        });
        test('eth_coinbase', async () => {
            const response = await (provider === null || provider === void 0 ? void 0 : provider.request({
                method: 'eth_coinbase',
            }));
            expect(response).toBe(fixtures_1.MOCK_ADDERESS.toLowerCase());
        });
        test('net_version', async () => {
            const response = await (provider === null || provider === void 0 ? void 0 : provider.request({
                method: 'net_version',
            }));
            expect(response).toEqual('1');
        });
        test('eth_chainId', async () => {
            const response = await (provider === null || provider === void 0 ? void 0 : provider.request({
                method: 'eth_chainId',
            }));
            expect(response).toEqual('0x1');
        });
        test('eth_requestAccounts', async () => {
            const response = await (provider === null || provider === void 0 ? void 0 : provider.request({
                method: 'eth_requestAccounts',
            }));
            expect(response).toEqual([fixtures_1.MOCK_ADDERESS.toLowerCase()]);
        });
        test('eth_sign success', async () => {
            const response = await (provider === null || provider === void 0 ? void 0 : provider.request({
                method: 'eth_sign',
                params: [fixtures_1.MOCK_ADDERESS.toLowerCase(), 'Super safe message'],
            }));
            expect(response).toBe('0x');
        });
        test('eth_sign fail bad address', async () => {
            await expect(() => provider === null || provider === void 0 ? void 0 : provider.request({
                method: 'eth_sign',
                params: ['0x123456789abcdef', 'Super safe message'],
            })).rejects.toThrowEIPError(error_1.standardErrorCodes.rpc.invalidParams, 'Invalid Ethereum address: 0x123456789abcdef');
        });
        test('eth_sign fail bad message format', async () => {
            await expect(() => provider === null || provider === void 0 ? void 0 : provider.request({
                method: 'eth_sign',
                params: [fixtures_1.MOCK_ADDERESS.toLowerCase(), 123456789],
            })).rejects.toThrowEIPError(error_1.standardErrorCodes.rpc.invalidParams, 'Not binary data: 123456789');
        });
        test('eth_ecRecover', async () => {
            const response = await (provider === null || provider === void 0 ? void 0 : provider.request({
                method: 'eth_ecRecover',
                params: ['Super safe message', '0x'],
            }));
            expect(response).toBe(fixtures_1.MOCK_ADDERESS);
        });
        test('personal_sign success', async () => {
            const response = await (provider === null || provider === void 0 ? void 0 : provider.request({
                method: 'personal_sign',
                params: ['My secret message', fixtures_1.MOCK_ADDERESS.toLowerCase()],
            }));
            expect(response).toBe('0x');
        });
        test('personal_sign fail', async () => {
            await expect(() => provider === null || provider === void 0 ? void 0 : provider.request({
                method: 'personal_sign',
                params: ['0x123456789abcdef', 'Super safe message'],
            })).rejects.toThrowEIPError(error_1.standardErrorCodes.rpc.invalidParams, 'Invalid Ethereum address: Super safe message');
        });
        test('personal_ecRecover', async () => {
            const response = await (provider === null || provider === void 0 ? void 0 : provider.request({
                method: 'personal_ecRecover',
                params: ['Super safe message', '0x'],
            }));
            expect(response).toBe(fixtures_1.MOCK_ADDERESS);
        });
        test('eth_signTransaction', async () => {
            const response = await (provider === null || provider === void 0 ? void 0 : provider.request({
                method: 'eth_signTransaction',
                params: [
                    {
                        from: fixtures_1.MOCK_ADDERESS,
                        to: fixtures_1.MOCK_ADDERESS,
                        gasPrice: '21000',
                        maxFeePerGas: '10000000000',
                        maxPriorityFeePerGas: '10000000000',
                        gas: '10000000000',
                        value: '10000000000',
                        data: '0xA0',
                        nonce: 1,
                    },
                ],
            }));
            expect(response).toBe(fixtures_1.MOCK_TX);
        });
        test('eth_sendRawTransaction', async () => {
            const response = await (provider === null || provider === void 0 ? void 0 : provider.request({
                method: 'eth_sendRawTransaction',
                params: [fixtures_1.MOCK_SIGNED_TX],
            }));
            expect(response).toBe(fixtures_1.MOCK_TX);
        });
        test('eth_sendTransaction', async () => {
            const response = await (provider === null || provider === void 0 ? void 0 : provider.request({
                method: 'eth_sendTransaction',
                params: [
                    {
                        from: fixtures_1.MOCK_ADDERESS,
                        to: fixtures_1.MOCK_ADDERESS,
                        gasPrice: '21000',
                        maxFeePerGas: '10000000000',
                        maxPriorityFeePerGas: '10000000000',
                        gas: '10000000000',
                        value: '10000000000',
                        data: '0xA0',
                        nonce: 1,
                    },
                ],
            }));
            expect(response).toBe(fixtures_1.MOCK_TX);
        });
        // eslint-disable-next-line
        test.skip('eth_signTypedData_v1', async () => {
            const response = await (provider === null || provider === void 0 ? void 0 : provider.request({
                method: 'eth_signTypedData_v1',
                params: [[fixtures_1.MOCK_TYPED_DATA], fixtures_1.MOCK_ADDERESS],
            }));
            expect(response).toBe('0x');
        });
        test('eth_signTypedData_v2', async () => {
            await expect(() => provider === null || provider === void 0 ? void 0 : provider.request({
                method: 'eth_signTypedData_v2',
                params: [],
            })).rejects.toThrowEIPError(error_1.standardErrorCodes.provider.unsupportedMethod, 'The requested method is not supported by this Ethereum provider.');
        });
        test('eth_signTypedData_v3', async () => {
            const response = await (provider === null || provider === void 0 ? void 0 : provider.request({
                method: 'eth_signTypedData_v3',
                params: [fixtures_1.MOCK_ADDERESS, fixtures_1.MOCK_TYPED_DATA],
            }));
            expect(response).toBe('0x');
        });
        test('eth_signTypedData_v4', async () => {
            const response = await (provider === null || provider === void 0 ? void 0 : provider.request({
                method: 'eth_signTypedData_v4',
                params: [fixtures_1.MOCK_ADDERESS, fixtures_1.MOCK_TYPED_DATA],
            }));
            expect(response).toBe('0x');
        });
        test('eth_signTypedData', async () => {
            const response = await (provider === null || provider === void 0 ? void 0 : provider.request({
                method: 'eth_signTypedData',
                params: [fixtures_1.MOCK_ADDERESS, fixtures_1.MOCK_TYPED_DATA],
            }));
            expect(response).toBe('0x');
        });
        test('wallet_addEthereumChain success', async () => {
            const response = await (provider === null || provider === void 0 ? void 0 : provider.request({
                method: 'wallet_addEthereumChain',
                params: [
                    {
                        chainId: '0x0539',
                        chainName: 'Leet Chain',
                        nativeCurrency: 'LEET',
                        rpcUrls: ['https://node.ethchain.com'],
                        blockExplorerUrls: ['https://leetscan.com'],
                        iconUrls: ['https://leetchain.com/icon.svg'],
                    },
                ],
            }));
            expect(response).toBeNull();
        });
        test('wallet_addEthereumChain missing RPC urls', async () => {
            const response = await (provider === null || provider === void 0 ? void 0 : provider.request({
                method: 'wallet_addEthereumChain',
                params: [
                    {
                        rpcUrls: [],
                    },
                ],
            }));
            expect(response).toBeUndefined();
        });
        test('wallet_addEthereumChain missing chainName', async () => {
            await expect(() => {
                return provider === null || provider === void 0 ? void 0 : provider.request({
                    method: 'wallet_addEthereumChain',
                    params: [{}],
                });
            }).rejects.toThrowEIPError(error_1.standardErrorCodes.rpc.invalidParams, 'chainName is a required field');
        });
        test('wallet_addEthereumChain native currency', async () => {
            await expect(() => {
                return provider === null || provider === void 0 ? void 0 : provider.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainId: '0x0539',
                            chainName: 'Leet Chain',
                        },
                    ],
                });
            }).rejects.toThrowEIPError(error_1.standardErrorCodes.rpc.invalidParams, 'nativeCurrency is a required field');
        });
        test('wallet_switchEthereumChain', async () => {
            const response = await (provider === null || provider === void 0 ? void 0 : provider.request({
                method: 'wallet_switchEthereumChain',
                params: [
                    {
                        chainId: '0x0539',
                    },
                ],
            }));
            expect(response).toBeNull();
        });
        test('wallet_switchEthereumChain w/ error code', async () => {
            const relay = (0, relay_1.mockedWalletLinkRelay)();
            jest
                .spyOn(relay, 'switchEthereumChain')
                .mockReturnValue(Promise.reject(error_1.standardErrors.provider.unsupportedChain()));
            const localProvider = createAdapter({ relay });
            await expect(() => {
                return localProvider.request({
                    method: 'wallet_switchEthereumChain',
                    params: [
                        {
                            chainId: '0x0539',
                        },
                    ],
                });
            }).rejects.toThrowEIPError(error_1.standardErrorCodes.provider.unsupportedChain, expect.stringContaining('Unrecognized chain ID'));
        });
        test('wallet_watchAsset', async () => {
            const response = await (provider === null || provider === void 0 ? void 0 : provider.request({
                method: 'wallet_watchAsset',
                params: [
                    {
                        type: 'ERC20',
                        options: {
                            address: '0xAdD4e55',
                        },
                    },
                ],
            }));
            expect(response).toBe(true);
        });
        test('wallet_watchAsset w/o valid params', async () => {
            await expect(() => provider === null || provider === void 0 ? void 0 : provider.request({
                method: 'wallet_watchAsset',
                params: [{}],
            })).rejects.toThrowEIPError(error_1.standardErrorCodes.rpc.invalidParams, 'Type is required');
        });
        test('wallet_watchAsset w/o valid asset type', async () => {
            await expect(() => provider === null || provider === void 0 ? void 0 : provider.request({
                method: 'wallet_watchAsset',
                params: [
                    {
                        type: 'ERC721',
                    },
                ],
            })).rejects.toThrowEIPError(error_1.standardErrorCodes.rpc.invalidParams, "Asset of type 'ERC721' is not supported");
        });
        test('wallet_watchAsset to throw option required error', async () => {
            await expect(() => provider === null || provider === void 0 ? void 0 : provider.request({
                method: 'wallet_watchAsset',
                params: [
                    {
                        type: 'ERC20',
                    },
                ],
            })).rejects.toThrowEIPError(error_1.standardErrorCodes.rpc.invalidParams, 'Options are required');
        });
        test('wallet_watchAsset to throw address required error', async () => {
            await expect(() => provider === null || provider === void 0 ? void 0 : provider.request({
                method: 'wallet_watchAsset',
                params: [
                    {
                        type: 'ERC20',
                        options: {},
                    },
                ],
            })).rejects.toThrowEIPError(error_1.standardErrorCodes.rpc.invalidParams, 'Address is required');
        });
    });
});
//# sourceMappingURL=WalletLinkSigner.test.js.map