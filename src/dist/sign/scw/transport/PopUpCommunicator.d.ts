import { CrossDomainCommunicator } from '../../../core/communicator/CrossDomainCommunicator';
import { Message } from '../../../core/communicator/Message';
import { SignerType } from './ConfigMessage';
export declare class PopUpCommunicator extends CrossDomainCommunicator {
  private requestMap;
  private popUpConfigurator;
  constructor({ url }: { url: string });
  protected onConnect(): Promise<void>;
  protected onEvent(event: MessageEvent<Message>): void;
  protected onDisconnect(): void;
  setGetWalletLinkQRCodeUrlCallback(callback: () => string): void;
  selectSignerType({ smartWalletOnly }: { smartWalletOnly: boolean }): Promise<SignerType>;
  walletLinkQrScanned(): void;
  request(message: Message): Promise<Message>;
  private openFixedSizePopUpWindow;
  private closeChildWindow;
}
