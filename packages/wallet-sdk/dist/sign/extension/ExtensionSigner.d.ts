import { Signer, StateUpdateListener } from '../interface';
import { AppMetadata, RequestArguments } from '../../core/provider/interface';
import { AddressString } from '../../core/type';
export declare class ExtensionSigner implements Signer {
    private readonly metadata;
    private readonly updateListener;
    private extensionProvider;
    constructor(params: {
        metadata: AppMetadata;
        updateListener: StateUpdateListener;
    });
    get accounts(): AddressString[];
    get chain(): {
        id: import("../../core/type").IntNumber;
    };
    handshake(): Promise<void>;
    request(request: RequestArguments): Promise<unknown>;
    disconnect(): Promise<void>;
}
