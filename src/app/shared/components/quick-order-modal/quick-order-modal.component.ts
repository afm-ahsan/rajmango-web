import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, of, switchMap } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/features/auth';
import { CourierAreaMapService } from 'src/app/features/couriers/courier-area-map/courier-area-map.service';
import { CourierStationService } from 'src/app/features/couriers/courier-station/courier-station.service';
import { AvailableCourierDto } from 'src/app/features/couriers/courier-station/models/available-courier.dto';
import { MangoTypeService } from 'src/app/features/mango-types/mango-type.service';
import { MangoTypeDto } from 'src/app/features/mango-types/models/mango-type-dto.model';
import { OrderService } from 'src/app/features/orders/order.service';
import { OrderInputDto } from 'src/app/features/orders/models/order-input-dto.model';
import { OrderDetailDto } from 'src/app/features/orders/models/order-detail-dto.model';
import { OrderDto } from 'src/app/features/orders/models/order-dto.model';
import { DeliveryStatus } from '../../enums/delivery-status.enum';
import { OrderStatus } from '../../enums/order-status.enum';
import { PaymentStatus } from '../../enums/payment_status.enum';
import { DropdownModel, EntityDropdownModel } from '../../models/dropdown.model';
import { DropdownService } from '../../services/dropdown.service';
import { DomainUtils } from '../../utils/domain-utils';
import { EnumLabelUtils } from '../../utils/enum-label.utils';
import { ReceiverType } from '../../enums/receiver-type.enum';
import { dropdownRequiredValidator } from '../../validators/dropdown-validators';
import { minOrderKgValidator } from '../../validators/order-validators';
import { bdMobileValidator } from '../../validators/bd-mobile.validator';

@Component({
  selector: 'app-quick-order-modal',
  templateUrl: './quick-order-modal.component.html',
})
export class QuickOrderModalComponent implements OnInit, OnDestroy {
  @Input() mango: any;

  mangoTypes: MangoTypeDto[] = [];
  mangoTypeOptions: EntityDropdownModel[] = [];
  courierAreaOptions: EntityDropdownModel[] = [];
  orderForm: FormGroup;
  orderDto: OrderDto = {} as OrderDto;
  orderInputDto: OrderInputDto = {} as OrderInputDto;
  orderDetails: OrderDetailDto[] = [];
  crateTypeOptions: DropdownModel[] = [];
  availableStations: AvailableCourierDto[] = [];
  stationCheckRequired = false;
  isFallbackMode = false;
  isLoading = false;
  isCourierStationLoading = false;
  subs = new SubSink();
  private initialOrderDetailsSnapshot = '[]';

  previewProductTotal: number | null = null;
  previewCourierCharge: number | null = null;
  previewGrandTotal: number | null = null;
  previewProviderName: string | null = null;
  isPreviewLoading = false;
  previewError: string | null = null;

  readonly searchStation = (term: string, item: AvailableCourierDto): boolean => {
    const q = term.toLowerCase();
    return (item.providerName?.toLowerCase().includes(q) ?? false)
        || (item.stationName?.toLowerCase().includes(q) ?? false)
        || (item.area?.toLowerCase().includes(q) ?? false);
  };

  constructor(
    public modal: NgbActiveModal,
    private fb: FormBuilder,
    private authService: AuthService,
    private orderService: OrderService,
    private cdRef: ChangeDetectorRef,
    private dropdownService: DropdownService,
    private mangoTypeService: MangoTypeService,
    private courierService: CourierStationService,
    private courierAreaService: CourierAreaMapService
  ) {}

  ngOnInit(): void {
    this.crateTypeOptions = this.dropdownService.getCrateTypeOptions();
    this.loadData();
  }

  private buildForm(): FormGroup {
    return this.fb.group(
      {
        mangoType: [this.mango?.id ?? 0, [dropdownRequiredValidator()]],
        crateType: [0, [dropdownRequiredValidator()]],
        area: [null, [dropdownRequiredValidator()]],
        quantity: [1, Validators.compose([Validators.required, Validators.min(1)])],
        note: [''],
        courierStationId: [null],
        fallbackAddress: [''],
        receiverType: [ReceiverType.Self, [Validators.required]],
        receiverName: [null],
        receiverMobileNumber: [null],
      },
      { validators: [minOrderKgValidator(10)] }
    );
  }

  get formControl() {
    return this.orderForm.controls;
  }

  loadData(): void {
    this.isLoading = true;
    this.subs.sink = forkJoin({
      mangoTypes: this.mangoTypeService.list(),
      courierAreas: this.courierAreaService.getDropdown(),
    })
      .pipe(
        switchMap(({ mangoTypes, courierAreas }) => {
          this.mangoTypes = mangoTypes.data;
          this.mangoTypeOptions = this.dropdownService.mapToEntityDropdown(this.mangoTypes, 'id', 'name');
          this.courierAreaOptions = courierAreas.data;
          this.orderDto = this.initObject();
          this.afterDataLoad();
          return of(null);
        })
      )
      .subscribe({
        next: () => {},
        error: () => {
          this.isLoading = false;
          Swal.fire('Failed', 'Failed to load data.', 'error');
        },
      });
  }

  private afterDataLoad(): void {
    this.orderForm = this.buildForm();

    this.subs.sink = this.orderForm.get('receiverType')!.valueChanges.subscribe(type => {
      this.updateReceiverValidators(type);
      this.cdRef.detectChanges();
    });

    this.subs.sink = this.orderForm.get('courierStationId')!.valueChanges.subscribe(() => {
      this.refreshPreview();
    });

    this.orderForm.patchValue({
      mangoType: this.mango?.id ?? 0,
      crateType: 0,
      area: null,
      quantity: 1,
      note: '',
      receiverType: ReceiverType.Self,
      receiverName: null,
      receiverMobileNumber: null,
    });
    this.updateReceiverValidators(ReceiverType.Self);
    this.orderForm.markAsPristine();
    this.orderForm.markAsUntouched();
    this.initialOrderDetailsSnapshot = '[]';
    this.isLoading = false;
    this.cdRef.detectChanges();
  }

  private serializeOrderDetails(details: OrderDetailDto[]): string {
    return JSON.stringify(
      details.map(({ mangoTypeId, crateType, quantity, note, unitPrice, totalPrice }) =>
        ({ mangoTypeId, crateType, quantity, note, unitPrice, totalPrice })
      )
    );
  }

  get hasUnsavedChanges(): boolean {
    if (!this.orderForm) return false;
    if (this.orderForm.dirty) return true;
    return this.serializeOrderDetails(this.orderDetails) !== this.initialOrderDetailsSnapshot;
  }

  private updateReceiverValidators(type: number): void {
    const nameControl = this.orderForm.get('receiverName');
    const mobileControl = this.orderForm.get('receiverMobileNumber');
    if (type === ReceiverType.Others) {
      nameControl?.setValidators([Validators.required]);
      mobileControl?.setValidators([Validators.required, bdMobileValidator()]);
    } else {
      nameControl?.clearValidators();
      mobileControl?.clearValidators();
    }
    nameControl?.updateValueAndValidity();
    mobileControl?.updateValueAndValidity();
  }

  addOrder(): void {
    const formValue = this.orderForm.value;
    const mangoTypeId = +formValue.mangoType;
    const crateType = +formValue.crateType;
    const quantity = +formValue.quantity;

    if (!mangoTypeId || !crateType || quantity <= 0) {
      Swal.fire('Invalid Input', 'Please fill out all required fields correctly.', 'warning');
      return;
    }

    const mangoType = this.getMangoType(mangoTypeId);
    const unitPrice = this.mango?.price || 0;
    const crateWeight = DomainUtils.getCrateWeight(crateType);
    const totalPrice = quantity * unitPrice * crateWeight;

    const existingItem = this.orderDetails.find(
      (item) => item.mangoTypeId === mangoTypeId && item.crateType === crateType
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.totalPrice += totalPrice;
    } else {
      const orderDetail: OrderDetailDto = {
        id: this.createId(),
        mangoTypeId,
        crateType,
        quantity,
        note: formValue.note,
        unitPrice,
        totalPrice,
        mangoName: mangoType?.name,
        crateName: EnumLabelUtils.getCrateTypeLabel(crateType),
      };
      this.orderDetails.push(orderDetail);
    }

    this.orderDto.totalAmount = this.getTotalPrice();
    this.orderForm.patchValue({ quantity: 1, note: '' });
    this.cdRef.detectChanges();
    this.refreshPreview();
  }

  private createId(): number {
    return this.orderDetails.length ? Math.max(...this.orderDetails.map((d) => d.id)) + 1 : 1;
  }

  remove(id: number): void {
    const index = this.orderDetails.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.orderDetails.splice(index, 1);
      this.orderDto.totalAmount = this.orderDetails.reduce((sum, item) => sum + item.totalPrice, 0);
      this.cdRef.detectChanges();
      this.refreshPreview();
    }
  }

  reset(): void {
    this.orderDetails = [];
    this.orderForm.reset({
      mangoType: this.mango?.id ?? 0,
      crateType: 0,
      area: 0,
      quantity: 1,
      note: '',
      receiverType: ReceiverType.Self,
      receiverName: null,
      receiverMobileNumber: null,
    });
    this.updateReceiverValidators(ReceiverType.Self);
    this.isFallbackMode = false;
    this.availableStations = [];
  }

  getTotalPrice(): number {
    return this.orderDetails.reduce((sum, item) => sum + item.totalPrice, 0);
  }

  getTotalWeight(): number {
    return this.orderDetails.reduce((sum, item) => {
      const crateWeight = DomainUtils.getCrateWeight(item.crateType);
      return sum + (item.quantity * crateWeight);
    }, 0);
  }

  refreshPreview(): void {
    if (this.orderDetails.length === 0) {
      this.previewProductTotal = null;
      this.previewCourierCharge = null;
      this.previewGrandTotal = null;
      this.previewProviderName = null;
      this.previewError = null;
      this.cdRef.detectChanges();
      return;
    }
    const rawStationId = this.isFallbackMode ? null : (this.orderForm?.get('courierStationId')?.value ?? null);
    const stationId = rawStationId != null ? +rawStationId : null;
    this.isPreviewLoading = true;
    this.previewError = null;
    this.cdRef.detectChanges();

    this.subs.sink = this.orderService.calculatePreview({
      courierStationId: stationId,
      orderDetails: this.orderDetails.map(d => ({ mangoTypeId: d.mangoTypeId, crateType: d.crateType, quantity: d.quantity }))
    }).pipe(
      finalize(() => { this.isPreviewLoading = false; this.cdRef.detectChanges(); })
    ).subscribe({
      next: (res) => {
        const data = res?.data;
        this.previewProductTotal = data?.productTotalAmount ?? null;
        this.previewCourierCharge = data?.courierCharge ?? null;
        this.previewGrandTotal = data?.totalAmount ?? null;
        this.previewProviderName = data?.courierProviderName ?? null;
        this.cdRef.detectChanges();
      },
      error: () => {
        this.previewError = 'Unable to calculate courier charge. Please try again.';
      }
    });
  }

  getMangoType(mangoTypeId: number): MangoTypeDto | undefined {
    return this.mangoTypes.find((m) => m.id === mangoTypeId);
  }

  save(): void {
    Swal.fire({
      title: 'Confirm Order',
      text: 'Are you sure you want to place this order?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Place Order',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#0d6efd',
      cancelButtonColor: '#6c757d',
    }).then((result) => {
      if (result.isConfirmed) this.performSave();
    });
  }

  private performSave(): void {
    if (this.orderDetails.length === 0) {
      Swal.fire('Order Missing', 'Please add at least one item to your order.', 'warning');
      return;
    }
    this.prepareData();
    this.subs.sink = this.orderService.create(this.orderInputDto).subscribe({
      next: () => {
        this.modal.close('success');
        Swal.fire({
          icon: 'success',
          title: 'Order Placed!',
          text: 'Your order has been placed successfully.',
          confirmButtonColor: '#0d6efd',
        });
      },
      error: () => {
        Swal.fire('Failed', 'Order creation failed. Please try again.', 'error');
      },
    });
  }

  cancel(): void {
    if (!this.hasUnsavedChanges) {
      this.modal.dismiss();
      return;
    }
    Swal.fire({
      title: 'Unsaved Changes',
      text: 'You have unsaved changes. Do you really want to cancel?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel',
      cancelButtonText: 'Go back',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
    }).then((result) => {
      if (result.isConfirmed) this.modal.dismiss();
    });
  }

  private prepareData(): void {
    const userId = this.authService.getLoggedUserId();
    this.orderInputDto = { ...this.orderInputDto, orderDetails: this.orderDetails, userId };
    if (this.isFallbackMode) {
      this.orderInputDto.courierStationId = null;
      this.orderInputDto.fallbackAddress = this.orderForm.get('fallbackAddress')?.value;
    } else {
      this.orderInputDto.courierStationId = +this.orderForm.get('courierStationId')?.value;
      this.orderInputDto.fallbackAddress = null;
    }
    const receiverType: number = this.orderForm.get('receiverType')?.value ?? ReceiverType.Self;
    this.orderInputDto.receiverType = receiverType;
    this.orderInputDto.receiverName = receiverType === ReceiverType.Others ? this.orderForm.get('receiverName')?.value : null;
    this.orderInputDto.receiverMobileNumber = receiverType === ReceiverType.Others ? this.orderForm.get('receiverMobileNumber')?.value : null;
  }

  private initObject(): OrderDto {
    return {
      id: 0,
      orderNumber: '',
      orderDate: null,
      totalQuantity: 0,
      orderStatus: OrderStatus.Pending,
      paymentStatus: PaymentStatus.Unpaid,
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
      area: '',
    };
  }

  onAreaChanged(): void {
    const area = this.orderForm.get('area')?.value;
    if (!area || area === '0') {
      this.availableStations = [];
      this.isFallbackMode = false;
      this.isCourierStationLoading = false;
      this.orderForm.get('courierStationId')?.reset();
      this.updateCourierValidation();
      this.cdRef.detectChanges();
      return;
    }
    this.availableStations = [];
    this.isFallbackMode = false;
    this.orderForm.get('courierStationId')?.reset();
    this.isCourierStationLoading = true;
    this.cdRef.detectChanges();

    this.subs.sink = this.courierService.getAvailableCouriers(area).pipe(
      finalize(() => { this.isCourierStationLoading = false; this.cdRef.detectChanges(); })
    ).subscribe({
      next: (response) => {
        this.availableStations = response.data;
        if (this.availableStations.length === 1) {
          this.isFallbackMode = false;
          this.orderForm.patchValue({ courierStationId: this.availableStations[0].stationId });
        } else if (this.availableStations.length === 0) {
          this.isFallbackMode = true;
          this.orderForm.get('courierStationId')?.reset();
        } else {
          this.isFallbackMode = false;
        }
        this.updateCourierValidation();
      },
      error: () => {
        this.availableStations = [];
        this.isFallbackMode = true;
        this.orderForm.get('courierStationId')?.reset();
        this.updateCourierValidation();
        Swal.fire('Courier Unavailable', 'Unable to load courier stations for this area. Please try again.', 'warning');
      },
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

  get isSaveDisabled(): boolean {
    return !this.orderForm || !this.orderForm.valid || this.orderDetails.length === 0 || this.isCourierStationLoading;
  }

  get hasAreaSelected(): boolean {
    const v = this.orderForm?.get('area')?.value;
    return !!v && v !== '0';
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

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
