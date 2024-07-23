import EventEmitter from 'eventemitter3';
import { ConstructorOptions, ProviderInterface, RequestArguments } from './core/provider/interface';
import { AddressString } from './core/type';
export declare class CoinbaseWalletProvider extends EventEmitter implements ProviderInterface {
    private readonly metadata;
    private readonly preference;
    private readonly communicator;
    private readonly baseStorage?;
    private signer;
    constructor({ baseStorage, metadata, preference: { keysUrl, ...preference }, }: Readonly<ConstructorOptions>);
    request<T>(args: RequestArguments): Promise<T>;
    protected handleRequest(request: RequestArguments): Promise<any>;
    protected readonly handlers: {
        handshake: (_: RequestArguments) => Promise<AddressString[]>;
        sign: (request: RequestArguments) => Promise<unknown>;
        fetch: (request: RequestArguments) => Promise<any>;
        state: (request: RequestArguments) => number | import("./core/type").HexString | AddressString | AddressString[];
        deprecated: ({ method }: RequestArguments) => never;
        unsupported: ({ method }: RequestArguments) => never;
    };
    /** @deprecated Use `.request({ method: 'eth_requestAccounts' })` instead. */
    enable(): Promise<unknown>;
    disconnect(): Promise<void>;
    readonly isCoinbaseWallet = true;
    private requestSignerSelection;
    private initSigner;
}
