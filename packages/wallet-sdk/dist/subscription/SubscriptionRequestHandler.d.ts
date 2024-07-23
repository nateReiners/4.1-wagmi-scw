import { EventEmitter } from 'eventemitter3';

import { ProviderInterface, RequestArguments } from '../core/type/ProviderInterface';
import { RequestHandler } from '../core/type/RequestHandlerInterface';
export declare class SubscriptionRequestHandler implements RequestHandler {
  private readonly subscriptionMiddleware;
  readonly events: EventEmitter;
  constructor({ provider }: { provider: ProviderInterface });
  canHandleRequest(request: RequestArguments): boolean;
  handleRequest(request: RequestArguments): Promise<{}>;
  onDisconnect(): Promise<void>;
}
