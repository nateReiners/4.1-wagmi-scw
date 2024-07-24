import { StateUpdateListener } from '../interface';
import { AppMetadata, RequestArguments, Signer } from '../../core/provider/interface';
import { AddressString } from '../../core/type';
export declare class ExtensionSigner implements Signer {
    private readonly metadata;
    private readonly updateListener;
    private extensionProvider;
    constructor(params: {
        metadata: AppMetadata;
        updateListener: StateUpdateListener;
    });
    handshake(): Promise<AddressString[]>;
    request<T>(request: RequestArguments): Promise<T>;
    disconnect(): Promise<void>;
}
