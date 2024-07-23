"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadSignerType = loadSignerType;
exports.storeSignerType = storeSignerType;
exports.fetchSignerType = fetchSignerType;
exports.createSigner = createSigner;
const ExtensionSigner_1 = require("./extension/ExtensionSigner");
const SCWSigner_1 = require("./scw/SCWSigner");
const WalletLinkSigner_1 = require("./walletlink/WalletLinkSigner");
const ScopedStorage_1 = require("../util/ScopedStorage");
const SIGNER_TYPE_KEY = 'SignerType';
function loadSignerType(baseStorage) {
    const storage = new ScopedStorage_1.ScopedStorage('CBWSDK', 'SignerConfigurator', baseStorage);
    return storage.getItem(SIGNER_TYPE_KEY);
}
function storeSignerType(signerType, baseStorage) {
    const storage = new ScopedStorage_1.ScopedStorage('CBWSDK', 'SignerConfigurator', baseStorage);
    storage.setItem(SIGNER_TYPE_KEY, signerType);
}
async function fetchSignerType(params) {
    const { communicator, metadata } = params;
    listenForWalletLinkSessionRequest(communicator, metadata).catch(() => { });
    const request = {
        id: crypto.randomUUID(),
        event: 'selectSignerType',
        data: params.preference,
    };
    const { data } = await communicator.postRequestAndWaitForResponse(request);
    return data;
}
function createSigner(params) {
    const { signerType, metadata, communicator, updateListener } = params;
    switch (signerType) {
        case 'scw':
            return new SCWSigner_1.SCWSigner({
                metadata,
                updateListener,
                communicator,
            });
        case 'walletlink':
            return new WalletLinkSigner_1.WalletLinkSigner({
                metadata,
                updateListener,
            });
        case 'extension': {
            return new ExtensionSigner_1.ExtensionSigner({
                metadata,
                updateListener,
            });
        }
    }
}
async function listenForWalletLinkSessionRequest(communicator, metadata) {
    await communicator.onMessage(({ event }) => event === 'WalletLinkSessionRequest');
    // temporary walletlink signer instance to handle WalletLinkSessionRequest
    // will revisit this when refactoring the walletlink signer
    const walletlink = new WalletLinkSigner_1.WalletLinkSigner({
        metadata,
    });
    // send wallet link session to popup
    communicator.postMessage({
        event: 'WalletLinkUpdate',
        data: { session: walletlink.getSession() },
    });
    // wait for handshake to complete
    await walletlink.handshake();
    // send connected status to popup
    communicator.postMessage({
        event: 'WalletLinkUpdate',
        data: { connected: true },
    });
}
//# sourceMappingURL=util.js.map