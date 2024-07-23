import { Signer, StateUpdateListener } from './interface';
import { Communicator } from '../core/communicator/Communicator';
import { SignerType } from '../core/message';
import { AppMetadata, Preference } from '../core/provider/interface';
import type { BaseStorage } from '../util/BaseStorage';
export declare function loadSignerType(baseStorage: BaseStorage | undefined): SignerType | null;
export declare function storeSignerType(signerType: SignerType, baseStorage: BaseStorage | undefined): void;
export declare function fetchSignerType(params: {
    communicator: Communicator;
    preference: Preference;
    metadata: AppMetadata;
}): Promise<SignerType>;
export declare function createSigner(params: {
    signerType: SignerType;
    metadata: AppMetadata;
    communicator: Communicator;
    updateListener: StateUpdateListener;
}): Signer;
