"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RPCFetchRequestHandler = void 0;
const error_1 = require("../core/error");
class RPCFetchRequestHandler {
    canHandleRequest(_) {
        return true;
    }
    async handleRequest(request, _, chain) {
        if (!chain.rpcUrl)
            throw error_1.standardErrors.rpc.internal('No RPC URL set for chain');
        const requestBody = Object.assign(Object.assign({}, request), { jsonrpc: '2.0', id: crypto.randomUUID() });
        const res = await window.fetch(chain.rpcUrl, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
        });
        const response = await res.json();
        return response;
    }
}
exports.RPCFetchRequestHandler = RPCFetchRequestHandler;
//# sourceMappingURL=RPCFetchRequestHandler.js.map