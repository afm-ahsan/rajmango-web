import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PrintModel } from '../../models/print.model';
import { DeviceService } from '../../services/device-detector.service';

@Component({
  selector: 'app-print-modal',
  templateUrl: './print-modal.component.html',
  styleUrls: ['./print-modal.component.scss'],
})
export class PrintModalComponent implements OnInit {
  @Input() printModel: PrintModel;

  constructor(
    public modal: NgbActiveModal,
    public deviceService: DeviceService
  ) {}

  ngOnInit(): void {}

  onPrint() {
    this.modal.close('Print');
  }

  onPrint1() {
    //window.print();
    var elem = document.getElementById('printable');
    if (elem) {
      var domClone = elem.cloneNode(true);
      var $printSection = document.getElementById('printSection');

      if (!$printSection) {
        let $printSection = document.createElement('div');
        $printSection.id = 'printSection';
        document.body.appendChild($printSection);
        $printSection.innerHTML = '';
        $printSection.appendChild(domClone);
        window.print(); // only modal content should get print
      }
    }
  }

  onPrint2() {
    var printContents = document.getElementById('print-section'); //.innerHTML;
    var printSection;
    if (printContents) {
      printSection = printContents.innerHTML;
    }
    window.open('', '_blank', 'top=0, left=0, height=100%, width=auto');
    document.open();

    if (this.deviceService.isDesktop) {
      document.write(`
      <html>
        <head>
          <title>This is desktop</title>
        </head>
        <body onload="window.print();window.close()">${printSection}</body>
      </html>`);
      document.close();
    } else {
      //REMOVE window.close() if the device is a mobile.
      document.write(`
      <html>
        <head>
          <title>This is tab</title>
        </head>
        <body onload="window.print()">${printSection}</body>
      </html>`);
      document.close();
    }
  }

  onPrint3() {
    var printSection = document.getElementById('print-section');
    if(printSection){
      var data = printSection.innerHTML;
      document.open();
      document.write(data);
      if (window.matchMedia('(min-width: 400px)').matches) {
        window.print();
        window.close();
        document.close();
      } else {
        window.print();
        document.close();
      }
    }
  }
}
