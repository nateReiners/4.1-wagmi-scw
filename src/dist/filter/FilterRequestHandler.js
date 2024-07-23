"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterRequestHandler = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const FilterPolyfill_1 = require("./FilterPolyfill");
const error_1 = require("../core/error");
const util_1 = require("../core/util");
class FilterRequestHandler {
    constructor(fetchRPCFunction) {
        this.filterPolyfill = new FilterPolyfill_1.FilterPolyfill(fetchRPCFunction);
    }
    handleRequest(request) {
        const { method } = request;
        const params = request.params || [];
        switch (method) {
            case 'eth_newFilter':
                return this.eth_newFilter(params);
            case 'eth_newBlockFilter':
                return this.eth_newBlockFilter();
            case 'eth_newPendingTransactionFilter':
                return this.eth_newPendingTransactionFilter();
            case 'eth_getFilterChanges':
                return this.eth_getFilterChanges(params);
            case 'eth_getFilterLogs':
                return this.eth_getFilterLogs(params);
            case 'eth_uninstallFilter':
                return this.eth_uninstallFilter(params);
        }
        return Promise.reject(error_1.standardErrors.rpc.methodNotFound());
    }
    async eth_newFilter(params) {
        const param = params[0];
        const filterId = await this.filterPolyfill.newFilter(param);
        return { result: filterId };
    }
    async eth_newBlockFilter() {
        const filterId = await this.filterPolyfill.newBlockFilter();
        return { result: filterId };
    }
    async eth_newPendingTransactionFilter() {
        const filterId = await this.filterPolyfill.newPendingTransactionFilter();
        return { result: filterId };
    }
    async eth_uninstallFilter(params) {
        const filterId = (0, util_1.ensureHexString)(params[0]);
        const result = this.filterPolyfill.uninstallFilter(filterId);
        return { result };
    }
    eth_getFilterChanges(params) {
        const filterId = (0, util_1.ensureHexString)(params[0]);
        return this.filterPolyfill.getFilterChanges(filterId);
    }
    eth_getFilterLogs(params) {
        const filterId = (0, util_1.ensureHexString)(params[0]);
        return this.filterPolyfill.getFilterLogs(filterId);
    }
}
exports.FilterRequestHandler = FilterRequestHandler;
//# sourceMappingURL=FilterRequestHandler.js.map