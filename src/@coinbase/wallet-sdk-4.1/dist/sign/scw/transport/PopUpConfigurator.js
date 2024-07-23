"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PopUpConfigurator = void 0;
const version_1 = require("../../../version");
const ConfigMessage_1 = require("./ConfigMessage");
const error_1 = require("../../../core/error");
class PopUpConfigurator {
    constructor({ communicator }) {
        this.communicator = communicator;
    }
    handleConfigMessage(message) {
        var _a, _b;
        switch (message.event.type) {
            case ConfigMessage_1.HostConfigEventType.PopupListenerAdded:
                // Handshake Step 2: After receiving POPUP_LISTENER_ADDED_MESSAGE from Dapp,
                // Dapp sends DAPP_ORIGIN_MESSAGE to FE to help FE confirm the origin of the Dapp
                this.postClientConfigMessage(ConfigMessage_1.ClientConfigEventType.DappOriginMessage, {
                    sdkVersion: version_1.LIB_VERSION,
                });
                break;
            case ConfigMessage_1.HostConfigEventType.PopupReadyForRequest:
                // Handshake Step 4: After receiving POPUP_READY_MESSAGE from Dapp, FE knows that
                // Dapp is ready to receive requests, handshake is done
                (_a = this.resolvePopupConnection) === null || _a === void 0 ? void 0 : _a.call(this);
                this.resolvePopupConnection = undefined;
                break;
            case ConfigMessage_1.HostConfigEventType.ConnectionTypeSelected:
                if (!this.communicator.connected)
                    return;
                (_b = this.signerTypeSelectionFulfillment) === null || _b === void 0 ? void 0 : _b.resolve(message.event.value);
                this.signerTypeSelectionFulfillment = undefined;
                break;
            case ConfigMessage_1.HostConfigEventType.RequestWalletLinkUrl:
                if (!this.communicator.connected)
                    return;
                if (!this.getWalletLinkQRCodeUrlCallback) {
                    throw error_1.standardErrors.rpc.internal('getWalletLinkQRCodeUrlCallback not set');
                }
                this.respondToWlQRCodeUrlRequest();
                break;
            case ConfigMessage_1.HostConfigEventType.PopupUnload:
                this.communicator.disconnect();
                break;
        }
    }
    postClientConfigMessage(type, options) {
        if (options &&
            type !== ConfigMessage_1.ClientConfigEventType.SelectConnectionType &&
            type !== ConfigMessage_1.ClientConfigEventType.DappOriginMessage) {
            throw error_1.standardErrors.rpc.internal('ClientConfigEvent does not accept options');
        }
        const configMessage = {
            type: 'config',
            id: crypto.randomUUID(),
            event: {
                type,
                value: options,
            },
        };
        this.communicator.postMessage(configMessage);
    }
    onDisconnect() {
        var _a;
        this.resolvePopupConnection = undefined;
        (_a = this.signerTypeSelectionFulfillment) === null || _a === void 0 ? void 0 : _a.reject(error_1.standardErrors.provider.userRejectedRequest('Request rejected'));
        this.signerTypeSelectionFulfillment = undefined;
    }
    respondToWlQRCodeUrlRequest() {
        if (!this.getWalletLinkQRCodeUrlCallback) {
            throw error_1.standardErrors.rpc.internal('PopUpCommunicator.getWalletLinkQRCodeUrlCallback not set');
        }
        const walletLinkQRCodeUrl = this.getWalletLinkQRCodeUrlCallback();
        const configMessage = {
            type: 'config',
            id: crypto.randomUUID(),
            event: {
                type: ConfigMessage_1.ClientConfigEventType.WalletLinkUrl,
                value: walletLinkQRCodeUrl,
            },
        };
        this.communicator.postMessage(configMessage);
    }
}
exports.PopUpConfigurator = PopUpConfigurator;
//# sourceMappingURL=PopUpConfigurator.js.map