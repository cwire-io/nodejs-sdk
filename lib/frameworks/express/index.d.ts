import { CWire } from "../CWire";
import { Router } from "express";
export declare function getEventBridge(): void;
export declare function getDataModelRouter(cwire: CWire): Router;
export declare function setupExpress(cwire: CWire, app: Router): Promise<void>;
