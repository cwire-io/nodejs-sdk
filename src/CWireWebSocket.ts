import {CWire} from "./CWire";
import io, { Socket } from "socket.io-client";

export class CWireWebSocket {
  private cwire: CWire;
  private socket: typeof Socket | undefined;

  public disconnect() {
    if (!this.socket) return;

    this.socket.disconnect();
    this.socket.close();
  }

  public connect() {
    this.socket = io(this.cwire.getAPIURL(),
      {
        path: '/workers/sync',
        transportOptions: {
          polling: {
            extraHeaders: {
              'x-access-token': this.cwire.getAPIKey()
            }
          }
        }
      }
    );
    this.initListeners();
  }

  onWorkerFunctionCalled = (functionName: string, params: [], resolve: (result: any) => void) => {
    try {
      const fn = this.cwire.getWorker().getFunction(functionName);
      console.log('Function', functionName, fn);
      if (fn) {
        resolve(fn.controller(...params));
      }
    } catch (err) {

    }
  };

  getWorkerFunctions = (resolve: (result: any) => void) => {
    try {
      resolve(this.cwire.getWorker().getFunctionList().map(fn => [fn.getName(), fn.getParameters()]));
    } catch (err) {

    }
  };

  initListeners() {
    if (!this.socket) return;

    this.socket.on('connect', function(){
      console.log('Connected');
    });
    this.socket.on('disconnect', function () {
      console.log('Disconnected');
    });
    this.socket.on('error', (error: Error) => {
      console.log('error', error)
    });

    // @ts-ignore
    this.socket.on('message', (...data) => {
      console.log(...data);
    });

    this.socket.on('CALL_WORKER_FUNCTION_ACTION', this.onWorkerFunctionCalled);
    this.socket.on('GET_WORKER_FUNCTIONS_ACTION', this.getWorkerFunctions);
  }
  constructor(CWire: CWire) {
    this.cwire = CWire;
  }
}
