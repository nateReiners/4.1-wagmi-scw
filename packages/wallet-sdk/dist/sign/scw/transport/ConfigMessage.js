"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isConfigMessage = exports.HostConfigEventType = exports.ClientConfigEventType = void 0;
var ClientConfigEventType;
(function (ClientConfigEventType) {
    ClientConfigEventType["SelectConnectionType"] = "selectConnectionType";
    ClientConfigEventType["DappOriginMessage"] = "dappOriginMessage";
    ClientConfigEventType["WalletLinkUrl"] = "walletLinkUrl";
    ClientConfigEventType["WalletLinkQrScanned"] = "walletLinkQrScanned";
})(ClientConfigEventType || (exports.ClientConfigEventType = ClientConfigEventType = {}));
var HostConfigEventType;
(function (HostConfigEventType) {
    HostConfigEventType["PopupListenerAdded"] = "popupListenerAdded";
    HostConfigEventType["PopupReadyForRequest"] = "popupReadyForRequest";
    HostConfigEventType["ConnectionTypeSelected"] = "connectionTypeSelected";
    HostConfigEventType["RequestWalletLinkUrl"] = "requestWalletLinkUrl";
    HostConfigEventType["PopupUnload"] = "popupUnload";
})(HostConfigEventType || (exports.HostConfigEventType = HostConfigEventType = {}));
function isConfigMessage(msg) {
    return msg.type === 'config' && 'event' in msg;
}
exports.isConfigMessage = isConfigMessage;
//# sourceMappingURL=ConfigMessage.js.map