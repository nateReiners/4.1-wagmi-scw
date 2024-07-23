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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinbaseWalletProvider = void 0;
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const error_1 = require("./core/error");
const serialize_1 = require("./core/error/serialize");
const util_1 = require("./sign/util");
const provider_1 = require("./util/provider");
const Communicator_1 = require("./core/communicator/Communicator");
const method_1 = require("./core/provider/method");
const util_2 = require("./core/type/util");
const ScopedStorage_1 = require("./util/ScopedStorage");
class CoinbaseWalletProvider extends eventemitter3_1.default {
    constructor(_a) {
        var { baseStorage, metadata } = _a, _b = _a.preference, { keysUrl } = _b, preference = __rest(_b, ["keysUrl"]);
        super();
        this.handlers = {
            // eth_requestAccounts
            handshake: async (_) => {
                if (!this.signer) {
                    const signerType = await this.requestSignerSelection();
                    const signer = this.initSigner(signerType);
                    await signer.handshake();
                    this.signer = signer;
                    (0, util_1.storeSignerType)(signerType, this.baseStorage);
                }
                this.emit('connect', { chainId: (0, util_2.hexStringFromNumber)(this.signer.chain.id) });
                return this.signer.accounts;
            },
            sign: async (request) => {
                if (!this.signer) {
                    throw error_1.standardErrors.provider.unauthorized("Must call 'eth_requestAccounts' before other methods");
                }
                return await this.signer.request(request);
            },
            fetch: (request) => { var _a; return (0, provider_1.fetchRPCRequest)(request, (_a = this.signer) === null || _a === void 0 ? void 0 : _a.chain); },
            state: (request) => {
                var _a, _b, _c, _d;
                const getConnectedAccounts = () => {
                    if (this.signer)
                        return this.signer.accounts;
                    throw error_1.standardErrors.provider.unauthorized("Must call 'eth_requestAccounts' before other methods");
                };
                switch (request.method) {
                    case 'eth_chainId':
                        return (0, util_2.hexStringFromNumber)((_b = (_a = this.signer) === null || _a === void 0 ? void 0 : _a.chain.id) !== null && _b !== void 0 ? _b : 1);
                    case 'net_version':
                        return (_d = (_c = this.signer) === null || _c === void 0 ? void 0 : _c.chain.id) !== null && _d !== void 0 ? _d : 1; // default to mainnet
                    case 'eth_accounts':
                        return getConnectedAccounts();
                    case 'eth_coinbase':
                        return getConnectedAccounts()[0];
                    default:
                        return this.handlers.unsupported(request);
                }
            },
            deprecated: ({ method }) => {
                throw error_1.standardErrors.rpc.methodNotSupported(`Method ${method} is deprecated.`);
            },
            unsupported: ({ method }) => {
                throw error_1.standardErrors.rpc.methodNotSupported(`Method ${method} is not supported.`);
            },
        };
        this.isCoinbaseWallet = true;
        this.baseStorage = baseStorage;
        this.metadata = metadata;
        this.preference = preference;
        this.communicator = new Communicator_1.Communicator(keysUrl);
        // Load states from storage
        const signerType = (0, util_1.loadSignerType)(baseStorage);
        this.signer = signerType ? this.initSigner(signerType) : null;
    }
    async request(args) {
        try {
            (0, provider_1.checkErrorForInvalidRequestArgs)(args);
            return (await this.handleRequest(args));
        }
        catch (error) {
            const { code } = error;
            if (code === error_1.standardErrorCodes.provider.unauthorized)
                this.disconnect();
            return Promise.reject((0, serialize_1.serializeError)(error));
        }
    }
    async handleRequest(request) {
        var _a;
        const category = (_a = (0, method_1.determineMethodCategory)(request.method)) !== null && _a !== void 0 ? _a : 'fetch';
        return this.handlers[category](request);
    }
    /** @deprecated Use `.request({ method: 'eth_requestAccounts' })` instead. */
    async enable() {
        console.warn(`.enable() has been deprecated. Please use .request({ method: "eth_requestAccounts" }) instead.`);
        return await this.request({
            method: 'eth_requestAccounts',
        });
    }
    async disconnect() {
        var _a;
        (_a = this.signer) === null || _a === void 0 ? void 0 : _a.disconnect();
        ScopedStorage_1.ScopedStorage.clearAll(this.baseStorage);
        this.emit('disconnect', error_1.standardErrors.provider.disconnected('User initiated disconnection'));
    }
    requestSignerSelection() {
        return (0, util_1.fetchSignerType)({
            communicator: this.communicator,
            preference: this.preference,
            metadata: this.metadata,
        });
    }
    initSigner(signerType) {
        return (0, util_1.createSigner)({
            signerType,
            metadata: this.metadata,
            communicator: this.communicator,
            updateListener: {
                onAccountsUpdate: (accounts) => this.emit('accountsChanged', accounts),
                onChainIdUpdate: (id) => this.emit('chainChanged', (0, util_2.hexStringFromNumber)(id)),
            },
        });
    }
}
exports.CoinbaseWalletProvider = CoinbaseWalletProvider;
//# sourceMappingURL=CoinbaseWalletProvider.js.map