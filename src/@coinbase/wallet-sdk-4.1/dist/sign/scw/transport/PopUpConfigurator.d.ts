import { ClientConfigEventType, ConfigMessage, SignerType } from './ConfigMessage';
import { PopUpCommunicator } from './PopUpCommunicator';
export declare class PopUpConfigurator {
  private communicator;
  getWalletLinkQRCodeUrlCallback?: () => string;
  resolvePopupConnection?: () => void;
  resolveSignerTypeSelection?: (_: SignerType) => void;
  constructor({ communicator }: { communicator: PopUpCommunicator });
  handleConfigMessage(message: ConfigMessage): void;
  postClientConfigMessage(type: ClientConfigEventType, options?: any): void;
  onDisconnect(): void;
  private respondToWlQRCodeUrlRequest;
}
