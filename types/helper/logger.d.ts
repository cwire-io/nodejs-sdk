export declare type LogLevel = 'debug' | 'production' | 'none';
export declare type LogType = 'info' | 'system' | 'warning' | 'error';
export declare const CONSTRUCT_REFERENCES_LOGGER_PREFIX = "CONSTRUCT_REFERENCES";
export default class Logger {
    private static logLevel;
    private static getMessage;
    static setLogLevel(logLevel: LogLevel): void;
    private static log;
    static info(event: string, message?: string): void;
    static system(event: string, message?: string): void;
    static warning(event: string, message?: string): void;
    static error(event: string, message?: string): void;
}
