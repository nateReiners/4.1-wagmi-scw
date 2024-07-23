"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PopUpCommunicator = void 0;
const version_1 = require("../../version");
const CrossDomainCommunicator_1 = require("../communicator/CrossDomainCommunicator");
const error_1 = require("../error");
const message_1 = require("../message");
const POPUP_WIDTH = 420;
const POPUP_HEIGHT = 540;
class PopUpCommunicator extends CrossDomainCommunicator_1.CrossDomainCommunicator {
    constructor(params) {
        super();
        this.url = new URL(params.url);
        this.onConfigUpdateMessage = params.onConfigUpdateMessage;
    }
    async setupPeerWindow() {
        this.openFixedSizePopUpWindow();
        return new Promise((resolve) => (this.resolveConnection = resolve));
    }
    async handleIncomingMessage(message) {
        var _a;
        if (!(0, message_1.isConfigUpdateMessage)(message))
            return false;
        switch (message.event) {
            case message_1.ConfigEvent.PopupLoaded:
                // Handshake Step 2: After receiving PopupHello from popup, Dapp sends DappHello
                // to FE to help FE confirm the origin of the Dapp, as well as SDK version.
                this.postMessage((0, message_1.createMessage)({
                    requestId: message.id,
                    data: { version: version_1.LIB_VERSION },
                }));
                (_a = this.resolveConnection) === null || _a === void 0 ? void 0 : _a.call(this);
                this.resolveConnection = undefined;
                return true;
            case message_1.ConfigEvent.PopupUnload:
                this.disconnect();
                this.closeChildWindow();
                return true;
            default: // handle non-popup config update messages
                this.onConfigUpdateMessage(message);
        }
        return false;
    }
    // Window Management
    openFixedSizePopUpWindow() {
        var _a;
        const left = (window.innerWidth - POPUP_WIDTH) / 2 + window.screenX;
        const top = (window.innerHeight - POPUP_HEIGHT) / 2 + window.screenY;
        if (!this.url) {
            throw error_1.standardErrors.rpc.internal('No url provided in PopUpCommunicator');
        }
        this.peerWindow = window.open(this.url, 'Smart Wallet', `width=${POPUP_WIDTH}, height=${POPUP_HEIGHT}, left=${left}, top=${top}`);
        (_a = this.peerWindow) === null || _a === void 0 ? void 0 : _a.focus();
        if (!this.peerWindow) {
            throw error_1.standardErrors.rpc.internal('Pop up window failed to open');
        }
    }
    closeChildWindow() {
        if (this.peerWindow && !this.peerWindow.closed) {
            this.peerWindow.close();
        }
        this.peerWindow = null;
    }
}
exports.PopUpCommunicator = PopUpCommunicator;
//# sourceMappingURL=PopUpCommunicator.js.map