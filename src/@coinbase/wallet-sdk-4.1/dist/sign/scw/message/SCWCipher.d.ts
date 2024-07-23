import { SCWRequest } from './type/Request';
import { SCWResponse } from './type/Response';
export type EncryptedData = {
  iv: ArrayBuffer;
  cipherText: ArrayBuffer;
};
export declare function generateKeyPair(): Promise<CryptoKeyPair>;
export declare function deriveSharedSecret(
  ownPrivateKey: CryptoKey,
  peerPublicKey: CryptoKey
): Promise<CryptoKey>;
export declare function encrypt(sharedSecret: CryptoKey, plainText: string): Promise<EncryptedData>;
export declare function decrypt(
  sharedSecret: CryptoKey,
  { iv, cipherText }: EncryptedData
): Promise<string>;
export declare function exportKeyToHexString(
  type: 'public' | 'private',
  key: CryptoKey
): Promise<string>;
export declare function importKeyFromHexString(
  type: 'public' | 'private',
  hexString: string
): Promise<CryptoKey>;
export declare function encryptContent<T>(
  content: SCWRequest | SCWResponse<T>,
  sharedSecret: CryptoKey
): Promise<EncryptedData>;
export declare function decryptContent<R extends SCWRequest | SCWResponse<U>, U>(
  encryptedData: EncryptedData,
  sharedSecret: CryptoKey
): Promise<R>;
