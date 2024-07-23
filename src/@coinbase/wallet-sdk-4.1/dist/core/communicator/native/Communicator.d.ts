import { RPCRequestMessage, RPCResponseMessage } from '../../message';
type MobileRPCRequestMessage = RPCRequestMessage & {
    sdkVersion: string;
    callbackUrl: string;
};
export declare class Communicator {
    private readonly url;
    private responseHandlers;
    constructor(url?: string);
    postRequestAndWaitForResponse: (request: MobileRPCRequestMessage) => Promise<RPCResponseMessage>;
    handleResponse: (responseUrl: string) => void;
    clear: () => void;
}
export {};
