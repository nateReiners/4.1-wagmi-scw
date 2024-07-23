"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportedEthereumMethods = void 0;
var SupportedEthereumMethods;
(function (SupportedEthereumMethods) {
    SupportedEthereumMethods["EthRequestAccounts"] = "eth_requestAccounts";
    // Sign Transaction
    SupportedEthereumMethods["EthSendTransaction"] = "eth_sendTransaction";
    SupportedEthereumMethods["EthSignTransaction"] = "eth_signTransaction";
    SupportedEthereumMethods["EthSendRawTransaction"] = "eth_sendRawTransaction";
    // Sign Message
    SupportedEthereumMethods["EthSign"] = "eth_sign";
    SupportedEthereumMethods["PersonalSign"] = "personal_sign";
    SupportedEthereumMethods["EthSignTypedDataV1"] = "eth_signTypedData_v1";
    SupportedEthereumMethods["EthSignTypedDataV3"] = "eth_signTypedData_v3";
    SupportedEthereumMethods["EthSignTypedDataV4"] = "eth_signTypedData_v4";
    // Wallet
    SupportedEthereumMethods["WalletSwitchEthereumChain"] = "wallet_switchEthereumChain";
    SupportedEthereumMethods["WalletAddEthereumChain"] = "wallet_addEthereumChain";
    SupportedEthereumMethods["WalletGetCapabilities"] = "wallet_getCapabilities";
    SupportedEthereumMethods["WalletSendCalls"] = "wallet_sendCalls";
})(SupportedEthereumMethods || (exports.SupportedEthereumMethods = SupportedEthereumMethods = {}));
//# sourceMappingURL=Action.js.map