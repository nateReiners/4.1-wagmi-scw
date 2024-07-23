"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateRequestHandler = void 0;
const error_1 = require("../core/error");
class StateRequestHandler {
    async handleRequest(request, accounts, chain) {
        switch (request.method) {
            case 'eth_chainId':
                return chain.id;
            case 'eth_accounts':
                return this.eth_accounts(accounts);
            case 'eth_coinbase':
                return this.eth_accounts(accounts)[0];
            case 'net_version':
                return chain.id;
        }
        return Promise.reject(error_1.standardErrors.rpc.methodNotFound());
    }
    eth_accounts(accounts) {
        if (!accounts) {
            throw error_1.standardErrors.provider.unauthorized("Must call 'eth_requestAccounts' before 'eth_accounts'");
        }
        return accounts;
    }
    canHandleRequest(request) {
        const subscriptionMethods = ['eth_chainId', 'eth_accounts', 'eth_coinbase', 'net_version'];
        return subscriptionMethods.includes(request.method);
    }
}
exports.StateRequestHandler = StateRequestHandler;
//# sourceMappingURL=StateRequestHandler.js.map