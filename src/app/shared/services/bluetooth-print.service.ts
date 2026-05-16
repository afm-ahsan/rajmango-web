import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BluetoothPrintService {
  async connect(): Promise<void> {
    throw new Error('Bluetooth printing is not supported in this build.');
  }

  async printSample(_text: string): Promise<void> {
    throw new Error('Bluetooth printing is not supported in this build.');
  }

  disconnect(): void {}
}
