import { CWire } from './CWire';
export declare class CWireWebSocket {
    private cwire;
    private socket;
    disconnect(): void;
    connect(): void;
    onWorkerFunctionCalled: (functionName: string, params: [], resolve: (result: {
        error?: Error;
        data?: any;
        success: boolean;
    }) => void) => Promise<void>;
    getWorkerFunctions: (resolve: (result: any) => void) => void;
    initListeners(): void;
    constructor(cwire: CWire);
}
