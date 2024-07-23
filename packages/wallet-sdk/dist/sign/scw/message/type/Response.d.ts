import { ActionResult } from './ActionResult';
export type SCWResponse<T> = {
  result: ActionResult<T>;
  data?: {
    chains?: {
      [key: number]: string;
    };
    capabilities?: Record<`0x${string}`, Record<string, unknown>>;
  };
};
