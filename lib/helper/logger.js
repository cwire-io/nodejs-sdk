"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Logger {
    constructor(logLevel) {
        this.logLevel = logLevel;
    }
    getMessage(logType, event, message) {
        return `CWIRE: ${JSON.stringify({ type: logType, event, message })}`;
    }
    log(logType, event, message) {
        switch (this.logLevel) {
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
    info(event, message = '') {
        this.log('info', event, message);
    }
    system(event, message = '') {
        this.log('system', event, message);
    }
    warning(event, message = '') {
        this.log('warning', event, message);
    }
    error(event, message = '') {
        this.log('error', event, message);
    }
}
exports.default = Logger;
//# sourceMappingURL=logger.js.map