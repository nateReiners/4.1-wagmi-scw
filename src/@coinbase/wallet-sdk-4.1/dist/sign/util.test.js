"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
const Communicator_1 = require("../core/communicator/Communicator");
describe('SignerConfigurator', () => {
    describe('handshake', () => {
        const metadata = { appName: 'Test App', appLogoUrl: null, appChainIds: [1] };
        const preference = { options: 'all' };
        it('should complete signerType selection correctly', async () => {
            const communicator = new Communicator_1.Communicator();
            communicator.postMessage = jest.fn();
            communicator.onMessage = jest.fn().mockResolvedValue({
                data: 'scw',
            });
            const signerType = await (0, util_1.fetchSignerType)({
                communicator,
                preference,
                metadata,
            });
            expect(signerType).toEqual('scw');
        });
    });
});
//# sourceMappingURL=util.test.js.map