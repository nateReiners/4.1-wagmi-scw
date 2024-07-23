"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignerConfigurator = void 0;
const SCWSigner_1 = require("./scw/SCWSigner");
const WLSigner_1 = require("./walletlink/WLSigner");
const PopUpCommunicator_1 = require("../core/communicator/PopUpCommunicator");
const constants_1 = require("../core/constants");
const error_1 = require("../core/error");
const message_1 = require("../core/message");
const ConfigMessage_1 = require("../core/message/ConfigMessage");
const ScopedLocalStorage_1 = require("../core/storage/ScopedLocalStorage");
const SIGNER_TYPE_KEY = 'SignerType';
class SignerConfigurator {
    constructor(options) {
        this.signerTypeStorage = new ScopedLocalStorage_1.ScopedLocalStorage('CBWSDK', 'SignerConfigurator');
        const _a = options.preference, { keysUrl } = _a, preferenceWithoutKeysUrl = __rest(_a, ["keysUrl"]);
        this.preference = preferenceWithoutKeysUrl;
        this.popupCommunicator = new PopUpCommunicator_1.PopUpCommunicator({
            url: keysUrl !== null && keysUrl !== void 0 ? keysUrl : constants_1.CB_KEYS_URL,
            onConfigUpdateMessage: this.handleConfigUpdateMessage.bind(this),
        });
        this.updateListener = options.updateListener;
        this.metadata = options.metadata;
    }
    tryRestoringSignerFromPersistedType() {
        const persistedSignerType = this.signerTypeStorage.getItem(SIGNER_TYPE_KEY);
        if (persistedSignerType) {
            return this.initSignerFromType(persistedSignerType);
        }
        return undefined;
    }
    async selectSigner() {
        const signerType = await this.requestSignerSelection();
        if (signerType === 'walletlink' && this.walletlinkSigner) {
            return this.walletlinkSigner;
        }
        const signer = this.initSignerFromType(signerType);
        return signer;
    }
    clearStorage() {
        this.signerTypeStorage.removeItem(SIGNER_TYPE_KEY);
    }
    async requestSignerSelection() {
        await this.popupCommunicator.connect();
        const message = (0, message_1.createMessage)({
            event: ConfigMessage_1.ConfigEvent.SelectSignerType,
            data: this.preference,
        });
        const response = await this.popupCommunicator.postMessageForResponse(message);
        const signerType = response.data;
        this.signerTypeStorage.setItem(SIGNER_TYPE_KEY, signerType);
        return signerType;
    }
    initSignerFromType(signerType) {
        const signerClasses = {
            scw: SCWSigner_1.SCWSigner,
            walletlink: WLSigner_1.WLSigner,
            extension: undefined,
        };
        const SignerClass = signerClasses[signerType];
        if (!SignerClass) {
            throw error_1.standardErrors.rpc.internal(`SignerConfigurator: Unknown signer type ${signerType}`);
        }
        return new SignerClass({
            metadata: this.metadata,
            popupCommunicator: this.popupCommunicator,
            updateListener: this.updateListener,
        });
    }
    async handleConfigUpdateMessage(message) {
        switch (message.event) {
            case ConfigMessage_1.ConfigEvent.WalletLinkSessionRequest:
                if (!this.walletlinkSigner) {
                    this.walletlinkSigner = this.initSignerFromType('walletlink');
                }
                await this.walletlinkSigner.handleWalletLinkSessionRequest();
                break;
        }
    }
}
exports.SignerConfigurator = SignerConfigurator;
//# sourceMappingURL=SignerConfigurator.js.map