"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const preact_1 = require("@testing-library/preact");
const preact_2 = require("preact");
const LinkFlow_1 = require("./LinkFlow");
describe('LinkFlow', () => {
    const linkFlow = new LinkFlow_1.LinkFlow({
        darkMode: false,
        version: '1.2.1',
        sessionId: 'session123',
        sessionSecret: 'sessionSecret',
        linkAPIUrl: 'http://link-url.com',
        isParentConnection: false,
    });
    test('initialize', () => {
        expect(linkFlow).toMatchObject({
            connectDisabled: false,
            darkMode: false,
            connected: false,
            isOpen: false,
            isParentConnection: false,
            linkAPIUrl: 'http://link-url.com',
            onCancel: null,
            root: null,
            sessionId: 'session123',
            sessionSecret: 'sessionSecret',
            version: '1.2.1',
        });
    });
    const attachedEl = document.getElementsByClassName('-cbwsdk-link-flow-root');
    describe('public methods', () => {
        beforeEach(() => {
            (0, preact_1.render)((0, preact_2.h)("div", { id: "attach-here" }));
            const ele = document.getElementById('attach-here');
            if (ele) {
                linkFlow.attach(ele);
            }
        });
        test('@attach', () => {
            expect(attachedEl.length).toEqual(1);
        });
        test('@detach', () => {
            linkFlow.detach();
            expect(attachedEl.length).toEqual(0);
        });
        test('@setConnectDisabled', () => {
            linkFlow.setConnectDisabled(true);
            expect(linkFlow).toMatchObject({
                connectDisabled: true,
            });
        });
        test('@open', () => {
            linkFlow.open({
                onCancel: () => { },
            });
            expect(linkFlow).toMatchObject({
                isOpen: true,
            });
        });
        test('@close', () => {
            linkFlow.close();
            expect(linkFlow).toMatchObject({
                isOpen: false,
                onCancel: null,
            });
        });
    });
    describe('without root element', () => {
        test('@detach', () => {
            const linkFlow1 = new LinkFlow_1.LinkFlow({
                darkMode: true,
                version: '1.2.1',
                sessionId: 'session123',
                sessionSecret: 'sessionSecret',
                linkAPIUrl: 'http://link-url.com',
                isParentConnection: false,
            });
            linkFlow1.detach();
            expect(attachedEl.length).toEqual(0);
        });
    });
});
//# sourceMappingURL=LinkFlow.test.js.map