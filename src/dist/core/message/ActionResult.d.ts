import { SerializedEthereumRpcError } from '../error';
export type ActionResult<T> = {
    value: T;
} | {
    error: SerializedEthereumRpcError;
};
