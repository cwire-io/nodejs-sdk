/// <reference types="node" />
import { CWire } from "./CWire";
import { EventEmitter } from 'events';
export declare class CWireSocket extends EventEmitter {
    private cwire;
    private host;
    private port;
    private localSocket?;
    private remoteSocket?;
    constructor(CWire: CWire, host: string, port: number);
    connect(): Promise<void>;
    connectToLocalSocket: () => void;
    onData: (data: any) => void;
    onError: (err: any) => void;
    onConnect: () => void;
}
