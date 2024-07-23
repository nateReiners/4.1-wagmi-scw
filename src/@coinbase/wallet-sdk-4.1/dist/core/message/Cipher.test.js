"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Cipher_1 = require("./Cipher");
describe('Cipher', () => {
    describe('generateKeyPair', () => {
        it('should generate a unique key pair on each call', async () => {
            const firstPublicKey = (await (0, Cipher_1.generateKeyPair)()).publicKey;
            const secondPublicKey = (await (0, Cipher_1.generateKeyPair)()).publicKey;
            expect(firstPublicKey).not.toBe(secondPublicKey);
        });
    });
    describe('deriveSharedSecret', () => {
        it('should derive a shared secret successfully', async () => {
            const ownKeyPair = await (0, Cipher_1.generateKeyPair)();
            const peerKeyPair = await (0, Cipher_1.generateKeyPair)();
            const sharedSecret = await (0, Cipher_1.deriveSharedSecret)(ownKeyPair.privateKey, peerKeyPair.publicKey);
            expect(sharedSecret).toBeDefined();
        });
    });
    describe('encrypt and decrypt', () => {
        it('should encrypt and decrypt a message successfully', async () => {
            const ownKeyPair = await (0, Cipher_1.generateKeyPair)();
            const peerKeyPair = await (0, Cipher_1.generateKeyPair)();
            const sharedSecret = await (0, Cipher_1.deriveSharedSecret)(ownKeyPair.privateKey, peerKeyPair.publicKey);
            const sharedSecretDerivedByPeer = await (0, Cipher_1.deriveSharedSecret)(peerKeyPair.privateKey, ownKeyPair.publicKey);
            const plaintext = 'This is a secret message';
            const encryptedMessage = await (0, Cipher_1.encrypt)(sharedSecret, plaintext);
            const decryptedText = await (0, Cipher_1.decrypt)(sharedSecretDerivedByPeer, encryptedMessage);
            expect(decryptedText).toBe(plaintext);
        });
        it('should throw an error when decrypting with a different shared secret', async () => {
            const ownKeyPair = await (0, Cipher_1.generateKeyPair)();
            const peerKeyPair = await (0, Cipher_1.generateKeyPair)();
            const sharedSecret = await (0, Cipher_1.deriveSharedSecret)(ownKeyPair.privateKey, peerKeyPair.publicKey);
            const plaintext = 'This is a secret message';
            const encryptedMessage = await (0, Cipher_1.encrypt)(sharedSecret, plaintext);
            // generate new keypair on otherKeyManager and use it to derive different shared secret
            const sharedSecretDerivedByPeer = await (0, Cipher_1.deriveSharedSecret)(peerKeyPair.privateKey, peerKeyPair.publicKey);
            // Attempting to decrypt with a different shared secret
            await expect((0, Cipher_1.decrypt)(sharedSecretDerivedByPeer, encryptedMessage)).rejects.toThrow('Unsupported state or unable to authenticate data');
        });
    });
});
//# sourceMappingURL=Cipher.test.js.map