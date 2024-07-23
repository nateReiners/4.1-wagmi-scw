"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RelayEventManager_1 = require("./RelayEventManager");
describe('WalletSDKRelayEventManager', () => {
    test('@makeRequestId', () => {
        const sdkRelayEventManager = new RelayEventManager_1.RelayEventManager();
        expect(sdkRelayEventManager.makeRequestId()).toEqual(1);
        expect(sdkRelayEventManager.makeRequestId()).toEqual(2);
        expect(sdkRelayEventManager.makeRequestId()).toEqual(3);
    });
});
//# sourceMappingURL=RelayEventManager.test.js.map