"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PopUpCommunicator = void 0;
const ConfigMessage_1 = require("./ConfigMessage");
const PopUpConfigurator_1 = require("./PopUpConfigurator");
const CrossDomainCommunicator_1 = require("../../../core/communicator/CrossDomainCommunicator");
const error_1 = require("../../../core/error");
// TODO: how to set/change configurations?
const POPUP_WIDTH = 420;
const POPUP_HEIGHT = 540;
class PopUpCommunicator extends CrossDomainCommunicator_1.CrossDomainCommunicator {
    constructor({ url }) {
        super();
        this.requestMap = new Map();
        this.url = new URL(url);
        this.popUpConfigurator = new PopUpConfigurator_1.PopUpConfigurator({ communicator: this });
    }
    onConnect() {
        return new Promise((resolve) => {
            this.popUpConfigurator.resolvePopupConnection = () => {
                this.connected = true;
                resolve();
            };
            this.openFixedSizePopUpWindow();
        });
    }
    onEvent(event) {
        var _a, _b;
        if (event.origin !== ((_a = this.url) === null || _a === void 0 ? void 0 : _a.origin))
            return;
        const message = event.data;
        if ((0, ConfigMessage_1.isConfigMessage)(message)) {
            this.popUpConfigurator.handleConfigMessage(message);
            return;
        }
        if (!this.connected)
            return;
        if (!('requestId' in message))
            return;
        const requestId = message.requestId;
        const resolveFunction = (_b = this.requestMap.get(requestId)) === null || _b === void 0 ? void 0 : _b.resolve;
        this.requestMap.delete(requestId);
        resolveFunction === null || resolveFunction === void 0 ? void 0 : resolveFunction(message);
    }
    onDisconnect() {
        this.connected = false;
        this.closeChildWindow();
        this.requestMap.forEach((fulfillment, uuid, map) => {
            fulfillment.reject(error_1.standardErrors.provider.userRejectedRequest('Request rejected'));
            map.delete(uuid);
        });
        this.popUpConfigurator.onDisconnect();
    }
    setGetWalletLinkQRCodeUrlCallback(callback) {
        this.popUpConfigurator.getWalletLinkQRCodeUrlCallback = callback;
    }
    selectSignerType({ smartWalletOnly, isExtensionSignerAvailable, }) {
        return new Promise((resolve, reject) => {
            this.popUpConfigurator.signerTypeSelectionFulfillment = { resolve, reject };
            this.popUpConfigurator.postClientConfigMessage(ConfigMessage_1.ClientConfigEventType.SelectConnectionType, {
                smartWalletOnly,
                isExtensionSignerAvailable,
            });
        });
    }
    walletLinkQrScanned() {
        this.popUpConfigurator.postClientConfigMessage(ConfigMessage_1.ClientConfigEventType.WalletLinkQrScanned);
    }
    request(message) {
        return new Promise((resolve, reject) => {
            this.postMessage(message);
            const fulfillment = {
                message,
                resolve,
                reject,
            };
            this.requestMap.set(message.id, fulfillment);
        });
    }
    // Window Management
    openFixedSizePopUpWindow() {
        var _a;
        const left = (window.innerWidth - POPUP_WIDTH) / 2 + window.screenX;
        const top = (window.innerHeight - POPUP_HEIGHT) / 2 + window.screenY;
        const urlParams = new URLSearchParams();
        urlParams.append('opener', encodeURIComponent(window.location.href));
        if (!this.url) {
            throw error_1.standardErrors.rpc.internal('No url provided in PopUpCommunicator');
        }
        const popupUrl = new URL(this.url);
        popupUrl.search = urlParams.toString();
        this.peerWindow = window.open(popupUrl, 'SCW Child Window', `width=${POPUP_WIDTH}, height=${POPUP_HEIGHT}, left=${left}, top=${top}`);
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