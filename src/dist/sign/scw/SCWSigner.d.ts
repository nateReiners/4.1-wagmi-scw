import { Signer, StateUpdateListener } from '../interface';
import { Communicator } from '../../core/communicator/Communicator';
import { AppMetadata, RequestArguments } from '../../core/provider/interface';
import { AddressString, Chain } from '../../core/type';
export declare class SCWSigner implements Signer {
    private readonly metadata;
    private readonly communicator;
    private readonly updateListener;
    private readonly keyManager;
    private readonly storage;
    private _accounts;
    get accounts(): AddressString[];
    private _chain;
    get chain(): Chain;
    constructor(params: {
        metadata: AppMetadata;
        communicator: Communicator;
        updateListener: StateUpdateListener;
    });
    handshake(): Promise<void>;
    request(request: RequestArguments): Promise<unknown>;
    private sendRequestToPopup;
    disconnect(): Promise<void>;
    /**
     * @returns `null` if the request was successful.
     * https://eips.ethereum.org/EIPS/eip-3326#wallet_switchethereumchain
     */
    private handleSwitchChainRequest;
    private sendEncryptedRequest;
    private createRequestMessage;
    private decryptResponseMessage;
    private updateChain;
}
