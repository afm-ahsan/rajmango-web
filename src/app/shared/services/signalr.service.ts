import { Injectable, OnDestroy } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from '@microsoft/signalr';
import { BehaviorSubject, Subject } from 'rxjs';
import { SubSink } from 'subsink';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { environment } from 'src/environments/environment';

// ── Typed event payloads matching backend RealtimeEvents ────────────────────

export interface OrderCreatedPayload {
  orderId: number;
  orderNumber: string;
  userId: number;
}

export interface OrderStatusUpdatedPayload {
  orderId: number;
  orderNumber: string;
  status: string;
  userId: number;
}

export interface PaymentReceivedPayload {
  paymentId: number;
  orderNumber: string;
  amount: number;
  userId: number;
}

export interface ComplaintSubmittedPayload {
  complaintId: number;
  orderId: number;
  userId: number;
  category: string;
}

export interface ComplaintStatusUpdatedPayload {
  complaintId: number;
  status: string;
  userId: number;
}

export interface CatalogUpdatedPayload {
  mangoTypeId: number;
  status?: string;
}

export type SignalRConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

// ── Service ─────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class SignalRService implements OnDestroy {
  private connection: HubConnection | null = null;
  private subs = new SubSink();
  private readonly hubUrl = `${environment.apis.default.url}/hubs/rajmango`;
  private readonly tokenKey = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  // Guards against the async disconnect/reconnect race:
  // - isStopping: stop() is in flight; don't create a new connection yet
  // - reconnectAfterStop: connect() was requested while stopping; retry once stop completes
  private isStopping = false;
  private reconnectAfterStop = false;

  // Connection state
  readonly state$ = new BehaviorSubject<SignalRConnectionState>('disconnected');

  // Event streams — one Subject per backend event
  readonly orderCreated$ = new Subject<OrderCreatedPayload>();
  readonly orderStatusUpdated$ = new Subject<OrderStatusUpdatedPayload>();
  readonly paymentReceived$ = new Subject<PaymentReceivedPayload>();
  readonly complaintSubmitted$ = new Subject<ComplaintSubmittedPayload>();
  readonly complaintStatusUpdated$ = new Subject<ComplaintStatusUpdatedPayload>();
  readonly catalogUpdated$ = new Subject<CatalogUpdatedPayload>();

  constructor(private authService: AuthService) {
    // Start/stop the connection whenever auth state changes
    this.subs.sink = this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.connect();
      } else {
        this.disconnect();
      }
    });
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  get isConnected(): boolean {
    return this.connection?.state === HubConnectionState.Connected;
  }

  // ── Private: connection lifecycle ──────────────────────────────────────────

  private connect(): void {
    // If a stop() is in flight, defer until it completes to avoid orphaned connections.
    if (this.isStopping) {
      this.reconnectAfterStop = true;
      return;
    }
    if (this.connection) return; // already connected or connecting

    const token = this.readToken();
    if (!token) return;

    this.state$.next('connecting');

    this.connection = new HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        accessTokenFactory: () => this.readToken() ?? '',
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(LogLevel.Warning)
      .build();

    this.registerHandlers();
    this.hookConnectionEvents();

    this.connection
      .start()
      .then(() => this.state$.next('connected'))
      .catch(() => {
        this.state$.next('error');
        this.connection = null;
      });
  }

  private disconnect(): void {
    if (!this.connection) return;
    this.isStopping = true;
    this.connection.stop().finally(() => {
      this.connection = null;
      this.isStopping = false;
      this.state$.next('disconnected');
      if (this.reconnectAfterStop) {
        this.reconnectAfterStop = false;
        this.connect();
      }
    });
  }

  private hookConnectionEvents(): void {
    if (!this.connection) return;
    this.connection.onreconnecting(() => this.state$.next('connecting'));
    this.connection.onreconnected(() => this.state$.next('connected'));
    this.connection.onclose(() => {
      this.connection = null;
      this.state$.next('disconnected');
      // If the close was not triggered by our own stop() call (e.g. auto-reconnect
      // exhausted all attempts) and the user is still authenticated, restart the
      // connection so the hub comes back without requiring a logout/login cycle.
      if (!this.isStopping && this.authService.currentUserValue) {
        this.connect();
      }
    });
  }

  // ── Private: event handler registration ───────────────────────────────────

  private registerHandlers(): void {
    if (!this.connection) return;

    this.connection.on('order-created', (p: OrderCreatedPayload) =>
      this.orderCreated$.next(p)
    );
    this.connection.on('order-status-updated', (p: OrderStatusUpdatedPayload) =>
      this.orderStatusUpdated$.next(p)
    );
    this.connection.on('payment-received', (p: PaymentReceivedPayload) =>
      this.paymentReceived$.next(p)
    );
    this.connection.on('complaint-submitted', (p: ComplaintSubmittedPayload) =>
      this.complaintSubmitted$.next(p)
    );
    this.connection.on('complaint-status-updated', (p: ComplaintStatusUpdatedPayload) =>
      this.complaintStatusUpdated$.next(p)
    );
    this.connection.on('catalog-updated', (p: CatalogUpdatedPayload) =>
      this.catalogUpdated$.next(p)
    );
  }

  // ── Private: helpers ───────────────────────────────────────────────────────

  private readToken(): string | undefined {
    try {
      const raw = localStorage.getItem(this.tokenKey);
      return raw ? JSON.parse(raw)?.authToken : undefined;
    } catch {
      return undefined;
    }
  }

  ngOnDestroy(): void {
    this.disconnect();
    this.subs.unsubscribe();
  }
}
