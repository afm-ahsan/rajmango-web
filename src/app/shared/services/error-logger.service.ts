import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { LogLevel } from '../enums/log-level.enum';

@Injectable({
  providedIn: 'root'
})
export class ErrorLoggerService {
  constructor() {}

  log(message: unknown, level: LogLevel = LogLevel.Error): void {
    const output = `[${level}] ${this.formatMessage(message)}`;

    if (isDevMode()) {
      switch (level) {
        case LogLevel.Info:
          console.info(output);
          break;
        case LogLevel.Warn:
          console.warn(output);
          break;
        case LogLevel.Error:
          console.error(output);
          break;
      }
    }

    // Optional: sendToServer({ level, message, timestamp: new Date() });
  }

  logHttpError(error: HttpErrorResponse): void {
    const summary = {
      message: error.message || 'Unknown HTTP error',
      status: error.status,
      url: error.url,
      error,
      timestamp: new Date()
    };

    this.log(summary, LogLevel.Error);
  }

  private formatMessage(input: unknown): string {
    try {
      return typeof input === 'string' ? input : JSON.stringify(input);
    } catch {
      return '[Unserializable Error]';
    }
  }
}
