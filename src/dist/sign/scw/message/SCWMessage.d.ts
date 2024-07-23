/// <reference types="node" />
import { UUID } from 'crypto';

import { Message } from '../../../core/communicator/Message';
import { SerializedEthereumRpcError } from '../../../core/error';
import { EncryptedData } from './SCWCipher';
import { RequestAccountsAction } from './type/Action';
interface SCWMessage extends Message {
  type: 'scw';
  id: UUID;
  sender: string;
  content: unknown;
  version: string;
  timestamp: Date;
}
export interface SCWRequestMessage extends SCWMessage {
  content:
    | {
        handshake: RequestAccountsAction;
      }
    | {
        encrypted: EncryptedData;
      };
}
export interface SCWResponseMessage extends SCWMessage {
  requestId: UUID;
  content:
    | {
        encrypted: EncryptedData;
      }
    | {
        failure: SerializedEthereumRpcError;
      };
}
export {};
