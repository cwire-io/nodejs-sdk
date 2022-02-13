"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONSTRUCT_REFERENCES_LOGGER_PREFIX = void 0;
exports.CONSTRUCT_REFERENCES_LOGGER_PREFIX = 'CONSTRUCT_REFERENCES';
class Logger {
    static getMessage(logType, event, message) {
        return `CWIRE: ${JSON.stringify({ type: logType, event, message })}`;
    }
    static setLogLevel(logLevel) {
        Logger.logLevel = logLevel;
    }
    static log(logType, event, message) {
        switch (Logger.logLevel) {
            case 'none': {
                break;
            }
            case 'production': {
                if (logType === 'info') {
                    console.log(this.getMessage(logType, event, message));
                }
                if (logType === 'warning') {
                    console.warn(this.getMessage(logType, event, message));
                }
                if (logType === 'error') {
                    console.error(this.getMessage(logType, event, message));
                }
                break;
            }
            case 'debug': {
                if (logType === 'info') {
                    console.log(this.getMessage(logType, event, message));
                }
                if (logType === 'system') {
                    console.info(this.getMessage(logType, event, message));
                }
                if (logType === 'warning') {
                    console.warn(this.getMessage(logType, event, message));
                }
                if (logType === 'error') {
                    console.error(this.getMessage(logType, event, message));
                }
            }
        }
    }
    static info(event, message = '') {
        this.log('info', event, message);
    }
    static system(event, message = '') {
        this.log('system', event, message);
    }
    static warning(event, message = '') {
        this.log('warning', event, message);
    }
    static error(event, message = '') {
        this.log('error', event, message);
    }
}
exports.default = Logger;
Logger.logLevel = 'debug';
//# sourceMappingURL=logger.js.map