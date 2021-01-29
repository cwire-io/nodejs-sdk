export declare type LogLevel = 'debug' | 'production' | 'none';
export declare type LogType = 'info' | 'system' | 'warning' | 'error';
export default class Logger {
    logLevel: LogLevel;
    constructor(logLevel: LogLevel);
    private getMessage;
    private log;
    info(event: string, message?: string): void;
    system(event: string, message?: string): void;
    warning(event: string, message?: string): void;
    error(event: string, message?: string): void;
}
