import { Preference, ProviderInterface, RequestArguments } from './interface';
import { Chain } from '../type';
export declare function fetchRPCRequest(request: RequestArguments, chain: Chain): Promise<any>;
export interface Window {
    top: Window;
    ethereum?: ProviderInterface;
    coinbaseWalletExtension?: ProviderInterface;
}
export declare function getCoinbaseInjectedProvider(preference: Preference): ProviderInterface | undefined;
/**
 * Validates the arguments for an invalid request and returns an error if any validation fails.
 * Valid request args are defined here: https://eips.ethereum.org/EIPS/eip-1193#request
 * @param args The request arguments to validate.
 * @returns An error object if the arguments are invalid, otherwise undefined.
 */
export declare function checkErrorForInvalidRequestArgs(args: RequestArguments): {
    code: number;
    data?: RequestArguments | undefined;
    name: string;
    message: string;
    stack?: string | undefined;
    cause?: unknown;
} | undefined;
