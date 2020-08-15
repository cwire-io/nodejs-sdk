import { CWire } from "./CWire";
export declare class CWireWebSocket {
    private cwire;
    private socket;
    disconnect(): void;
    connect(): void;
    onWorkerFunctionCalled: (functionName: string, params: [], resolve: (result: any) => void) => void;
    getWorkerFunctions: (resolve: (result: any) => void) => void;
    initListeners(): void;
    constructor(CWire: CWire);
}
