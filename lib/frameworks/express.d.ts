import { CWire } from "../CWire";
import { Router } from "express";
import { Request, Response } from 'express';
export declare function createRouteController(controllerFunction: (req: Request, res: Response) => Promise<void>): (req: Request, res: Response) => Promise<void>;
export declare function getEventBridge(): void;
export declare function getDataModelRouter(cwire: CWire): Router;
export declare function setupExpress(cwire: CWire, app: Router): Promise<void>;
