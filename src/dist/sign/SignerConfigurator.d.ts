import { PopUpCommunicator } from './scw/transport/PopUpCommunicator';
import { Signer } from './SignerInterface';
import { SignRequestHandlerListener } from './UpdateListenerInterface';
interface SignerConfiguratorOptions {
  appName: string;
  appLogoUrl?: string | null;
  appChainIds: number[];
  smartWalletOnly: boolean;
  updateListener: SignRequestHandlerListener;
  popupCommunicator: PopUpCommunicator;
}
export declare class SignerConfigurator {
  private appName;
  private appLogoUrl;
  private appChainIds;
  private smartWalletOnly;
  private popupCommunicator;
  private updateListener;
  private signerTypeStorage;
  private signerTypeSelectionResolver;
  signerType: string | null;
  signer: Signer | undefined;
  constructor(options: Readonly<SignerConfiguratorOptions>);
  private readonly updateRelay;
  initSigner: () => void;
  private initScwSigner;
  private initWalletLinkSigner;
  onDisconnect(): Promise<void>;
  getWalletLinkQRCodeUrl(): string;
  completeSignerTypeSelection(): Promise<unknown>;
  private setSignerType;
}
export {};
