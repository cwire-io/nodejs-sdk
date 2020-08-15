import { CWire } from "./CWire";
export declare class CWireSocket {
    private cwire;
    private socket;
    disconnect(): void;
    connect(): void;
    initListeners(): void;
    getDataModelEntities: (modelName: string) => void;
    constructor(CWire: CWire);
}
