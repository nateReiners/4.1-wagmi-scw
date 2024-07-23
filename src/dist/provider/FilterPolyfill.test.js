"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const type_1 = require("../core/type");
const provider_1 = require("../mocks/provider");
const FilterPolyfill_1 = require("./FilterPolyfill");
describe('FilterPolyfill', () => {
    let filter;
    beforeEach(() => {
        jest.useFakeTimers();
        filter = new FilterPolyfill_1.FilterPolyfill(provider_1.mockExtensionProvider);
    });
    it('should throttle block height requests', async () => {
        // Mock the _getCurrentBlockHeight method with different return values
        const mockGetCurrentBlockHeight = jest.spyOn(filter, '_getCurrentBlockHeight');
        mockGetCurrentBlockHeight
            .mockResolvedValueOnce((0, type_1.IntNumber)(123))
            .mockResolvedValueOnce((0, type_1.IntNumber)(456));
        // Call getCurrentBlockHeight twice in quick succession
        const height1Promise = filter.getCurrentBlockHeight();
        const height2Promise = filter.getCurrentBlockHeight();
        // Wait for promises to resolve
        const height1 = await height1Promise;
        const height2 = await height2Promise;
        // Ensure that the first call results in a network request,
        // but the second call is throttled and uses the cached value
        expect(mockGetCurrentBlockHeight).toHaveBeenCalledTimes(1);
        expect(height1).toBe(123);
        expect(height2).toBe(123);
    });
    it('should refresh block height after throttle interval', async () => {
        // Mock the _getCurrentBlockHeight method with different return values
        const mockGetCurrentBlockHeight = jest.spyOn(filter, '_getCurrentBlockHeight');
        mockGetCurrentBlockHeight
            .mockResolvedValueOnce((0, type_1.IntNumber)(123))
            .mockResolvedValueOnce((0, type_1.IntNumber)(456));
        // Call getCurrentBlockHeight and wait for the throttle interval to pass
        await filter.getCurrentBlockHeight();
        jest.advanceTimersByTime(1500); // Advance time by throttle interval
        // Call getCurrentBlockHeight again
        const height2 = await filter.getCurrentBlockHeight();
        // Ensure that the second call results in a network request due to throttling
        expect(mockGetCurrentBlockHeight).toHaveBeenCalledTimes(2);
        expect(height2).toBe(456);
    });
});
//# sourceMappingURL=FilterPolyfill.test.js.map