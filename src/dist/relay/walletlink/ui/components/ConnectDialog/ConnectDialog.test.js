"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const preact_1 = require("@testing-library/preact");
const preact_2 = require("preact");
const ConnectDialog_1 = require("./ConnectDialog");
const renderConnectDialog = ({ connectDisabled = false, isConnected = true }) => {
    return (0, preact_1.render)((0, preact_2.h)(ConnectDialog_1.ConnectDialog, { darkMode: false, version: "1", sessionId: "abcd", sessionSecret: "efgh", linkAPIUrl: "https://www.walletlink.org", isOpen: true, isConnected: isConnected, isParentConnection: false, chainId: 1, connectDisabled: connectDisabled, onCancel: null }));
};
const windowOpenSpy = jest.spyOn(window, 'open');
describe('TryExtensionLinkDialog', () => {
    test('should show scan QR box when connectDisabled is false', async () => {
        renderConnectDialog({ connectDisabled: false });
        await (0, preact_1.waitFor)(() => {
            expect(preact_1.screen.queryByTestId('connect-content')).toBeTruthy();
        });
    });
    test('should not show scan QR box when connectDisabled is true', async () => {
        renderConnectDialog({ connectDisabled: true });
        await (0, preact_1.waitFor)(() => {
            expect(preact_1.screen.queryByTestId('connect-content')).toBeNull();
        });
    });
    test('should show connecting spinner when not connected', async () => {
        renderConnectDialog({ isConnected: false });
        await (0, preact_1.waitFor)(() => {
            expect(preact_1.screen.queryByTestId('connecting-spinner')).toBeTruthy();
        });
    });
    test('should navigate to extension store in new tab after pressing install', async () => {
        const mockedWindowOpen = jest.fn();
        windowOpenSpy.mockImplementation(mockedWindowOpen);
        renderConnectDialog({});
        await (0, preact_1.waitFor)(async () => {
            const button = await preact_1.screen.findByRole('button', { name: 'Install' });
            preact_1.fireEvent.click(button);
            expect(mockedWindowOpen).toBeCalledWith('https://api.wallet.coinbase.com/rpc/v2/desktop/chrome', '_blank');
        });
    });
    test('should show refresh button after pressing install', async () => {
        windowOpenSpy.mockImplementation(() => null);
        renderConnectDialog({});
        await (0, preact_1.waitFor)(async () => {
            const button = await preact_1.screen.findByRole('button', { name: 'Install' });
            expect(button.textContent).toEqual('Install');
            preact_1.fireEvent.click(button);
            expect(button.textContent).toEqual('Refresh');
        });
    });
});
//# sourceMappingURL=ConnectDialog.test.js.map