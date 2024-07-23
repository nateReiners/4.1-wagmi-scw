"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrossDomainCommunicator = void 0;
const error_1 = require("../error");
class CrossDomainCommunicator {
    constructor() {
        this.url = undefined;
        this.connected = false;
        this.peerWindow = null;
        this.requestMap = new Map();
    }
    async connect() {
        if (this.connected)
            return;
        window.addEventListener('message', this.eventListener.bind(this));
        await this.setupPeerWindow();
        this.connected = true;
    }
    disconnect() {
        this.connected = false;
        window.removeEventListener('message', this.eventListener.bind(this));
        this.rejectWaitingRequests();
    }
    getTargetOrigin(options) {
        if (this.url)
            return this.url.origin;
        if (options === null || options === void 0 ? void 0 : options.bypassTargetOriginCheck)
            return '*';
        return undefined;
    }
    async postMessage(message, options) {
        const targetOrigin = this.getTargetOrigin(options);
        if (!targetOrigin || !this.peerWindow) {
            throw error_1.standardErrors.rpc.internal('Communicator: No peer window found');
        }
        this.peerWindow.postMessage(message, targetOrigin);
    }
    async postMessageForResponse(message) {
        this.postMessage(message);
        return new Promise((resolve, reject) => {
            this.requestMap.set(message.id, {
                resolve,
                reject,
            });
        });
    }
    eventListener(event) {
        var _a, _b, _c;
        if (event.origin !== ((_a = this.url) === null || _a === void 0 ? void 0 : _a.origin))
            return;
        const message = event.data;
        const { requestId } = message;
        if (!requestId) {
            this.handleIncomingMessage(message);
            return;
        }
        (_c = (_b = this.requestMap.get(requestId)) === null || _b === void 0 ? void 0 : _b.resolve) === null || _c === void 0 ? void 0 : _c.call(_b, message);
        this.requestMap.delete(requestId);
    }
    rejectWaitingRequests() {
        this.requestMap.forEach(({ reject }) => {
            reject(error_1.standardErrors.provider.userRejectedRequest('Request rejected'));
        });
        this.requestMap.clear();
    }
}
exports.CrossDomainCommunicator = CrossDomainCommunicator;
//# sourceMappingURL=CrossDomainCommunicator.js.map