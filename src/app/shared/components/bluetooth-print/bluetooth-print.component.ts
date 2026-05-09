import { Component, OnInit } from '@angular/core';
import { BluetoothPrintService } from '../../services/bluetooth-print.service';
/// <reference types="web-bluetooth" />

@Component({
  selector: 'app-bluetooth-print',
  templateUrl: './bluetooth-print.component.html',
  styleUrls: ['./bluetooth-print.component.scss'],
})
export class BluetoothPrintComponent implements OnInit {
  constructor(public bluetoothPrintService: BluetoothPrintService) {}

  ngOnInit(): void {}

  // Connect to the Bluetooth printer
  async connectToPrinter() {
    try {
      await this.bluetoothPrintService.connect();
      console.log('Connected to the printer!');
      alert('Connected to the printer!');
    } catch (error) {
      console.error('Error connecting to printer:', error);
      alert('Error connecting to printer:' + error);
    }
  }

  // Send print data to the printer
  async printSampleReceipt() {
    const receiptText = `
      Receipt
      ---------------------------
      Item 1      $10.00
      Item 2      $20.00
      Total       $30.00
      ---------------------------
      Thank you for your purchase!
    `;
    try {
      await this.bluetoothPrintService.printSample(receiptText);
      console.log('Receipt printed successfully!');
      alert('Receipt printed successfully!');
    } catch (error) {
      console.error('Error printing receipt:', error);
      alert('Error printing receipt:' + error);
    }
  }

  // Disconnect from the printer
  disconnectPrinter() {
    try {
      this.bluetoothPrintService.disconnect();
      alert('Printer disconnected successfully!');
    } catch (error) {
      console.error('Error in disconnecting the printer:', error);
      alert('Error in disconnecting the printer:' + error);
    }
  }
}
