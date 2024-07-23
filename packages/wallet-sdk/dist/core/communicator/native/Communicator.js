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
exports.Communicator = void 0;
const WebBrowser = __importStar(require("expo-web-browser"));
const constants_1 = require("../../constants");
const error_1 = require("../../error");
class Communicator {
    constructor(url = constants_1.CB_KEYS_URL) {
        this.responseHandlers = new Map();
        this.postRequestAndWaitForResponse = (request) => {
            return new Promise((resolve, reject) => {
                // 1. generate request URL
                const urlParams = new URLSearchParams();
                Object.entries(request).forEach(([key, value]) => {
                    urlParams.append(key, JSON.stringify(value));
                });
                const requestUrl = new URL(this.url);
                requestUrl.search = urlParams.toString();
                // 2. save response
                this.responseHandlers.set(request.id, resolve);
                // 3. send request via native module
                WebBrowser.openBrowserAsync(requestUrl.toString(), {
                    presentationStyle: WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
                })
                    .then((result) => {
                    if (result.type === 'cancel') {
                        // iOS only: user cancelled the request
                        reject(error_1.standardErrors.provider.userRejectedRequest());
                        this.clear();
                    }
                })
                    .catch(() => {
                    reject(error_1.standardErrors.provider.userRejectedRequest());
                    this.clear();
                });
            });
        };
        this.handleResponse = (responseUrl) => {
            const { searchParams } = new URL(responseUrl);
            const parseParam = (paramName) => {
                return JSON.parse(searchParams.get(paramName));
            };
            const response = {
                id: parseParam('id'),
                sender: parseParam('sender'),
                requestId: parseParam('requestId'),
                content: parseParam('content'),
                timestamp: new Date(parseParam('timestamp')),
            };
            const handler = this.responseHandlers.get(response.requestId);
            if (handler) {
                handler(response);
                this.responseHandlers.delete(response.requestId);
                WebBrowser.dismissBrowser();
            }
        };
        this.clear = () => {
            this.responseHandlers.clear();
        };
        this.url = url;
    }
}
exports.Communicator = Communicator;
//# sourceMappingURL=Communicator.js.map