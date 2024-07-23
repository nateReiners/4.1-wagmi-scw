import { ProviderInterface, RequestArguments } from '../core/type/ProviderInterface';
import { RequestHandler } from '../core/type/RequestHandlerInterface';
export declare class FilterRequestHandler implements RequestHandler {
  private readonly filterPolyfill;
  constructor({ provider }: { provider: ProviderInterface });
  handleRequest(request: RequestArguments): Promise<
    | {
        error: {
          code: number;
          message: string;
        };
      }
    | {
        result: unknown;
      }
  >;
  private eth_newFilter;
  private eth_newBlockFilter;
  private eth_newPendingTransactionFilter;
  private eth_uninstallFilter;
  private eth_getFilterChanges;
  private eth_getFilterLogs;
  canHandleRequest(request: RequestArguments): boolean;
}
