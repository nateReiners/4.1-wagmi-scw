"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
const Cipher_1 = require("../../lib/Cipher");
const ScopedLocalStorage_1 = require("../../lib/ScopedLocalStorage");
const RelayAbstract_1 = require("../RelayAbstract");
const RelayEventManager_1 = require("../RelayEventManager");
const WalletLinkConnection_1 = require("./connection/WalletLinkConnection");
const WalletLinkWebSocket_1 = require("./connection/WalletLinkWebSocket");
const WalletLinkRelay_1 = require("./WalletLinkRelay");
const decryptMock = jest.fn().mockImplementation((text) => Promise.resolve(`"decrypted ${text}"`));
jest.spyOn(Cipher_1.Cipher.prototype, 'decrypt').mockImplementation(decryptMock);
describe('WalletLinkRelay', () => {
    const options = {
        linkAPIUrl: 'http://link-api-url',
        version: '0.0.0',
        darkMode: false,
        storage: new ScopedLocalStorage_1.ScopedLocalStorage('test'),
        relayEventManager: new RelayEventManager_1.RelayEventManager(),
        uiConstructor: jest.fn(),
    };
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(WalletLinkWebSocket_1.WalletLinkWebSocket.prototype, 'connect').mockReturnValue(Promise.resolve());
    });
    describe('resetAndReload', () => {
        it('should destroy the connection and connect again', async () => {
            const setSessionMetadataSpy = jest.spyOn(WalletLinkConnection_1.WalletLinkConnection.prototype, 'setSessionMetadata');
            const relay = new WalletLinkRelay_1.WalletLinkRelay(options);
            relay.resetAndReload();
            expect(setSessionMetadataSpy).toHaveBeenCalled();
        });
    });
    describe('subscribe', () => {
        it('should call handleIncomingEvent', async () => {
            var _a, _b;
            const serverMessageEvent = {
                type: 'Event',
                sessionId: 'sessionId',
                eventId: 'eventId',
                event: 'Web3Response',
                data: 'data',
            };
            jest.spyOn(JSON, 'parse').mockImplementation(() => {
                return {
                    type: 'WEB3_RESPONSE',
                    data: 'decrypted data',
                };
            });
            const relay = new WalletLinkRelay_1.WalletLinkRelay(options);
            const handleWeb3ResponseMessageSpy = jest.spyOn(relay, 'handleWeb3ResponseMessage');
            (_b = (_a = relay.connection.ws).incomingDataListener) === null || _b === void 0 ? void 0 : _b.call(_a, serverMessageEvent);
            expect(handleWeb3ResponseMessageSpy).toHaveBeenCalledWith(JSON.parse(await decryptMock(serverMessageEvent.data)));
        });
        it('should set isLinked with LinkedListener', async () => {
            var _a, _b;
            const relay = new WalletLinkRelay_1.WalletLinkRelay(options);
            expect(relay.isLinked).toBeFalsy();
            (_b = (_a = relay.connection.ws).incomingDataListener) === null || _b === void 0 ? void 0 : _b.call(_a, {
                type: 'IsLinkedOK',
                linked: true,
            });
            expect(relay.isLinked).toEqual(true);
        });
    });
    describe('setSessionConfigListener', () => {
        it('should update metadata with setSessionConfigListener', async () => {
            var _a, _b;
            const sessionConfig = {
                webhookId: 'webhookId',
                webhookUrl: 'webhookUrl',
                metadata: {
                    WalletUsername: 'username',
                },
            };
            const relay = new WalletLinkRelay_1.WalletLinkRelay(options);
            const metadataUpdatedSpy = jest.spyOn(relay, 'metadataUpdated');
            (_b = (_a = relay.connection.ws).incomingDataListener) === null || _b === void 0 ? void 0 : _b.call(_a, Object.assign(Object.assign({}, sessionConfig), { type: 'SessionConfigUpdated' }));
            expect(metadataUpdatedSpy).toHaveBeenCalledWith(RelayAbstract_1.WALLET_USER_NAME_KEY, await decryptMock(sessionConfig.metadata.WalletUsername));
        });
        it('should update chainId and jsonRpcUrl only when distinct', async () => {
            var _a, _b, _c, _d, _e, _f;
            const callback = jest.fn();
            const relay = new WalletLinkRelay_1.WalletLinkRelay(options);
            relay.setChainCallback(callback);
            const sessionConfig = {
                webhookId: 'webhookId',
                webhookUrl: 'webhookUrl',
                metadata: {
                    ChainId: 'ChainId',
                    JsonRpcUrl: 'JsonRpcUrl',
                },
            };
            // initial chain id and json rpc url
            (_b = (_a = relay.connection.ws).incomingDataListener) === null || _b === void 0 ? void 0 : _b.call(_a, Object.assign(Object.assign({}, sessionConfig), { type: 'GetSessionConfigOK' }));
            expect(callback).toHaveBeenCalledWith(await decryptMock(sessionConfig.metadata.ChainId), await decryptMock(sessionConfig.metadata.JsonRpcUrl));
            // same chain id and json rpc url
            (_d = (_c = relay.connection.ws).incomingDataListener) === null || _d === void 0 ? void 0 : _d.call(_c, Object.assign(Object.assign({}, sessionConfig), { type: 'SessionConfigUpdated' }));
            expect(callback).toHaveBeenCalledTimes(1); // distinctUntilChanged
            // different chain id and json rpc url
            const newSessionConfig = Object.assign(Object.assign({}, sessionConfig), { metadata: {
                    ChainId: 'ChainId2',
                    JsonRpcUrl: 'JsonRpcUrl2',
                } });
            (_f = (_e = relay.connection.ws).incomingDataListener) === null || _f === void 0 ? void 0 : _f.call(_e, Object.assign(Object.assign({}, newSessionConfig), { type: 'SessionConfigUpdated' }));
            expect(callback).toHaveBeenCalledWith(await decryptMock(newSessionConfig.metadata.ChainId), await decryptMock(newSessionConfig.metadata.JsonRpcUrl));
            expect(callback).toHaveBeenCalledTimes(2);
        });
    });
});
//# sourceMappingURL=WalletLinkRelay.test.js.map