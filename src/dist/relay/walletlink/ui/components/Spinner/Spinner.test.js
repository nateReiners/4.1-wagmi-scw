"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const preact_1 = require("@testing-library/preact");
const preact_2 = require("preact");
const Spinner_1 = require("./Spinner");
const renderSpinner = (props) => (0, preact_1.render)((0, preact_2.h)(Spinner_1.Spinner, Object.assign({}, props)));
describe('Spinner', () => {
    test('renders default', () => {
        var _a, _b;
        renderSpinner({});
        const svgStyle = (_a = document.querySelector('svg')) === null || _a === void 0 ? void 0 : _a.style;
        const svgCircle = (_b = document.querySelector('circle')) === null || _b === void 0 ? void 0 : _b.style;
        expect(svgStyle === null || svgStyle === void 0 ? void 0 : svgStyle.width).toEqual('64px');
        expect(svgStyle === null || svgStyle === void 0 ? void 0 : svgStyle.height).toEqual('64px');
        expect(svgCircle === null || svgCircle === void 0 ? void 0 : svgCircle.stroke).toEqual('#000');
    });
    test('renders overrides', () => {
        var _a, _b;
        renderSpinner({
            size: 200,
            color: 'red',
        });
        const svgStyle = (_a = document.querySelector('svg')) === null || _a === void 0 ? void 0 : _a.style;
        const svgCircle = (_b = document.querySelector('circle')) === null || _b === void 0 ? void 0 : _b.style;
        expect(svgStyle === null || svgStyle === void 0 ? void 0 : svgStyle.width).toEqual('200px');
        expect(svgStyle === null || svgStyle === void 0 ? void 0 : svgStyle.height).toEqual('200px');
        expect(svgCircle === null || svgCircle === void 0 ? void 0 : svgCircle.stroke).toEqual('red');
    });
});
//# sourceMappingURL=Spinner.test.js.map