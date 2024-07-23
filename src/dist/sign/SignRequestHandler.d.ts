import { AddressString } from '../core/type';
import { RequestArguments } from '../core/type/ProviderInterface';
import { RequestHandler } from '../core/type/RequestHandlerInterface';
import { SignRequestHandlerListener } from './UpdateListenerInterface';
interface SignRequestHandlerOptions {
  appName: string;
  appLogoUrl?: string | null;
  appChainIds: number[];
  smartWalletOnly: boolean;
  updateListener: SignRequestHandlerListener;
}
export declare class SignRequestHandler implements RequestHandler {
  private popupCommunicator;
  private updateListener;
  private signerConfigurator;
  constructor(options: Readonly<SignRequestHandlerOptions>);
  handleRequest(request: RequestArguments, accounts: AddressString[]): Promise<unknown>;
  private eth_requestAccounts;
  canHandleRequest(request: RequestArguments): boolean;
  onDisconnect(): Promise<void>;
}
export {};
