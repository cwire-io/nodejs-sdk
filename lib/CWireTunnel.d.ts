import { CWire } from "./CWire";
export declare class CWireTunnel {
    private cwire;
    private closed;
    private socket?;
    constructor(CWire: CWire);
    init(): Promise<void>;
}
