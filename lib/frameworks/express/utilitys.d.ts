import { Request, Response } from "express";
export declare function createErrorResponseBody(errorCode: number, body?: {}): {
    status: number;
    msg: string;
    error: boolean;
};
export declare function createErrorResponse(res: Response, errorCode: number, body?: {}): void;
export declare function createRouteController(controllerFunction: (req: Request, res: Response) => Promise<void>): (req: Request, res: Response) => Promise<void>;
