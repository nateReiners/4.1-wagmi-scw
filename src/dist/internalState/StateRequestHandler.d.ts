import { AddressString, Chain } from '../core/type';
import { RequestArguments } from '../core/type/ProviderInterface';
import { RequestHandler } from '../core/type/RequestHandlerInterface';
export declare class StateRequestHandler implements RequestHandler {
  handleRequest(
    request: RequestArguments,
    accounts: AddressString[],
    chain: Chain
  ): Promise<number | AddressString | AddressString[]>;
  private eth_accounts;
  canHandleRequest(request: RequestArguments): boolean;
}
