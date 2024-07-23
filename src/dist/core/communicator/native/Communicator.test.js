"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Communicator_1 = require("./Communicator"); // Adjust the import path as needed
const error_1 = require("../../error");
jest.mock('expo-web-browser', () => ({
    openBrowserAsync: jest.fn(),
    WebBrowserPresentationStyle: {
        FORM_SHEET: 'FORM_SHEET',
    },
    dismissBrowser: jest.fn(),
}));
const WebBrowser = __importStar(require("expo-web-browser"));
describe('Communicator', () => {
    let communicator;
    const mockID = '123';
    beforeEach(() => {
        communicator = new Communicator_1.Communicator();
        jest.clearAllMocks();
    });
    describe('constructor', () => {
        it('should use the default URL if not provided', () => {
            expect(communicator['url']).toBe('https://keys.coinbase.com/connect');
        });
        it('should use the provided URL', () => {
            const customUrl = 'https://custom.com/api';
            const customCommunicator = new Communicator_1.Communicator(customUrl);
            expect(customCommunicator['url']).toBe(customUrl);
        });
    });
    describe('postRequestAndWaitForResponse', () => {
        const mockRequest = {
            id: mockID,
            sdkVersion: '1.0.0',
            callbackUrl: 'https://callback.com',
            content: {
                encrypted: {},
            },
            sender: '123',
            timestamp: new Date('2022-02-01T20:30:45.500Z'),
        };
        it('should open browser with correct URL on iOS', async () => {
            WebBrowser.openBrowserAsync.mockResolvedValue({ type: 'dismiss' });
            communicator.postRequestAndWaitForResponse(mockRequest);
            expect(WebBrowser.openBrowserAsync).toHaveBeenCalledWith('https://keys.coinbase.com/connect?id=%22123%22&sdkVersion=%221.0.0%22&callbackUrl=%22https%3A%2F%2Fcallback.com%22&content=%7B%22encrypted%22%3A%7B%7D%7D&sender=%22123%22&timestamp=%222022-02-01T20%3A30%3A45.500Z%22', {
                presentationStyle: WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
            });
            expect(communicator['responseHandlers'].get(mockID)).toBeDefined();
        });
        it('should open browser with correct URL on Android', async () => {
            WebBrowser.openBrowserAsync.mockResolvedValue({ type: 'opened' });
            communicator.postRequestAndWaitForResponse(mockRequest);
            expect(WebBrowser.openBrowserAsync).toHaveBeenCalledWith('https://keys.coinbase.com/connect?id=%22123%22&sdkVersion=%221.0.0%22&callbackUrl=%22https%3A%2F%2Fcallback.com%22&content=%7B%22encrypted%22%3A%7B%7D%7D&sender=%22123%22&timestamp=%222022-02-01T20%3A30%3A45.500Z%22', {
                presentationStyle: WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
            });
            expect(communicator['responseHandlers'].get(mockID)).toBeDefined();
        });
        it('should reject with user rejected error when browser is cancelled on iOS', async () => {
            WebBrowser.openBrowserAsync.mockResolvedValue({ type: 'cancel' });
            await expect(communicator.postRequestAndWaitForResponse(mockRequest)).rejects.toEqual(error_1.standardErrors.provider.userRejectedRequest());
            expect(communicator['responseHandlers'].get(mockID)).toBeUndefined();
        });
        it('should reject with user rejected error when browser throws an error', async () => {
            WebBrowser.openBrowserAsync.mockRejectedValue(new Error('Browser error'));
            await expect(communicator.postRequestAndWaitForResponse(mockRequest)).rejects.toEqual(error_1.standardErrors.provider.userRejectedRequest());
            expect(communicator['responseHandlers'].get(mockID)).toBeUndefined();
        });
    });
    describe('handleResponse', () => {
        const mockResponse = {
            id: '456',
            sender: 'test-sender',
            requestId: '123',
            content: { encrypted: {} },
            timestamp: new Date('2022-02-01T20:30:45.500Z'),
        };
        it('should parse response and call the correct handler', () => {
            const mockHandler = jest.fn();
            communicator['responseHandlers'].set(mockResponse.requestId, mockHandler);
            const responseUrl = `https://callback.com/?id="${mockResponse.id}"&sender="${mockResponse.sender}"&requestId="${mockResponse.requestId}"&content=${JSON.stringify(mockResponse.content)}&timestamp="${mockResponse.timestamp.toISOString()}"`;
            communicator.handleResponse(responseUrl);
            expect(mockHandler).toHaveBeenCalledWith(mockResponse);
            expect(communicator['responseHandlers'].size).toBe(0);
            expect(WebBrowser.dismissBrowser).toHaveBeenCalled();
        });
        it('should not throw if no handler is found', () => {
            const responseUrl = `https://callback.com/?id="${mockResponse.id}"&sender="${mockResponse.sender}"&requestId="${mockResponse.requestId}"&content=${JSON.stringify(mockResponse.content)}&timestamp="${mockResponse.timestamp.toISOString()}"`;
            expect(() => communicator.handleResponse(responseUrl)).not.toThrow();
        });
    });
    describe('clear', () => {
        it('should clear all response handlers', () => {
            communicator['responseHandlers'].set('123', jest.fn());
            communicator['responseHandlers'].set('456', jest.fn());
            communicator.clear();
            expect(communicator['responseHandlers'].size).toBe(0);
        });
    });
});
//# sourceMappingURL=Communicator.test.js.map