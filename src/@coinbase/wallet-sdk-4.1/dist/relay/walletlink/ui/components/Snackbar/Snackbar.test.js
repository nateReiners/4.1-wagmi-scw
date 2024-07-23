"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const preact_1 = require("@testing-library/preact");
const preact_2 = require("preact");
const Snackbar_1 = require("./Snackbar");
const attachedEl = document.getElementsByClassName('-cbwsdk-snackbar-root');
describe('Snackbar', () => {
    const snackbar = new Snackbar_1.Snackbar({
        darkMode: false,
    });
    beforeEach(() => {
        (0, preact_1.render)((0, preact_2.h)("div", { id: "attach-here" }));
        const ele = document.getElementById('attach-here');
        if (ele) {
            snackbar.attach(ele);
        }
    });
    describe('public methods', () => {
        test('@attach', () => {
            expect(attachedEl.length).toEqual(1);
        });
        test('@presentItem', async () => {
            snackbar.presentItem({
                message: 'Confirm on phone',
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
                    {
                        isRed: true,
                        info: 'Reset connection',
                        svgWidth: '10',
                        svgHeight: '11',
                        path: '',
                        defaultFillRule: 'evenodd',
                        defaultClipRule: 'evenodd',
                        onClick: jest.fn,
                    },
                ],
            });
            await (0, preact_1.waitFor)(() => {
                expect(preact_1.screen.queryByText('Cancel transaction')).toBeInTheDocument();
                expect(preact_1.screen.queryByText('Reset connection')).toBeInTheDocument();
                expect(document.getElementsByClassName('-cbwsdk-snackbar-instance-menu-item-info-is-red').length).toEqual(2);
            });
        });
        test('@clear', () => {
            const menuItems = document.getElementsByClassName('-cbwsdk-snackbar-instance-menu');
            expect(menuItems.length).toEqual(1);
            snackbar.clear();
            expect(menuItems.length).toEqual(0);
        });
    });
});
//# sourceMappingURL=Snackbar.test.js.map