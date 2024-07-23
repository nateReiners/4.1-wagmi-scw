"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignRequestHandler = void 0;
const SignerConfigurator_1 = require("./SignerConfigurator");
const error_1 = require("../core/error");
class SignRequestHandler {
    constructor(options) {
        this.updateListener = options.updateListener;
        this.signerConfigurator = new SignerConfigurator_1.SignerConfigurator(options);
        this.tryRestoringSignerFromPersistedType();
    }
    async handleRequest(request) {
        try {
            const signer = await this.useSigner();
            if (request.method === 'eth_requestAccounts') {
                const accounts = await signer.handshake();
                this.updateListener.onConnect();
                return accounts;
            }
            return await signer.request(request);
        }
        catch (err) {
            if ((err === null || err === void 0 ? void 0 : err.code) === error_1.standardErrorCodes.provider.unauthorized) {
                this.updateListener.onResetConnection();
            }
            throw err;
        }
    }
    async onDisconnect() {
        this._signer = undefined;
        this.signerConfigurator.clearStorage();
    }
    tryRestoringSignerFromPersistedType() {
        this._signer = this.signerConfigurator.tryRestoringSignerFromPersistedType();
    }
    async useSigner() {
        if (this._signer)
            return this._signer;
        this._signer = await this.signerConfigurator.selectSigner();
        return this._signer;
    }
}
exports.SignRequestHandler = SignRequestHandler;
//# sourceMappingURL=SignRequestHandler.js.map