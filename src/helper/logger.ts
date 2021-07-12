export type LogLevel = 'debug' | 'production' | 'none';
export type LogType = 'info' | 'system' | 'warning' | 'error';

export const CONSTRUCT_REFERENCES_LOGGER_PREFIX = 'CONSTRUCT_REFERENCES';

/**
 * @property {LogLevel} logLevel
 */
export default class Logger {
  logLevel: LogLevel;

  constructor(logLevel: LogLevel) {
    this.logLevel = logLevel;
  }

  private getMessage(logType: LogType, event: string, message: string) {
    return `CWIRE: ${JSON.stringify({ type: logType, event, message })}`;
  }

  private log(logType: LogType, event: string, message: string) {
    switch (this.logLevel) {
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

  public info(event: string, message: string = ''): void {
    this.log('info', event, message);
  }

  public system(event: string, message: string = ''): void {
    this.log('system', event, message);
  }
  public warning(event: string, message: string = ''): void {
    this.log('warning', event, message);
  }
  public error(event: string, message: string = ''): void {
    this.log('error', event, message);
  }
}
