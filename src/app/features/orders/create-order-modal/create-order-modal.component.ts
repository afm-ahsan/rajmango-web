import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, of, switchMap } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DeliveryStatus } from 'src/app/shared/enums/delivery-status.enum';
import { OrderStatus } from 'src/app/shared/enums/order-status.enum';
import { PaymentStatus } from 'src/app/shared/enums/payment_status.enum';
import { DropdownModel, EntityDropdownModel } from 'src/app/shared/models/dropdown.model';
import { DropdownService } from 'src/app/shared/services/dropdown.service';
import { DomainUtils } from 'src/app/shared/utils/domain-utils';
import { EnumLabelUtils } from 'src/app/shared/utils/enum-label.utils';
import { dropdownRequiredValidator } from 'src/app/shared/validators/dropdown-validators';
import { minOrderKgValidator } from 'src/app/shared/validators/order-validators';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import { AuthService } from '../../auth';
import { MangoAvailabilityServiceProxy, MangoAvailabilityDto } from 'src/app/services/client-proxy';
import { CourierAreaMapService } from '../../couriers/courier-area-map/courier-area-map.service';
import { CourierStationService } from '../../couriers/courier-station/courier-station.service';
import { AvailableCourierDto } from '../../couriers/courier-station/models/available-courier.dto';
import { MangoTypeService } from '../../mango-types/mango-type.service';
import { MangoTypeDto } from '../../mango-types/models/mango-type-dto.model';
import { NewOrderDto } from '../models/new-order-dto.model';
import { OrderDetailDto } from '../models/order-detail-dto.model';
import { OrderDto } from '../models/order-dto.model';
import { OrderInputDto } from '../models/order-input-dto.model';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-create-order-modal',
  templateUrl: './create-order-modal.component.html',
  styleUrls: ['./create-order-modal.component.scss']
})
export class CreateOrderModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  @Input() mangoTypeId: number = 0;

  mangoTypes: MangoTypeDto[] = [];
  mangoTypeOptions: EntityDropdownModel[] = [];
  courierAreaOptions: EntityDropdownModel[] = [];
  orderForm: FormGroup;
  orderDto: OrderDto = {} as OrderDto;
  orderInputDto: OrderInputDto = {} as OrderInputDto;
  newOrderDto: NewOrderDto = {} as NewOrderDto;
  orderDetails: OrderDetailDto[] = [];
  crateTypeOptions: DropdownModel[] = [];
  subs = new SubSink();
  isLoading = false;
  isSubmitting = false;
  orderDateObject: Date;
  availableStations: AvailableCourierDto[] = [];
  stationCheckRequired = false;
  isFallbackMode = false;
  private priceMap: Record<number, number> = {};

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private authService: AuthService,
    private orderService: OrderService,
    private cdRef: ChangeDetectorRef,
    private dropdownService: DropdownService,
    private mangoTypeService: MangoTypeService,
    private availabilityProxy: MangoAvailabilityServiceProxy,
    private courierService: CourierStationService,
    private courierAreaService: CourierAreaMapService,
  ) {}

  ngOnInit(): void {
    this.crateTypeOptions = this.dropdownService.getCrateTypeOptions();
    this.initNewOrder();
    this.loadData();
  }

  private buildForm(): FormGroup {
    return this.fb.group({
      mangoType: [
        this.newOrderDto.mangoType,
        [dropdownRequiredValidator()],
      ],
      crateType: [
        this.newOrderDto.crateType,        
        [dropdownRequiredValidator()],
      ],
      area: [
        this.newOrderDto.area,        
        [dropdownRequiredValidator()],
      ],
      quantity: [
        this.newOrderDto.quantity,
        Validators.compose([Validators.required, Validators.min(1)]),
      ],
      note: [this.newOrderDto.note],
      courierStationId: [this.newOrderDto.courierStationId],
      fallbackAddress: [this.newOrderDto.fallbackAddress],
    }, { validators: [minOrderKgValidator(10)] });
  }

  get formControl() {
    return this.orderForm.controls;
  }

  loadData(): void {
    this.isLoading = true;

    this.subs.sink = forkJoin({
        mangoTypes: this.mangoTypeService.list(),
        courierAreas: this.courierAreaService.getDropdown(),
        availabilities: this.availabilityProxy.get(),
      }).pipe(
      switchMap(({ mangoTypes, courierAreas, availabilities }) => {
        this.mangoTypes = mangoTypes.data;
        this.mangoTypeOptions = this.dropdownService.mapToEntityDropdown(this.mangoTypes, 'id', 'name');
        this.courierAreaOptions = courierAreas.data;
        const activeAvail: MangoAvailabilityDto[] = availabilities.data ?? [];
        this.priceMap = activeAvail.reduce((map, a) => {
          map[a.mangoTypeId] = a.pricePerKg;
          return map;
        }, {} as Record<number, number>);

        if (!this.id) {
          this.orderDto = this.initObject();
          this.afterDataLoad(false);
          return of(null);
        }

        return this.orderService.getById(this.id);
      })
    ).subscribe({
      next: (orderRes) => {
        if (orderRes) {
          this.orderDto = orderRes.data;
          this.orderDetails = this.orderDto.orderDetails;
          this.updateOrderDetailsWithNames();
          this.afterDataLoad(true);
          this.cdRef.detectChanges();
        }
      },
      error: () => this.handleLoadError()
    });
  }

  private afterDataLoad(isEditMode: boolean): void {
    this.orderForm = this.buildForm();

    if (isEditMode) {
      if(this.orderDto.courierStationId){
        this.isFallbackMode = false;
        this.orderForm.patchValue({
          area: this.orderDto.area, 
          courierStationId: this.orderDto.courierStationId,
        });        
        this.findCourierStation(this.orderDto.area, this.orderDto.courierStationId);
      }else{
        this.isFallbackMode = true;
        this.orderForm.patchValue({
          area: this.orderDto.area, 
          fallbackAddress: this.orderDto.fallbackAddress,
        });
      }
      const firstItem = this.orderDetails.length > 0 ? this.orderDetails[0] : null;
      this.orderForm.patchValue({
        mangoType: firstItem?.mangoTypeId, 
        crateType: firstItem?.crateType,
        quantity: firstItem?.quantity,
        note: firstItem?.note
      });
    } else{
      this.orderForm.patchValue({
        mangoType: this.mangoTypeId || 0,
        crateType: 0,
        area: '0',
        quantity: 1,
        note: ''
      });
    }

    this.isLoading = false;
  }

  private handleLoadError(): void {
    this.isLoading = false;
    Swal.fire('Failed', 'Failed to load data.', 'error');
  }

  addOrder(): void {
    ['mangoType', 'crateType', 'quantity'].forEach(name =>
      this.orderForm.get(name)?.markAsTouched()
    );

    const formValue = this.orderForm.value;
    const mangoTypeId = +formValue.mangoType;
    const crateType = +formValue.crateType;
    const quantity = +formValue.quantity;

    if (!mangoTypeId || !crateType || quantity <= 0) {
      this.cdRef.detectChanges();
      return;
    }
    
    const mangoType = this.getMangoType(mangoTypeId);
    const unitPrice = this.priceMap[mangoTypeId] || 0;
    const crateWeight = DomainUtils.getCrateWeight(crateType);
    const totalPrice = quantity * unitPrice * crateWeight;

    const existingItem = this.orderDetails.find(item =>
      item.mangoTypeId === mangoTypeId &&
      item.crateType === crateType
    );
    
    if (existingItem) {
      // Update existing item
      existingItem.quantity += quantity;
      existingItem.totalPrice += totalPrice;
    }else{
      const orderDetail: OrderDetailDto = {
        id: this.createId(),
        mangoTypeId,
        crateType,
        quantity,
        note: formValue.note,
        unitPrice: unitPrice,
        totalPrice: totalPrice,
        mangoName: mangoType?.name,
        crateName: EnumLabelUtils.getCrateTypeLabel(crateType),
      };
      this.orderDetails.push(orderDetail);
    }    
    this.orderDto.totalAmount = this.getTotalPrice();
    this.orderForm.patchValue({ quantity: 1, note: '' });
    //this.orderForm.reset({ mangoType: null, crateType: null, quantity: 1, note: '' });
    this.cdRef.detectChanges();
  }

  updateOrderDetailsWithNames(): void {
    this.orderDetails = this.orderDetails.map(item => {
      const mango = this.getMangoType(item.mangoTypeId);
      return {
        ...item,
        mangoName: mango?.name ?? 'Unknown',
        crateName: EnumLabelUtils.getCrateTypeLabel(item.crateType)
      };
    });
  }

  private createId(): number {
    return this.orderDetails.length
      ? Math.max(...this.orderDetails.map(d => d.id)) + 1
      : 1;
  }

  remove(id: number): void {
    const index = this.orderDetails.findIndex(item => item.id === id);
    if (index !== -1) {
      this.orderDetails.splice(index, 1);
      this.orderDto.totalAmount = this.orderDetails.reduce((sum, item) => sum + item.totalPrice, 0);
      this.cdRef.detectChanges();
    }
  }

  reset(): void{
    this.orderForm.reset({ 
      mangoType: 0, 
      crateType: 0, 
      area: 0,
      quantity: 1, 
      note: '', 
    });
    this.isFallbackMode = false;
    this.availableStations = [];
    this.orderDetails = [];
  }

  getTotalPrice(): number {
    return this.orderDetails.reduce((sum, item) => sum + item.totalPrice, 0);
  }

  getMangoType(mangoTypeId: number): MangoTypeDto | undefined {
    return this.mangoTypes.find(m => m.id === mangoTypeId);
  }

  onSelectedOrderDate(date: NgbDate): void {
    const year = date.year.toString();
    const month = date.month.toString().padStart(2, '0');
    const day = date.day.toString().padStart(2, '0');
    this.orderDateObject = new Date(`${year}-${month}-${day}`);
  }

  save() {
    Swal.fire({
      title: 'Confirm Save',
      text: 'Are you sure you want to save this order?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Save it',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#0d6efd',  // Bootstrap primary
      cancelButtonColor: '#6c757d'    // Bootstrap secondary
    }).then(result => {
      if (result.isConfirmed) {
        this.performSave();
      }
    });
  }

  private performSave(): void {
    if (this.orderDetails.length === 0) { 
      Swal.fire("ORDER MISSING", "Please complete your new order."); 
      return; 
    }
    this.prepareData();
    if (this.orderDto.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  cancel() {
  if (this.orderDetails.length === 0) {
    this.modal.dismiss();
    return;
  }

  Swal.fire({
    title: 'Unsaved Items',
    text: 'You have unsaved order items. Do you really want to cancel?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, cancel',
    cancelButtonText: 'Go back',
    confirmButtonColor: '#dc3545', // red
    cancelButtonColor: '#6c757d'   // secondary
  }).then(result => {
    if (result.isConfirmed) {
      this.modal.dismiss();
    }
  });
}

  private edit(): void {
    this.isSubmitting = true;
    this.subs.sink = this.orderService.update(this.id, this.orderInputDto).pipe(
      finalize(() => { this.isSubmitting = false; this.cdRef.detectChanges(); })
    ).subscribe({
      next: (res: any) => {
        if (res?.succeeded) {
          Swal.fire('SUCCESS', 'Order updated successfully.', 'success');
          this.modal.close('success');
        } else {
          const msg = res?.messages?.join('\n') ?? 'Order update failed.';
          Swal.fire('Update Failed', msg, 'warning');
        }
      },
      error: () => {
        Swal.fire('FAILED', 'Order update failed.', 'error');
      }
    });
  }

  private create(): void {
    this.isSubmitting = true;
    this.subs.sink = this.orderService.create(this.orderInputDto).pipe(
      finalize(() => { this.isSubmitting = false; this.cdRef.detectChanges(); })
    ).subscribe({
      next: (res: any) => {
        if (res?.succeeded) {
          Swal.fire('SUCCESS', 'Order created successfully.', 'success');
          this.modal.close('success');
        } else {
          const msg = res?.messages?.join('\n') ?? 'Order creation failed.';
          Swal.fire('Order Not Placed', msg, 'warning');
        }
      },
      error: () => {
        Swal.fire('FAILED', 'Order creation failed.', 'error');
      }
    });
  }

  private prepareData(): void {
    const userId = this.authService.getLoggedUserId();

    this.orderInputDto = {
      ...this.orderInputDto,
      orderDetails: this.orderDetails,
      ...(this.orderDto.id
        ? { id: this.orderDto.id, userId: userId }
        : { userId: userId })
    };

    if (this.isFallbackMode) {
      this.orderInputDto.courierStationId = null;
      this.orderInputDto.fallbackAddress = this.orderForm.get('fallbackAddress')?.value;
    } else {
      this.orderInputDto.courierStationId = +this.orderForm.get('courierStationId')?.value;
      this.orderInputDto.fallbackAddress = null;
    }
  }

  private initObject(): OrderDto {
    return {
      id: 0,
      orderNumber: '',
      orderDate: null,
      totalQuantity: 0,
      orderStatus: OrderStatus.None,
      paymentStatus: PaymentStatus.None,
      totalAmount: 0,
      paidAmount: 0,
      dueAmount: 0,
      isValidOrder: true,
      isDelivered: false,
      deliveryDate: null,
      userId: 0,
      trackingNumber: '',
      courierStationId: 0,
      deliveryStatus: DeliveryStatus.None,
      orderDetails: [],
      area: ''
    };
  }

  private initNewOrder(): NewOrderDto {
    return {
      id: 0,
      mangoType: 0,
      crateType: 0,
      area: 0,
      quantity: 1,
      note: '',
      courierStationId: 0,
      fallbackAddress: '',
    };
  }
    
    get isSaveDisabled(): boolean {
    return !this.orderForm || !this.orderForm.valid || this.orderDetails.length === 0 || this.isSubmitting;
  }

  onAreaChanged(): void {
    const area = this.orderForm.get('area')?.value;
    this.subs.sink = this.courierService.getAvailableCouriers(area).subscribe(response => {
      this.availableStations = response.data;

      if (this.availableStations.length === 1) {
        this.isFallbackMode = false;
        this.orderForm.patchValue({ 
          courierStationId: this.availableStations[0].stationId 
        });
      } else if (this.availableStations.length === 0) {
        this.isFallbackMode = true;
        this.orderForm.get('courierStationId')?.reset();
      } else {
        this.isFallbackMode = false;
      }

      this.updateCourierValidation();
    });
  }

  findCourierStation(area: string, courierStationId: number): void {
    this.subs.sink = this.courierService.getAvailableCouriers(area).subscribe(response => {
      this.availableStations = response.data;
      
      // Check if the provided courierStationId exists in the available list
      const exists = this.availableStations.some(s => s.stationId === courierStationId);
      if (exists) {
        this.orderForm.patchValue({ courierStationId });
      } else {
        this.orderForm.get('courierStationId')?.reset();
      }

      this.updateCourierValidation();
    });
  }

  private updateCourierValidation(): void {
    const courierControl = this.orderForm.get('courierStationId');
    const fallbackControl = this.orderForm.get('fallbackAddress');

    if (this.isFallbackMode) {
      courierControl?.clearValidators();
      fallbackControl?.setValidators([Validators.required, Validators.minLength(10)]);
    } else {
      courierControl?.setValidators([Validators.required]);
      fallbackControl?.clearValidators();
    }

    courierControl?.updateValueAndValidity();
    fallbackControl?.updateValueAndValidity();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  isControlValid(controlName: string): boolean {
    const control = this.orderForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.orderForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation: string, controlName: string): boolean {
    const control = this.orderForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName: string): boolean {
    const control = this.orderForm.controls[controlName];
    return control.dirty || control.touched;
  }
}
