"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const preact_1 = require("@testing-library/preact");
const preact_2 = require("preact");
const Snackbar_1 = require("./Snackbar");
const renderSnackbarContainer = (props) => (0, preact_1.render)((0, preact_2.h)(Snackbar_1.SnackbarContainer, { darkMode: true },
    (0, preact_2.h)(Snackbar_1.SnackbarInstance, Object.assign({}, props))));
describe('SnackbarContainer', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        jest.spyOn(window, 'setTimeout');
        renderSnackbarContainer({
            menuItems: [
                {
                    isRed: true,
                    info: 'Cancel transaction',
                    svgWidth: '11',
                    svgHeight: '11',
                    path: '',
                    defaultFillRule: 'inherit',
                    defaultClipRule: 'inherit',
                    onClick: jest.fn,
                },
            ],
        });
    });
    afterEach(() => {
        jest.useRealTimers();
    });
    test('render hidden', () => {
        const hiddenClass = document.getElementsByClassName('-cbwsdk-snackbar-instance-hidden');
        expect(hiddenClass.length).toEqual(1);
        jest.runAllTimers();
        expect(setTimeout).toHaveBeenCalledTimes(2);
    });
    test('toggle expand', () => {
        const header = document.getElementsByClassName('-cbwsdk-snackbar-instance-header')[0];
        const expandedClass = document.getElementsByClassName('-cbwsdk-snackbar-instance-expanded');
        preact_1.fireEvent.click(header);
        expect(expandedClass.length).toEqual(1);
        expect(preact_1.screen.queryByText('Cancel transaction')).toBeVisible();
    });
});
//# sourceMappingURL=SnackbarContainer.test.js.map