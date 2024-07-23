"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionRequestHandler = void 0;
const eth_block_tracker_1 = require("eth-block-tracker");
// TODO: When we update this package we should be able to fix this
//  eslint-disable-next-line @typescript-eslint/no-var-requires
const createSubscriptionManager = require('eth-json-rpc-filters/subscriptionManager');
const noop = () => { };
class SubscriptionRequestHandler {
    constructor({ provider }) {
        const blockTracker = new eth_block_tracker_1.PollingBlockTracker({
            provider: provider,
            pollingInterval: 15000,
            setSkipCacheFlag: true,
        });
        const { events, middleware } = createSubscriptionManager({
            blockTracker,
            provider,
        });
        this.events = events;
        this.subscriptionMiddleware = middleware;
    }
    canHandleRequest(request) {
        const subscriptionMethods = ['eth_subscribe', 'eth_unsubscribe'];
        return subscriptionMethods.includes(request.method);
    }
    async handleRequest(request) {
        const result = {};
        await this.subscriptionMiddleware(request, result, noop, noop);
        return result;
    }
    async onDisconnect() {
        this.subscriptionMiddleware.destroy();
    }
}
exports.SubscriptionRequestHandler = SubscriptionRequestHandler;
//# sourceMappingURL=SubscriptionRequestHandler.js.map