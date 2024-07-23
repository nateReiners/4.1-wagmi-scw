"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SCWSigner = void 0;
const SCWKeyManager_1 = require("./SCWKeyManager");
const error_1 = require("../../core/error");
const util_1 = require("../../core/type/util");
const cipher_1 = require("../../util/cipher");
const ScopedStorage_1 = require("../../util/ScopedStorage");
const ACCOUNTS_KEY = 'accounts';
const ACTIVE_CHAIN_STORAGE_KEY = 'activeChain';
const AVAILABLE_CHAINS_STORAGE_KEY = 'availableChains';
const WALLET_CAPABILITIES_STORAGE_KEY = 'walletCapabilities';
class SCWSigner {
    get accounts() {
        return this._accounts;
    }
    get chain() {
        return this._chain;
    }
    constructor(params) {
        var _a, _b, _c;
        this.metadata = params.metadata;
        this.communicator = params.communicator;
        this.updateListener = params.updateListener;
        this.keyManager = new SCWKeyManager_1.SCWKeyManager();
        this.storage = new ScopedStorage_1.ScopedStorage('CBWSDK', 'SCWStateManager');
        this._accounts = (_a = this.storage.loadObject(ACCOUNTS_KEY)) !== null && _a !== void 0 ? _a : [];
        this._chain = this.storage.loadObject(ACTIVE_CHAIN_STORAGE_KEY) || {
            id: (_c = (_b = params.metadata.appChainIds) === null || _b === void 0 ? void 0 : _b[0]) !== null && _c !== void 0 ? _c : 1,
        };
        this.handshake = this.handshake.bind(this);
        this.request = this.request.bind(this);
        this.createRequestMessage = this.createRequestMessage.bind(this);
        this.decryptResponseMessage = this.decryptResponseMessage.bind(this);
    }
    async handshake() {
        const handshakeMessage = await this.createRequestMessage({
            handshake: {
                method: 'eth_requestAccounts',
                params: this.metadata,
            },
        });
        const response = await this.communicator.postRequestAndWaitForResponse(handshakeMessage);
        // store peer's public key
        if ('failure' in response.content)
            throw response.content.failure;
        const peerPublicKey = await (0, cipher_1.importKeyFromHexString)('public', response.sender);
        await this.keyManager.setPeerPublicKey(peerPublicKey);
        const decrypted = await this.decryptResponseMessage(response);
        const result = decrypted.result;
        if ('error' in result)
            throw result.error;
        const accounts = result.value;
        this._accounts = accounts;
        this.storage.storeObject(ACCOUNTS_KEY, accounts);
        this.updateListener.onAccountsUpdate(accounts);
    }
    async request(request) {
        switch (request.method) {
            case 'wallet_getCapabilities':
                return this.storage.loadObject(WALLET_CAPABILITIES_STORAGE_KEY);
            case 'wallet_switchEthereumChain':
                return this.handleSwitchChainRequest(request);
            default:
                return this.sendRequestToPopup(request);
        }
    }
    async sendRequestToPopup(request) {
        // Open the popup before constructing the request message.
        // This is to ensure that the popup is not blocked by some browsers (i.e. Safari)
        await this.communicator.waitForPopupLoaded();
        const response = await this.sendEncryptedRequest(request);
        const decrypted = await this.decryptResponseMessage(response);
        const result = decrypted.result;
        if ('error' in result)
            throw result.error;
        return result.value;
    }
    async disconnect() {
        this.storage.clear();
        await this.keyManager.clear();
    }
    /**
     * @returns `null` if the request was successful.
     * https://eips.ethereum.org/EIPS/eip-3326#wallet_switchethereumchain
     */
    async handleSwitchChainRequest(request) {
        var _a;
        const params = request.params;
        if (!params || !((_a = params[0]) === null || _a === void 0 ? void 0 : _a.chainId)) {
            throw error_1.standardErrors.rpc.invalidParams();
        }
        const chainId = (0, util_1.ensureIntNumber)(params[0].chainId);
        const localResult = this.updateChain(chainId);
        if (localResult)
            return null;
        const popupResult = await this.sendRequestToPopup(request);
        if (popupResult === null) {
            this.updateChain(chainId);
        }
        return popupResult;
    }
    async sendEncryptedRequest(request) {
        const sharedSecret = await this.keyManager.getSharedSecret();
        if (!sharedSecret) {
            throw error_1.standardErrors.provider.unauthorized('No valid session found, try requestAccounts before other methods');
        }
        const encrypted = await (0, cipher_1.encryptContent)({
            action: request,
            chainId: this.chain.id,
        }, sharedSecret);
        const message = await this.createRequestMessage({ encrypted });
        return this.communicator.postRequestAndWaitForResponse(message);
    }
    async createRequestMessage(content) {
        const publicKey = await (0, cipher_1.exportKeyToHexString)('public', await this.keyManager.getOwnPublicKey());
        return {
            id: crypto.randomUUID(),
            sender: publicKey,
            content,
            timestamp: new Date(),
        };
    }
    async decryptResponseMessage(message) {
        var _a, _b;
        const content = message.content;
        // throw protocol level error
        if ('failure' in content) {
            throw content.failure;
        }
        const sharedSecret = await this.keyManager.getSharedSecret();
        if (!sharedSecret) {
            throw error_1.standardErrors.provider.unauthorized('Invalid session');
        }
        const response = await (0, cipher_1.decryptContent)(content.encrypted, sharedSecret);
        const availableChains = (_a = response.data) === null || _a === void 0 ? void 0 : _a.chains;
        if (availableChains) {
            const chains = Object.entries(availableChains).map(([id, rpcUrl]) => ({
                id: Number(id),
                rpcUrl,
            }));
            this.storage.storeObject(AVAILABLE_CHAINS_STORAGE_KEY, chains);
            this.updateChain(this.chain.id, chains);
        }
        const walletCapabilities = (_b = response.data) === null || _b === void 0 ? void 0 : _b.capabilities;
        if (walletCapabilities) {
            this.storage.storeObject(WALLET_CAPABILITIES_STORAGE_KEY, walletCapabilities);
        }
        return response;
    }
    updateChain(chainId, newAvailableChains) {
        const chains = newAvailableChains !== null && newAvailableChains !== void 0 ? newAvailableChains : this.storage.loadObject(AVAILABLE_CHAINS_STORAGE_KEY);
        const chain = chains === null || chains === void 0 ? void 0 : chains.find((chain) => chain.id === chainId);
        if (!chain)
            return false;
        if (chain !== this.chain) {
            this._chain = chain;
            this.storage.storeObject(ACTIVE_CHAIN_STORAGE_KEY, chain);
            this.updateListener.onChainIdUpdate(chain.id);
        }
        return true;
    }
}
exports.SCWSigner = SCWSigner;
