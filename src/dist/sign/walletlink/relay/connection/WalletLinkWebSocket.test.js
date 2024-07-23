"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jest_websocket_mock_1 = __importDefault(require("jest-websocket-mock"));
const WalletLinkWebSocket_1 = require("./WalletLinkWebSocket");
const type_1 = require("../../../../core/type");
describe('WalletLinkWebSocket', () => {
    let server;
    let rxWS;
    beforeEach(() => {
        server = new jest_websocket_mock_1.default('ws://localhost:1234');
        rxWS = new WalletLinkWebSocket_1.WalletLinkWebSocket('http://localhost:1234');
    });
    afterEach(() => {
        jest_websocket_mock_1.default.clean();
    });
    describe('is connected', () => {
        test('@connect & @disconnect', async () => {
            const connectionStateListener = jest.fn();
            rxWS.setConnectionStateListener(connectionStateListener);
            await rxWS.connect();
            await server.connected;
            expect(connectionStateListener).toHaveBeenCalledWith(WalletLinkWebSocket_1.ConnectionState.CONNECTED);
            // Sends data
            const webSocketSendMock = jest
                .spyOn(WebSocket.prototype, 'send')
                .mockImplementation(() => { });
            rxWS.sendData('data');
            expect(webSocketSendMock).toHaveBeenCalledWith('data');
            // Disconnects
            rxWS.disconnect();
            expect(connectionStateListener).toHaveBeenCalledWith(WalletLinkWebSocket_1.ConnectionState.DISCONNECTED);
            // @ts-expect-error test private methods
            expect(rxWS.webSocket).toBe(null);
        });
        describe('errors & event listeners', () => {
            afterEach(() => rxWS.disconnect());
            test('@connect throws error when connecting again', async () => {
                await rxWS.connect();
                await expect(rxWS.connect()).rejects.toThrow('webSocket object is not null');
            });
            test('@connect throws error & fails to set websocket instance', async () => {
                const errorConnect = new WalletLinkWebSocket_1.WalletLinkWebSocket('');
                await expect(errorConnect.connect()).rejects.toThrow("Failed to construct 'WebSocket': 1 argument required, but only 0 present.");
            });
            test('onclose event throws error', async () => {
                await rxWS.connect();
                await server.connected;
                server.error();
                await expect(rxWS.connect()).rejects.toThrow('websocket error 1000: ');
            });
            test('onmessage event emits message', async () => {
                const incomingDataListener = jest.fn();
                rxWS.setIncomingDataListener(incomingDataListener);
                await rxWS.connect();
                await server.connected;
                const message = {
                    type: 'OK',
                    id: (0, type_1.IntNumber)(1),
                    sessionId: '123',
                };
                server.send(JSON.stringify(message));
                expect(incomingDataListener).toHaveBeenCalledWith(message);
            });
            test('onmessage event emits heartbeat message', async () => {
                const incomingDataListener = jest.fn();
                rxWS.setIncomingDataListener(incomingDataListener);
                await rxWS.connect();
                await server.connected;
                server.send('h');
                expect(incomingDataListener).toHaveBeenCalledWith({
                    type: 'Heartbeat',
                });
            });
        });
    });
    describe('is not connected', () => {
        test('disconnect returns', () => {
            const webSocketCloseMock = jest
                .spyOn(WebSocket.prototype, 'close')
                .mockImplementation(() => { });
            rxWS.disconnect();
            expect(webSocketCloseMock).not.toBeCalled();
        });
    });
});
//# sourceMappingURL=WalletLinkWebSocket.test.js.map