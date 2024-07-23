"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const preact_1 = require("@testing-library/preact");
const error_1 = require("../core/error");
const type_1 = require("../core/type");
const ScopedLocalStorage_1 = require("../lib/ScopedLocalStorage");
const fixtures_1 = require("../mocks/fixtures");
const relay_1 = require("../mocks/relay");
const RelayAbstract_1 = require("../relay/RelayAbstract");
const RelayEventManager_1 = require("../relay/RelayEventManager");
const CoinbaseWalletProvider_1 = require("./CoinbaseWalletProvider");
const storage = new ScopedLocalStorage_1.ScopedLocalStorage('CoinbaseWalletProvider');
const setupCoinbaseWalletProvider = (options = {}) => {
    return new CoinbaseWalletProvider_1.CoinbaseWalletProvider(Object.assign({ chainId: 1, jsonRpcUrl: 'http://test.ethnode.com', qrUrl: null, overrideIsCoinbaseWallet: true, overrideIsCoinbaseBrowser: false, overrideIsMetaMask: false, relayEventManager: new RelayEventManager_1.RelayEventManager(), relayProvider: async () => Promise.resolve(new relay_1.MockRelayClass()), storage }, options));
};
const mockSuccessfulFetchResponse = () => {
    global.fetch = jest.fn().mockImplementationOnce(() => {
        return new Promise((resolve) => {
            resolve({
                ok: true,
                json: () => ({
                    jsonrpc: '2.0',
                    id: 1,
                    method: 'eth_blockNumber',
                    result: '0x1',
                }),
            });
        });
    });
};
describe('CoinbaseWalletProvider', () => {
    afterEach(() => {
        storage.clear();
    });
    it('instantiates', () => {
        const provider = setupCoinbaseWalletProvider();
        expect(provider).toBeInstanceOf(CoinbaseWalletProvider_1.CoinbaseWalletProvider);
    });
    it('gives provider info', () => {
        const provider = setupCoinbaseWalletProvider();
        expect(provider.selectedAddress).toBe(undefined);
        expect(provider.networkVersion).toBe('1');
        expect(provider.chainId).toBe('0x1');
        expect(provider.isWalletLink).toBe(true);
        expect(provider.isCoinbaseWallet).toBe(true);
        expect(provider.isCoinbaseBrowser).toBe(false);
        expect(provider.isMetaMask).toBe(false);
        expect(provider.host).toBe('http://test.ethnode.com');
        expect(provider.connected).toBe(true);
        expect(provider.isConnected()).toBe(true);
    });
    it('handles setting provider info', () => {
        const url = 'https://new.jsonRpcUrl.com';
        const provider = setupCoinbaseWalletProvider();
        provider.setProviderInfo(url, 1);
        expect(provider.host).toBe(url);
    });
    it('handles setting the app info', () => {
        const provider = setupCoinbaseWalletProvider();
        provider.setAppInfo('Test Dapp', null);
        expect(provider.host).toBe('http://test.ethnode.com');
    });
    it('handles setting disable reload on disconnect flag', () => {
        const provider = setupCoinbaseWalletProvider();
        provider.disableReloadOnDisconnect();
        expect(provider.reloadOnDisconnect).toBe(false);
    });
    it('handles subscriptions', () => {
        const provider = setupCoinbaseWalletProvider();
        expect(provider.supportsSubscriptions()).toBe(false);
        expect(() => {
            provider.subscribe();
        }).toThrowError('Subscriptions are not supported');
        expect(() => {
            provider.unsubscribe();
        }).toThrowError('Subscriptions are not supported');
    });
    it('handles enabling the provider successfully', async () => {
        const provider = setupCoinbaseWalletProvider();
        const response = await provider.enable();
        expect(response[0]).toBe(fixtures_1.MOCK_ADDERESS.toLowerCase());
    });
    it('handles close', async () => {
        const spy = jest.spyOn(relay_1.MockRelayClass.prototype, 'resetAndReload');
        const relay = new relay_1.MockRelayClass();
        const provider = setupCoinbaseWalletProvider({
            relayProvider: async () => Promise.resolve(relay),
        });
        await provider.close();
        expect(spy).toHaveBeenCalled();
    });
    it('handles disconnect', () => {
        const provider = setupCoinbaseWalletProvider();
        expect(provider.disconnect()).toBe(true);
    });
    it('handles making generic requests successfully', async () => {
        const provider = setupCoinbaseWalletProvider();
        const data = {
            from: fixtures_1.MOCK_ADDERESS,
            to: fixtures_1.MOCK_ADDERESS,
        };
        const action = 'cbSignAndSubmit';
        const response = await provider.genericRequest(data, action);
        expect(response).toBe('Success');
    });
    it('handles making a select provider request', async () => {
        const spy = jest.spyOn(relay_1.MockRelayClass.prototype, 'selectProvider');
        const relay = new relay_1.MockRelayClass();
        const provider = setupCoinbaseWalletProvider({
            relayProvider: async () => Promise.resolve(relay),
        });
        const providerOptions = [type_1.ProviderType.CoinbaseWallet, type_1.ProviderType.MetaMask];
        await provider.selectProvider(providerOptions);
        expect(spy).toHaveBeenCalledWith(providerOptions);
    });
    it('handles making a send with a string param', async () => {
        const provider = setupCoinbaseWalletProvider();
        const response = await provider.send('eth_requestAccounts');
        expect(response[0]).toBe(fixtures_1.MOCK_ADDERESS.toLowerCase());
    });
    it('handles making a rpc request', async () => {
        const provider = setupCoinbaseWalletProvider();
        const response = await provider.request({
            method: 'eth_requestAccounts',
        });
        expect(response[0]).toBe(fixtures_1.MOCK_ADDERESS.toLowerCase());
    });
    it('handles making a send with a rpc request', async () => {
        const mockCallback = jest.fn();
        const provider = setupCoinbaseWalletProvider();
        await provider.send({
            jsonrpc: '2.0',
            method: 'eth_requestAccounts',
            params: [],
            id: 1,
        }, mockCallback);
        expect(mockCallback).toHaveBeenCalledWith(null, expect.objectContaining({
            result: [fixtures_1.MOCK_ADDERESS.toLowerCase()],
        }));
    });
    it('handles making a sendAsync with a string param', async () => {
        const provider = setupCoinbaseWalletProvider();
        const mockCallback = jest.fn();
        await provider.sendAsync({
            jsonrpc: '2.0',
            method: 'eth_requestAccounts',
            params: [],
            id: 1,
        }, mockCallback);
        expect(mockCallback).toHaveBeenCalledWith(null, expect.objectContaining({
            result: [fixtures_1.MOCK_ADDERESS.toLowerCase()],
        }));
    });
    it('handles generic requests successfully', async () => {
        const relay = new relay_1.MockRelayClass();
        jest.spyOn(relay, 'genericRequest').mockReturnValue({
            cancel: () => { },
            promise: Promise.resolve({
                method: 'generic',
                result: 'Success',
            }),
        });
        const provider = setupCoinbaseWalletProvider({
            relayProvider: async () => {
                return Promise.resolve(relay);
            },
        });
        const data = {
            from: fixtures_1.MOCK_ADDERESS,
            to: fixtures_1.MOCK_ADDERESS,
        };
        const action = 'cbSignAndSubmit';
        const result = await provider.genericRequest(data, action);
        expect(result).toBe('Success');
    });
    it("does NOT update the providers address on a postMessage's 'addressesChanged' event", () => {
        const provider = setupCoinbaseWalletProvider();
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
    it('handles error responses with generic requests', async () => {
        const relay = new relay_1.MockRelayClass();
        jest.spyOn(relay, 'genericRequest').mockReturnValue({
            cancel: () => { },
            // @ts-expect-error result should be a string
            promise: Promise.resolve({
                method: 'generic',
                result: { foo: 'bar' },
            }),
        });
        const provider = setupCoinbaseWalletProvider({
            relayProvider: async () => {
                return Promise.resolve(relay);
            },
        });
        const data = {
            from: fixtures_1.MOCK_ADDERESS,
            to: fixtures_1.MOCK_ADDERESS,
        };
        const action = 'cbSignAndSubmit';
        await expect(() => provider.genericRequest(data, action)).rejects.toThrowEIPError(error_1.standardErrorCodes.rpc.internal, 'result was not a string');
    });
    it('handles user rejecting enable call', async () => {
        const relay = new relay_1.MockRelayClass();
        jest.spyOn(relay, 'requestEthereumAccounts').mockReturnValue({
            cancel: () => { },
            promise: Promise.reject(new Error('rejected')),
        });
        const provider = setupCoinbaseWalletProvider({
            storage: new ScopedLocalStorage_1.ScopedLocalStorage('reject-info'),
            relayProvider: async () => {
                return Promise.resolve(relay);
            },
        });
        await expect(() => provider.enable()).rejects.toThrowEIPError(error_1.standardErrorCodes.provider.userRejectedRequest, 'User denied account authorization');
    });
    it('handles user rejecting enable call with unknown error', async () => {
        const relay = new relay_1.MockRelayClass();
        jest.spyOn(relay, 'requestEthereumAccounts').mockReturnValue({
            cancel: () => { },
            promise: Promise.reject(new Error('Unknown')),
        });
        const provider = setupCoinbaseWalletProvider({
            storage: new ScopedLocalStorage_1.ScopedLocalStorage('unknown-error'),
            relayProvider: async () => {
                return Promise.resolve(relay);
            },
        });
        await expect(() => provider.enable()).rejects.toThrowEIPError(error_1.standardErrorCodes.rpc.internal, 'Unknown');
    });
    it('returns the users address on future eth_requestAccounts calls', async () => {
        const provider = setupCoinbaseWalletProvider();
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
        const localStorage = new ScopedLocalStorage_1.ScopedLocalStorage('test');
        localStorage.setItem(RelayAbstract_1.LOCAL_STORAGE_ADDRESSES_KEY, fixtures_1.MOCK_ADDERESS.toLowerCase());
        const provider = setupCoinbaseWalletProvider({
            storage: localStorage,
        });
        // @ts-expect-error accessing private value for test
        expect(provider._addresses).toEqual([fixtures_1.MOCK_ADDERESS.toLowerCase()]);
        // Set the account on the first request
        const response = await provider.request({
            method: 'eth_requestAccounts',
        });
        expect(response[0]).toBe(fixtures_1.MOCK_ADDERESS.toLowerCase());
    });
    it('handles scanning QR code with bad response', async () => {
        const relay = new relay_1.MockRelayClass();
        jest.spyOn(relay, 'scanQRCode').mockReturnValue({
            cancel: () => { },
            // @ts-expect-error result should be a string
            promise: Promise.resolve({
                method: 'scanQRCode',
                result: { foo: 'bar' },
            }),
        });
        const provider = setupCoinbaseWalletProvider({
            relayProvider: async () => Promise.resolve(relay),
        });
        await expect(() => provider.scanQRCode(new RegExp('cbwallet://cool'))).rejects.toThrowEIPError(error_1.standardErrorCodes.rpc.internal, 'result was not a string');
    });
    it('handles scanning QR code', async () => {
        const relay = new relay_1.MockRelayClass();
        jest.spyOn(relay, 'scanQRCode').mockReturnValue({
            cancel: () => { },
            promise: Promise.resolve({
                method: 'scanQRCode',
                result: 'cbwallet://result',
            }),
        });
        const provider = setupCoinbaseWalletProvider({
            relayProvider: async () => Promise.resolve(relay),
        });
        const result = await provider.scanQRCode(new RegExp('cbwallet://cool'));
        expect(result).toBe('cbwallet://result');
    });
    describe('RPC Methods', () => {
        let provider = null;
        let localStorage;
        beforeEach(() => {
            localStorage = new ScopedLocalStorage_1.ScopedLocalStorage('test');
            localStorage.setItem(RelayAbstract_1.LOCAL_STORAGE_ADDRESSES_KEY, fixtures_1.MOCK_ADDERESS.toLowerCase());
            provider = setupCoinbaseWalletProvider({
                storage: localStorage,
            });
        });
        afterEach(() => {
            provider = null;
            localStorage === null || localStorage === void 0 ? void 0 : localStorage.clear();
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
        test('eth_uninstallFilter', async () => {
            const response = await (provider === null || provider === void 0 ? void 0 : provider.request({
                method: 'eth_uninstallFilter',
                params: ['0xb'],
            }));
            expect(response).toBe(true);
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
        // eslint-disable-next-line jest/no-disabled-tests
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
            const relay = new relay_1.MockRelayClass();
            jest.spyOn(relay, 'switchEthereumChain').mockReturnValue({
                cancel: () => { },
                promise: Promise.reject(error_1.standardErrors.provider.unsupportedChain()),
            });
            const localProvider = setupCoinbaseWalletProvider({
                relayProvider: () => Promise.resolve(relay),
            });
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
        test('eth_newFilter', async () => {
            mockSuccessfulFetchResponse();
            const response = await (provider === null || provider === void 0 ? void 0 : provider.request({
                method: 'eth_newFilter',
                params: [
                    {
                        fromBlock: '0xa',
                        toBlock: '0xc',
                        address: fixtures_1.MOCK_ADDERESS,
                    },
                ],
            }));
            expect(response).toBe('0x2');
        });
        test('eth_newBlockFilter', async () => {
            mockSuccessfulFetchResponse();
            const response = await (provider === null || provider === void 0 ? void 0 : provider.request({
                method: 'eth_newBlockFilter',
            }));
            expect(response).toBe('0x2');
        });
        test('eth_newPendingTransactionFilter', async () => {
            mockSuccessfulFetchResponse();
            const response = await (provider === null || provider === void 0 ? void 0 : provider.request({
                method: 'eth_newPendingTransactionFilter',
            }));
            expect(response).toBe('0x2');
        });
        test('eth_getFilterChanges', async () => {
            mockSuccessfulFetchResponse();
            await (provider === null || provider === void 0 ? void 0 : provider.request({
                method: 'eth_newFilter',
                params: [
                    {
                        fromBlock: '0xa',
                        toBlock: '0xc',
                        address: fixtures_1.MOCK_ADDERESS,
                    },
                ],
            }));
            mockSuccessfulFetchResponse();
            const response = await (provider === null || provider === void 0 ? void 0 : provider.request({
                method: 'eth_getFilterChanges',
                params: ['0x2'],
            }));
            expect(response).toEqual([]); // expect empty result
        });
        test('eth_getFilterLogs', async () => {
            mockSuccessfulFetchResponse();
            await (provider === null || provider === void 0 ? void 0 : provider.request({
                method: 'eth_newFilter',
                params: [
                    {
                        fromBlock: '0xa',
                        toBlock: '0xc',
                        address: fixtures_1.MOCK_ADDERESS,
                    },
                ],
            }));
            mockSuccessfulFetchResponse();
            const response = await (provider === null || provider === void 0 ? void 0 : provider.request({
                method: 'eth_getFilterLogs',
                params: ['0x2'],
            }));
            expect(response).toEqual('0x1');
        });
    });
});
//# sourceMappingURL=CoinbaseWalletProvider.test.js.map