import { CWire } from './CWire';
import io, { Socket } from 'socket.io-client';

import {
  CONNECT_TO_CWIRE_LOGGER_PREFIX,
  CONNECTION_ERROR_LOGGER_PREFIX,
  DISCONNECT_TO_CWIRE_LOGGER_PREFIX,
} from './constants/logger';

/**
 * Websocket connection
 *
 * @property {cwire} CWire
 * @property {Socket} socket
 */
export class CWireWebSocket {
  private cwire: CWire;
  private socket: typeof Socket | undefined;

  public disconnect() {
    if (!this.socket) return;

    this.socket.disconnect();
    this.socket.close();
  }

  public connect() {
    this.socket = io(this.cwire.getAPIURL(), {
      path: '/workers/sync',
      transportOptions: {
        polling: {
          extraHeaders: {
            'x-access-token': this.cwire.getAPIKey(),
          },
        },
      },
    });
    this.initListeners();
  }

  onWorkerFunctionCalled = async (
    functionName: string,
    params: [],
    resolve: (result: { error?: Error; data?: any; success: boolean }) => void,
  ) => {
    try {
      const fn = this.cwire.getWorkerFunctions().getFunction(functionName);
      if (fn) {
        resolve(await fn.controller(...params));
      }
    } catch (err) {
      resolve({ error: err.stack, success: false });
    }
  };

  getWorkerFunctions = (resolve: (result: any) => void) => {
    try {
      resolve(
        this.cwire
          .getWorkerFunctions()
          .getFunctionList()
          .map((fn) => [fn.getName(), fn.getParameters()]),
      );
    } catch (err) {
      console.log(err);
    }
  };

  initListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      this.cwire
        .getLogger()
        .info(
          CONNECT_TO_CWIRE_LOGGER_PREFIX,
          `Connected to cwire api as ${
            this.cwire.getWorker()?.name || 'unknown'
          } successfully`,
        );
    });
    // @ts-ignore
    this.socket.on('disconnect', (error) => {
      this.cwire
        .getLogger()
        .error(
          DISCONNECT_TO_CWIRE_LOGGER_PREFIX,
          `Disconnected to cwire api with the error ${error}`,
        );
    });
    this.socket.on('error', (error: Error) => {
      this.cwire
        .getLogger()
        .error(
          CONNECTION_ERROR_LOGGER_PREFIX,
          `Connection error ${error.toString()}`,
        );
    });

    this.socket.on('CALL_WORKER_FUNCTION_ACTION', this.onWorkerFunctionCalled);
    this.socket.on('GET_WORKER_FUNCTIONS_ACTION', this.getWorkerFunctions);
  }
  constructor(cwire: CWire) {
    this.cwire = cwire;
  }
}
