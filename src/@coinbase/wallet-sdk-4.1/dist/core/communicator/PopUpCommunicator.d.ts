import { CrossDomainCommunicator } from '../communicator/CrossDomainCommunicator';
import { Message } from '../message';
import { ConfigUpdateMessage } from '../message/ConfigMessage';
export declare class PopUpCommunicator extends CrossDomainCommunicator {
    private resolveConnection?;
    private onConfigUpdateMessage;
    constructor(params: {
        url: string;
        onConfigUpdateMessage: (_: ConfigUpdateMessage) => void;
    });
    protected onConnect(): Promise<void>;
    protected onEvent(event: MessageEvent<Message>): void;
    protected onDisconnect(): void;
    private handleIncomingConfigUpdate;
    private openFixedSizePopUpWindow;
    private closeChildWindow;
}
