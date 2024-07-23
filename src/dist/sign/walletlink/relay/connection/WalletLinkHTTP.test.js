"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WalletLinkHTTP_1 = require("./WalletLinkHTTP");
describe('WalletLinkHTTP', () => {
    const linkAPIUrl = 'https://example.com';
    const sessionId = '123';
    const sessionKey = 'abc';
    it('should construct a WalletLinkHTTP instance with auth header', () => {
        const walletLinkHTTP = new WalletLinkHTTP_1.WalletLinkHTTP(linkAPIUrl, sessionId, sessionKey);
        expect(walletLinkHTTP.auth).toEqual('Basic MTIzOmFiYw==');
    });
    describe('fetchUnseenEvents', () => {
        let events;
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () => ({
                events,
                timestamp: 123,
            }),
        });
        beforeEach(() => {
            events = [];
        });
        describe('fetchUnseenEvents', () => {
            it('should return an empty array if there are no unseen events', async () => {
                const walletLinkHTTP = new WalletLinkHTTP_1.WalletLinkHTTP(linkAPIUrl, sessionId, sessionKey);
                jest.spyOn(walletLinkHTTP, 'markUnseenEventsAsSeen').mockImplementation(() => { });
                const result = await walletLinkHTTP.fetchUnseenEvents();
                expect(result).toEqual([]);
            });
            it('should return an array of unseen events', async () => {
                events = [
                    {
                        id: '1',
                        event: 'Web3Response',
                        data: 'data 1',
                    },
                    {
                        id: '2',
                        event: 'Web3Response',
                        data: 'data 2',
                    },
                ];
                const walletLinkHTTP = new WalletLinkHTTP_1.WalletLinkHTTP(linkAPIUrl, sessionId, sessionKey);
                jest.spyOn(walletLinkHTTP, 'markUnseenEventsAsSeen').mockImplementation(() => { });
                const result = await walletLinkHTTP.fetchUnseenEvents();
                expect(result).toEqual([
                    {
                        type: 'Event',
                        sessionId: '123',
                        eventId: '1',
                        event: 'Web3Response',
                        data: 'data 1',
                    },
                    {
                        type: 'Event',
                        sessionId: '123',
                        eventId: '2',
                        event: 'Web3Response',
                        data: 'data 2',
                    },
                ]);
            });
        });
        describe('markUnseenEventsAsSeen', () => {
            it('should mark all unseen events as seen', () => {
                const walletLinkHTTP = new WalletLinkHTTP_1.WalletLinkHTTP(linkAPIUrl, sessionId, sessionKey);
                const unseenEvents = [
                    {
                        type: 'Event',
                        sessionId: '1',
                        eventId: 'id-1',
                        event: 'Web3Response',
                        data: 'data 1',
                    },
                    {
                        type: 'Event',
                        sessionId: '2',
                        eventId: 'id-2',
                        event: 'Web3Response',
                        data: 'data 2',
                    },
                ];
                // spy on fetch and verify that it was called with the correct arguments
                const fetchSpy = jest.spyOn(global, 'fetch');
                walletLinkHTTP.markUnseenEventsAsSeen(unseenEvents);
                const metadata = expect.objectContaining({ headers: expect.anything(), method: 'POST' });
                expect(fetchSpy).toHaveBeenCalledWith('https://example.com/events/id-1/seen', metadata);
                expect(fetchSpy).toHaveBeenCalledWith('https://example.com/events/id-2/seen', metadata);
                expect(fetchSpy).toHaveBeenCalledTimes(2);
            });
        });
    });
});
//# sourceMappingURL=WalletLinkHTTP.test.js.map