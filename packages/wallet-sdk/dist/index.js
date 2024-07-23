"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mmkvStorageAdapter = exports.browserStorageAdapter = exports.CoinbaseWalletSDK = void 0;
// Copyright (c) 2018-2024 Coinbase, Inc. <https://www.coinbase.com/>
const CoinbaseWalletSDK_1 = require("./CoinbaseWalletSDK");
exports.default = CoinbaseWalletSDK_1.CoinbaseWalletSDK;
var CoinbaseWalletSDK_2 = require("./CoinbaseWalletSDK");
Object.defineProperty(exports, "CoinbaseWalletSDK", { enumerable: true, get: function () { return CoinbaseWalletSDK_2.CoinbaseWalletSDK; } });
var BaseStorage_1 = require("./util/BaseStorage");
Object.defineProperty(exports, "browserStorageAdapter", { enumerable: true, get: function () { return BaseStorage_1.browserStorageAdapter; } });
Object.defineProperty(exports, "mmkvStorageAdapter", { enumerable: true, get: function () { return BaseStorage_1.mmkvStorageAdapter; } });
//# sourceMappingURL=index.js.map