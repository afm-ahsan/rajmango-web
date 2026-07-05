import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { firstValueFrom, forkJoin, of, Subject, switchMap } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, finalize, tap } from 'rxjs/operators';
import { MangoAvailabilityDto, MangoAvailabilityServiceProxy, MangoAvailabilityStatus } from 'src/app/services/client-proxy';
import { DeliveryStatus } from 'src/app/shared/enums/delivery-status.enum';
import { OrderStatus } from 'src/app/shared/enums/order-status.enum';
import { PaymentStatus } from 'src/app/shared/enums/payment_status.enum';
import { ReceiverType } from 'src/app/shared/enums/receiver-type.enum';
import { DropdownModel, EntityDropdownModel } from 'src/app/shared/models/dropdown.model';
import { DropdownService } from 'src/app/shared/services/dropdown.service';
import { DomainUtils } from 'src/app/shared/utils/domain-utils';
import { EnumLabelUtils } from 'src/app/shared/utils/enum-label.utils';
import { bdMobileValidator } from 'src/app/shared/validators/bd-mobile.validator';
import { dropdownRequiredValidator } from 'src/app/shared/validators/dropdown-validators';
import { minOrderKgValidator } from 'src/app/shared/validators/order-validators';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import { AuthService } from '../../auth';
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

export interface AdminCustomerSearchResult {
  userId: number;
  fullName: string;
  phoneNumber: string;
  email: string;
}

@Component({
  selector: 'app-create-order-modal',
  templateUrl: './create-order-modal.component.html',
  styleUrls: ['./create-order-modal.component.scss']
})
export class CreateOrderModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  @Input() mangoTypeId: number = 0;
  /** When true, shows a customer selector at the top and routes save() to adminCreateForCustomer. */
  @Input() isAdminCreate = false;

  // ── Admin create-for-customer state ─────────────────────────────────────
  selectedCustomer: AdminCustomerSearchResult | null = null;
  customerResults: AdminCustomerSearchResult[] = [];
  isCustomerSearching = false;
  customerSearch$ = new Subject<string>();

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
  loadFailed = false;
  isCourierStationLoading = false;
  orderDateObject: Date;
  availableStations: AvailableCourierDto[] = [];
  stationCheckRequired = false;
  isFallbackMode = false;
  private priceMap: Record<number, number> = {};
  private initialOrderDetailsSnapshot = '[]';

  previewProductTotal: number | null = null;
  previewCourierCharge: number | null = null;
  previewGrandTotal: number | null = null;
  previewProviderName: string | null = null;
  previewRatePerKg: number | null = null;
  previewLocationType: number | null = null;
  previewMinimumCharge: number | null = null;
  previewChargeCalculated: number | null = null;
  isPreviewLoading = false;
  previewError: string | null = null;

  lastAddedItem: OrderDetailDto | null = null;
  itemAddedFeedback = false;
  private _feedbackTimer: ReturnType<typeof setTimeout> | null = null;

  areaTypeahead$ = new Subject<string>();
  isAreaSearching = false;
  areaHasNoMatch = false;

  readonly searchStation = (term: string, item: AvailableCourierDto): boolean => {
    const q = term.toLowerCase();
    return (item.providerName?.toLowerCase().includes(q) ?? false)
        || (item.stationName?.toLowerCase().includes(q) ?? false)
        || (item.area?.toLowerCase().includes(q) ?? false);
  };

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
    this.newOrderDto = this.initNewOrder();
    this.loadData();
    if (this.isAdminCreate && !this.id) {
      this.setupCustomerSearch();
    }
  }

  private setupCustomerSearch(): void {
    this.subs.sink = this.customerSearch$.pipe(
      debounceTime(350),
      distinctUntilChanged(),
      filter(term => !!term && term.length >= 2),
      tap(() => { this.isCustomerSearching = true; this.cdRef.detectChanges(); }),
      switchMap(term => this.orderService.adminCustomerSearch(term).pipe(
        catchError(() => of({ data: [] }))
      ))
    ).subscribe(res => {
      this.customerResults = res?.data ?? [];
      this.isCustomerSearching = false;
      this.cdRef.detectChanges();
    });
  }

  selectCustomer(c: AdminCustomerSearchResult): void {
    this.selectedCustomer = c;
    this.customerResults = [];
    this.cdRef.detectChanges();
  }

  clearSelectedCustomer(): void {
    this.selectedCustomer = null;
    this.cdRef.detectChanges();
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
        null,
        [dropdownRequiredValidator()],
      ],
      quantity: [
        this.newOrderDto.quantity,
        Validators.compose([Validators.required, Validators.min(1)]),
      ],
      courierStationId: [null],
      fallbackAddress: [this.newOrderDto.fallbackAddress],
      receiverType: [ReceiverType.Self, [Validators.required]],
      receiverName: [null],
      receiverMobileNumber: [null],
      deliveryNote: [null],
    }, { validators: [minOrderKgValidator(10)] });
  }

  get formControl() {
    return this.orderForm.controls;
  }

  loadData(): void {
    this.isLoading = true;
    this.loadFailed = false;

    const mangoTypes$ = this.mangoTypeService.list().pipe(
      catchError(() => { this.loadFailed = true; return of({ data: [] }); })
    );
    const availabilities$ = this.availabilityProxy.get().pipe(
      catchError(() => { this.loadFailed = true; return of({ data: [] }); })
    );

    this.subs.sink = forkJoin({
      mangoTypes: mangoTypes$,
      availabilities: availabilities$,
    }).pipe(
      switchMap(({ mangoTypes, availabilities }) => {
        this.mangoTypes = mangoTypes.data ?? [];
        const activeAvail: MangoAvailabilityDto[] = availabilities.data ?? [];

        // Admins see all mango types regardless of availability status.
        // This includes both the create-for-customer flow (isAdminCreate)
        // and admin users editing existing orders.
        const currentRoleCode = (this.authService.currentUserValue as any)?.roleCode ?? '';
        const isAdminUser = this.isAdminCreate ||
          currentRoleCode === 'system_admin' || currentRoleCode === 'admin';

        if (isAdminUser) {
          // Build price map preferring Available price, falling back to any configured price.
          this.priceMap = {};
          const grouped = new Map<number, MangoAvailabilityDto[]>();
          for (const a of activeAvail) {
            if (!grouped.has(a.mangoTypeId)) grouped.set(a.mangoTypeId, []);
            grouped.get(a.mangoTypeId)!.push(a);
          }
          for (const [typeId, avails] of grouped) {
            const preferred = avails.find(a => a.status === MangoAvailabilityStatus._1) ?? avails[0];
            this.priceMap[typeId] = preferred.pricePerKg;
          }

          // Show all mango types; append a status label for non-Available ones.
          const statusLabel: Record<number, string> = {
            [MangoAvailabilityStatus._0]: 'Upcoming',
            [MangoAvailabilityStatus._2]: 'Sold Out',
            [MangoAvailabilityStatus._3]: 'Season Ended',
          };
          this.mangoTypeOptions = this.mangoTypes.map(m => {
            const avail = activeAvail.find(a => a.mangoTypeId === m.id);
            const suffix = avail && avail.status !== MangoAvailabilityStatus._1
              ? ` (${statusLabel[avail.status] ?? 'Unavailable'})`
              : avail ? '' : ' (No availability)';
            return { id: m.id, name: `${m.name}${suffix}` };
          });
        } else {
          // Customer: existing behaviour — only Available and SoldOut types shown.
          this.priceMap = activeAvail.reduce((map, a) => {
            map[a.mangoTypeId] = a.pricePerKg;
            return map;
          }, {} as Record<number, number>);
          const availableIds = new Set(
            activeAvail
              .filter(a => a.status === MangoAvailabilityStatus._1 || a.status === MangoAvailabilityStatus._2)
              .map(a => a.mangoTypeId)
          );
          this.mangoTypeOptions = this.dropdownService.mapToEntityDropdown(
            this.mangoTypes.filter(m => availableIds.has(m.id)), 'id', 'name'
          );
        }

        if (!this.id) {
          this.orderDto = this.initObject();
          this.afterDataLoad(false);
          return of(null);
        }

        return this.orderService.getById(this.id).pipe(
          catchError(() => { this.loadFailed = true; return of(null); })
        );
      }),
      finalize(() => { this.isLoading = false; this.cdRef.detectChanges(); })
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
      error: () => {
        this.loadFailed = true;
        if (!this.orderForm) {
          this.orderForm = this.buildForm();
        }
      }
    });
  }

  private afterDataLoad(isEditMode: boolean): void {
    this.setupAreaTypeahead();
    this.orderForm = this.buildForm();

    this.subs.sink = this.orderForm.get('receiverType')!.valueChanges.subscribe(type => {
      this.updateReceiverValidators(type);
      this.cdRef.detectChanges();
    });

    this.subs.sink = this.orderForm.get('courierStationId')!.valueChanges.subscribe(() => {
      this.refreshPreview();
    });

    if (isEditMode) {
      // Seed the options with the saved area so ng-select can display the label immediately
      if (this.orderDto.area) {
        this.courierAreaOptions = [{ id: 0, name: this.orderDto.area }];
      }
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
        receiverType: this.orderDto.receiverType ?? ReceiverType.Self,
        receiverName: this.orderDto.receiverName ?? null,
        receiverMobileNumber: this.orderDto.receiverMobileNumber ?? null,
        deliveryNote: this.orderDto.deliveryNote ?? null,
      });
      this.updateReceiverValidators(this.orderDto.receiverType ?? ReceiverType.Self);
      if (!this.orderDto.courierStationId) {
        // Fallback mode: no async findCourierStation — finalise pristine state now
        this.orderForm.markAsPristine();
        this.orderForm.markAsUntouched();
        this.setInitialSnapshot();
      }
      // courierStationId path: findCourierStation() handles markAsPristine + snapshot
    } else {
      this.orderForm.patchValue({
        mangoType: this.mangoTypeId || 0,
        crateType: 0,
        area: null,
        quantity: 1,

        receiverType: ReceiverType.Self,
        receiverName: null,
        receiverMobileNumber: null,
      });
      this.updateReceiverValidators(ReceiverType.Self);
      this.orderForm.markAsPristine();
      this.orderForm.markAsUntouched();
      this.setInitialSnapshot();
    }

    this.isLoading = false;
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
      existingItem.quantity += quantity;
      existingItem.totalPrice += totalPrice;
      this.lastAddedItem = { ...existingItem };
    } else {
      const orderDetail: OrderDetailDto = {
        id: this.createId(),
        mangoTypeId,
        crateType,
        quantity,
        unitPrice: unitPrice,
        totalPrice: totalPrice,
        mangoName: mangoType?.name,
        crateName: EnumLabelUtils.getCrateTypeLabel(crateType),
      };
      this.orderDetails.push(orderDetail);
      this.lastAddedItem = orderDetail;
    }
    this.orderDto.totalAmount = this.getTotalPrice();
    this.orderForm.patchValue({ quantity: 1 });
    this.showAddedFeedback();
    this.cdRef.detectChanges();
    this.refreshPreview();
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
      this.refreshPreview();
    }
  }

  reset(): void {
    this.orderDetails = [];
    this.orderForm.reset({
      mangoType: 0,
      crateType: 0,
      area: null,
      quantity: 1,
      note: '',
      courierStationId: null,
      fallbackAddress: '',
      receiverType: ReceiverType.Self,
      receiverName: null,
      receiverMobileNumber: null,
    });
    this.updateReceiverValidators(ReceiverType.Self);
    this.updateCourierValidation();
    this.isFallbackMode = false;
    this.availableStations = [];
    this.courierAreaOptions = [];
    this.areaHasNoMatch = false;
    this.previewProductTotal = null;
    this.previewCourierCharge = null;
    this.previewGrandTotal = null;
    this.previewProviderName = null;
    this.previewRatePerKg = null;
    this.previewLocationType = null;
    this.previewMinimumCharge = null;
    this.previewChargeCalculated = null;
    this.previewError = null;
    this.lastAddedItem = null;
    this.itemAddedFeedback = false;
    this.cdRef.detectChanges();
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

  getItemWeight(item: OrderDetailDto): number {
    return item.quantity * DomainUtils.getCrateWeight(item.crateType);
  }

  private setupAreaTypeahead(): void {
    this.subs.sink = this.areaTypeahead$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(term => !!term && term.length >= 2),
      tap(() => { this.isAreaSearching = true; this.areaHasNoMatch = false; this.cdRef.detectChanges(); }),
      switchMap(term => this.courierAreaService.search(term).pipe(
        catchError(() => of({ data: [] }))
      ))
    ).subscribe(res => {
      // Strip any "Others" the backend may have included, then de-duplicate by normalised name
      const seen = new Set<string>();
      const realAreas = (res.data ?? []).filter((a: any) => {
        const key = (a.name ?? '').trim().toLowerCase();
        if (key === 'others' || seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      this.areaHasNoMatch = realAreas.length === 0;

      // Exactly one descriptive fallback – always last in the list
      this.courierAreaOptions = [
        ...realAreas,
        {
          id: -1,
          name: 'Others',
          label: 'Others – My delivery area is not listed. I will provide my full delivery address.',
        },
      ];
      this.isAreaSearching = false;
      this.cdRef.detectChanges();
    });
  }

  showAddedFeedback(): void {
    this.itemAddedFeedback = true;
    if (this._feedbackTimer) clearTimeout(this._feedbackTimer);
    this._feedbackTimer = setTimeout(() => {
      this.itemAddedFeedback = false;
      this.cdRef.detectChanges();
    }, 2500);
  }

  refreshPreview(): void {
    if (this.orderDetails.length === 0) {
      this.previewProductTotal = null;
      this.previewCourierCharge = null;
      this.previewGrandTotal = null;
      this.previewProviderName = null;
      this.previewRatePerKg = null;
      this.previewLocationType = null;
      this.previewMinimumCharge = null;
      this.previewChargeCalculated = null;
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
        this.previewRatePerKg        = data?.courierRatePerKg       ?? null;
        this.previewLocationType     = data?.courierLocationType    ?? null;
        this.previewMinimumCharge    = data?.minimumCharge          ?? null;
        this.previewChargeCalculated = data?.courierChargeCalculated ?? null;
        this.cdRef.detectChanges();
      },
      error: () => {
        this.previewError = 'Unable to calculate courier charge. Please try again.';
      }
    });
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

  save(): void {
    if (this.isSaveDisabled) return;

    Swal.fire({
      title: 'Confirm Save',
      text: 'Are you sure you want to save this order?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Save it',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#0d6efd',
      cancelButtonColor: '#6c757d',
      heightAuto: false,
      scrollbarPadding: false,
      allowOutsideClick: () => !Swal.isLoading(),
      allowEscapeKey: true,
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        this.isSubmitting = true;
        this.cdRef.detectChanges();
        try {
          this.prepareData();
          let call$;
          if (this.isAdminCreate && !this.id && this.selectedCustomer) {
            // Admin placing an order on behalf of a customer
            const customer = this.selectedCustomer!;
            call$ = this.orderService.adminCreateForCustomer({
              targetCustomerId:     customer.userId,
              courierStationId:     this.orderInputDto.courierStationId,
              fallbackAddress:      this.orderInputDto.fallbackAddress ?? null,
              receiverType:         this.orderInputDto.receiverType!,
              receiverName:         this.orderInputDto.receiverName ?? null,
              receiverMobileNumber: this.orderInputDto.receiverMobileNumber ?? null,
              deliveryNote:         this.orderForm.get('deliveryNote')?.value ?? null,
              orderDetails:         this.orderDetails.map(d => ({
                mangoTypeId: d.mangoTypeId,
                crateType:   d.crateType,
                quantity:    d.quantity,
                discount:    0,
              })),
            });
          } else {
            call$ = this.orderDto.id
              ? this.orderService.update(this.id, this.orderInputDto)
              : this.orderService.create(this.orderInputDto);
          }
          const res: any = await firstValueFrom(call$);
          if (res?.succeeded) return true;
          Swal.showValidationMessage(res?.messages?.join('\n') ?? 'Save failed.');
          return false;
        } catch {
          Swal.showValidationMessage('Save failed. Please try again.');
          return false;
        } finally {
          this.isSubmitting = false;
          this.cdRef.detectChanges();
        }
      },
    }).then(result => {
      if (result.isConfirmed && result.value === true) {
        Swal.fire({ title: 'Success', text: 'Order saved successfully.', icon: 'success', heightAuto: false, scrollbarPadding: false });
        this.modal.close('success');
      }
    });
  }

  cancel() {
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
    heightAuto: false,
    scrollbarPadding: false,
    allowOutsideClick: false,
    allowEscapeKey: true,
  }).then(result => {
    if (result.isConfirmed) {
      this.modal.dismiss();
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

    const receiverType: number = this.orderForm.get('receiverType')?.value ?? ReceiverType.Self;
    this.orderInputDto.receiverType = receiverType;
    this.orderInputDto.receiverName = receiverType === ReceiverType.Others ? this.orderForm.get('receiverName')?.value : null;
    this.orderInputDto.receiverMobileNumber = receiverType === ReceiverType.Others ? this.orderForm.get('receiverMobileNumber')?.value : null;
    this.orderInputDto.deliveryNote = this.orderForm.get('deliveryNote')?.value?.trim() || null;
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
    if (!this.orderForm || this.orderDetails.length === 0 || this.isSubmitting || this.isCourierStationLoading) return true;
    // In admin create mode, a customer must be selected before the form can be submitted
    if (this.isAdminCreate && !this.id && !this.selectedCustomer) return true;
    if (this.orderForm.get('area')?.invalid) return true;
    if (this.isFallbackMode) {
      if (this.orderForm.get('fallbackAddress')?.invalid) return true;
    } else {
      if (this.orderForm.get('courierStationId')?.invalid) return true;
    }
    const receiverType = this.orderForm.get('receiverType')?.value;
    if (receiverType === ReceiverType.Others) {
      if (this.orderForm.get('receiverName')?.invalid) return true;
      if (this.orderForm.get('receiverMobileNumber')?.invalid) return true;
    }
    return false;
  }

  get hasAreaSelected(): boolean {
    const v = this.orderForm?.get('area')?.value;
    return !!v && v !== '0';
  }

  onAreaChanged(): void {
    const area = this.orderForm.get('area')?.value;
    if (!area || area === '0') {
      this.availableStations = [];
      this.isFallbackMode = false;
      this.isCourierStationLoading = false;
      this.courierAreaOptions = [];
      this.areaHasNoMatch = false;
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
        Swal.fire({ title: 'Courier Unavailable', text: 'Unable to load courier stations for this area. Please try again.', icon: 'warning', heightAuto: false, scrollbarPadding: false });
      },
    });
  }

  findCourierStation(area: string, courierStationId: number): void {
    this.isCourierStationLoading = true;

    this.subs.sink = this.courierService.getAvailableCouriers(area).pipe(
      finalize(() => { this.isCourierStationLoading = false; this.cdRef.detectChanges(); })
    ).subscribe({
      next: (response) => {
        this.availableStations = response.data;
        const exists = this.availableStations.some(s => s.stationId === courierStationId);
        if (exists) {
          this.orderForm.patchValue({ courierStationId });
        } else {
          this.orderForm.get('courierStationId')?.reset();
        }
        this.updateCourierValidation();
        this.orderForm.markAsPristine();
        this.orderForm.markAsUntouched();
        this.setInitialSnapshot();
      },
      error: () => {
        this.availableStations = [];
        this.isFallbackMode = true;
        this.orderForm.get('courierStationId')?.reset();
        this.updateCourierValidation();
        this.orderForm.markAsPristine();
        this.orderForm.markAsUntouched();
        this.setInitialSnapshot();
        Swal.fire({ title: 'Courier Unavailable', text: 'Unable to load courier stations for this area. Please try again.', icon: 'warning', heightAuto: false, scrollbarPadding: false });
      },
    });
  }

  private serializeOrderDetails(details: OrderDetailDto[]): string {
    return JSON.stringify(
      details.map(({ mangoTypeId, crateType, quantity, note, unitPrice, totalPrice }) =>
        ({ mangoTypeId, crateType, quantity, note, unitPrice, totalPrice })
      )
    );
  }

  private setInitialSnapshot(): void {
    this.initialOrderDetailsSnapshot = this.serializeOrderDetails(this.orderDetails);
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
    if (this._feedbackTimer) clearTimeout(this._feedbackTimer);
    this.subs.unsubscribe();
  }

  getLocationTypeLabel(type: number | null): string {
    return EnumLabelUtils.getCourierLocationTypeLabel(type);
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
