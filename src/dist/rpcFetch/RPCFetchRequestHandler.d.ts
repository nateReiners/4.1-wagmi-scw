import { Chain } from '../core/type';
import { RequestArguments } from '../core/type/ProviderInterface';
import { RequestHandler } from '../core/type/RequestHandlerInterface';
export declare class RPCFetchRequestHandler implements RequestHandler {
  canHandleRequest(_: RequestArguments): boolean;
  handleRequest(request: RequestArguments, _: unknown, chain: Chain): Promise<any>;
}
