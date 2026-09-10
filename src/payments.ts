import { BaaS } from './client';

export interface BaasPaymentMethod {
  code: string;
  name: string;
  description: string;
  category: 'mobile_money' | 'card' | 'wallet';
  currency: string;
  payin_fee_percent: number;
  payout_fee_percent: number;
  min_amount: number;
  max_amount: number;
  is_active: boolean;
  allow_payin: boolean;
  allow_payout: boolean;
  icon_url?: string;
}

export interface BaasTransaction {
  id: number | string;
  reference: string;
  external_reference?: string;
  type: 'payin' | 'payout';
  payment_method: string;
  gross_amount: number;
  fee_rate: number;
  fee_amount: number;
  net_amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'success' | 'failed' | 'cancelled';
  phone?: string;
  customer_name?: string;
  customer_email?: string;
  description?: string;
  payment_url?: string;
  paid_at?: string;
  created_at: string;
}

export interface PayinOptions {
  amount: number;
  paymentMethod: 'orange_money' | 'mtn_momo' | 'PayPal' | 'card' | 'ORANGE_MONEY' | 'MTN_MOMO' | 'PAYPAL' | 'CARD' | string;
  phone?: string;
  customerName?: string;
  customerEmail?: string;
  description?: string;
  currency?: string;
  callbackUrl?: string;
  returnUrl?: string;
  metadata?: Record<string, any>;
}

export interface PayinResult {
  success: boolean;
  transaction_id: number | string;
  reference: string;
  status: string;
  gross_amount: number;
  fee_rate: number;
  fee_amount: number;
  net_amount: number;
  currency: string;
  payment_method: string;
  payment_url?: string;
  ussd_prompt?: string;
  message: string;
  created_at: string;
}

export interface PayoutOptions {
  amount: number;
  paymentMethod: 'MTN_MOMO' | 'ORANGE_MONEY' | 'EU_MOBILE' | string;
  phone: string;
  beneficiaryName?: string;
  description?: string;
  currency?: string;
  callbackUrl?: string;
  metadata?: Record<string, any>;
}

export interface PayoutResult {
  success: boolean;
  payout_id: number | string;
  reference: string;
  status: string;
  gross_amount: number;
  fee_rate: number;
  fee_amount: number;
  net_amount: number;
  currency: string;
  payment_method: string;
  phone?: string;
  message: string;
  created_at: string;
}

export interface CheckoutSessionOptions {
  amount: number;
  currency?: string;
  allowedMethods?: string[];
  customerName?: string;
  customerEmail?: string;
  phone?: string;
  description?: string;
  notifyUrl?: string;
  successUrl?: string;
  failUrl?: string;
  callbackUrl?: string;
  returnUrl?: string;
  cancelUrl?: string;
  metadata?: Record<string, any>;
}

export interface CheckoutSessionResult {
  success: boolean;
  transaction_id: number | string;
  reference: string;
  checkout_url: string;
  status: string;
  gross_amount: number;
  currency: string;
  description?: string;
  allowed_methods: string[];
  notify_url?: string;
  success_url?: string;
  fail_url?: string;
  message: string;
  created_at: string;
}

export class BaasPayments {
  constructor(private client: BaaS) {}

  /**
   * Récupérer les moyens de paiement disponibles et leurs frais (7% PayIn / 0% PayOut)
   */
  async getPaymentMethods(): Promise<BaasPaymentMethod[]> {
    const res = await this.client.request<{ data: BaasPaymentMethod[] }>('GET', 'payments/methods');
    return res.data || [];
  }

  /**
   * Créer une session de paiement hébergée (Hosted Checkout Link)
   * Retourne une URL unique vers laquelle rediriger l'utilisateur.
   * À la fin du paiement, CamSchool BaaS envoie les données vers notify_url (IPN webhook)
   * et redirige le client vers success_url ou fail_url.
   */
  async createCheckoutSession(options: CheckoutSessionOptions): Promise<CheckoutSessionResult> {
    const res = await this.client.request<CheckoutSessionResult>('POST', 'payments/checkout', {
      amount: options.amount,
      currency: options.currency || 'XAF',
      allowed_methods: options.allowedMethods,
      customer_name: options.customerName,
      customer_email: options.customerEmail,
      phone: options.phone,
      description: options.description,
      notify_url: options.notifyUrl || options.callbackUrl,
      success_url: options.successUrl || options.returnUrl,
      fail_url: options.failUrl || options.cancelUrl,
      metadata: options.metadata,
    });
    return res;
  }

  /**
   * Initier un paiement / encaissement (PayIn) - Commission 7%
   */
  async initiatePayin(options: PayinOptions): Promise<PayinResult> {
    const res = await this.client.request<{ success: boolean; data: PayinResult }>('POST', 'payments/payin', {
      amount: options.amount,
      payment_method: options.paymentMethod,
      phone: options.phone,
      customer_name: options.customerName,
      customer_email: options.customerEmail,
      description: options.description,
      currency: options.currency || 'XAF',
      callback_url: options.callbackUrl,
      return_url: options.returnUrl,
      metadata: options.metadata,
    });
    return res.data;
  }

  /**
   * Initier un retrait / décaissement (PayOut) - Commission 0% (Gratuit)
   */
  async initiatePayout(options: PayoutOptions): Promise<PayoutResult> {
    const res = await this.client.request<{ success: boolean; data: PayoutResult }>('POST', 'payments/payout', {
      amount: options.amount,
      payment_method: options.paymentMethod,
      phone: options.phone,
      beneficiary_name: options.beneficiaryName,
      description: options.description,
      currency: options.currency || 'XAF',
      callback_url: options.callbackUrl,
      metadata: options.metadata,
    });
    return res.data;
  }

  /**
   * Obtenir le statut en direct d'une transaction
   */
  async getStatus(transactionIdOrRef: string | number): Promise<BaasTransaction> {
    const res = await this.client.request<{ success: boolean; data: BaasTransaction }>(
      'GET',
      `payments/status/${transactionIdOrRef}`
    );
    return res.data;
  }

  /**
   * Lister l'historique des transactions
   */
  async listTransactions(filters?: { type?: string; status?: string; paymentMethod?: string; limit?: number }): Promise<BaasTransaction[]> {
    const res = await this.client.request<{ data: BaasTransaction[] }>('GET', 'payments/transactions');
    return res.data || [];
  }

  /**
   * Suivre en direct (polling) une transaction jusqu'à validation
   */
  async pollTransaction(
    transactionIdOrRef: string | number,
    options?: {
      intervalMs?: number;
      timeoutMs?: number;
      onUpdate?: (tx: BaasTransaction) => void;
    }
  ): Promise<BaasTransaction> {
    const interval = options?.intervalMs || 3000;
    const timeout = options?.timeoutMs || 300000; // 5 min
    const startTime = Date.now();

    return new Promise((resolve, reject) => {
      const timer = setInterval(async () => {
        try {
          if (Date.now() - startTime > timeout) {
            clearInterval(timer);
            return reject(new Error('Paiement expiré (Timeout).'));
          }

          const tx = await this.getStatus(transactionIdOrRef);
          options?.onUpdate?.(tx);

          if (tx.status === 'success') {
            clearInterval(timer);
            resolve(tx);
          } else if (tx.status === 'failed' || tx.status === 'cancelled') {
            clearInterval(timer);
            reject(new Error(`Transaction échouée avec le statut: ${tx.status}`));
          }
        } catch (err) {
          // continue polling on transient network error
        }
      }, interval);
    });
  }
}
