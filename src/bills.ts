import { BaasClient } from './client';

export interface BillService {
  code: string;
  name: string;
  merchant: string;
  category: string;
  currency: string;
  min_amount: number;
  max_amount: number;
  admin_fee_type: 'fixed' | 'percent';
  admin_fee_amount: number;
  admin_fee_percent: number;
}

export interface BillPayParams {
  service_code: string;
  service_number: string;
  amount: number;
  penalty_amount?: number;
  pay_item_id?: string;
  bill_number?: string;
  bill_month?: string;
  bill_year?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  custom_fields?: Record<string, string>;
}

export interface AirtimePayParams {
  service_code: string;
  phone: string;
  amount: number;
  customer_name?: string;
  customer_email?: string;
  custom_fields?: Record<string, string>;
}

export interface InvoiceListParams {
  search?: string;
  service_code?: string;
  status?: 'success' | 'pending' | 'failed';
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
}

export interface BillInvoice {
  id: number;
  reference: string;
  ptn: string;
  service_code: string;
  service_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  bill_number?: string;
  bill_amount: number;
  penalty_amount: number;
  admin_fee: number;
  total_amount: number;
  currency: string;
  status: string;
  paid_at: string | null;
  created_at: string;
  receipt_url: string;
  render_url: string;
  invoice?: any;
  details?: any;
}

export class BaasBills {
  private client: BaasClient;

  constructor(client: BaasClient) {
    this.client = client;
  }

  /**
   * List all available utility services (ENEO, CamWater, Canal+, MTN, Orange, Camtel...)
   */
  async getServices(): Promise<{ success: boolean; services: BillService[] }> {
    return this.client.request('GET', 'bills/services');
  }

  /**
   * Check unpaid bill arrears for post-paid meters or contracts (ENEO, CamWater)
   */
  async checkBill(serviceCode: string, serviceNumber: string): Promise<any> {
    return this.client.request('POST', 'bills/check', {
      body: {
        service_code: serviceCode,
        service_number: serviceNumber,
      },
    });
  }

  /**
   * Get TV bouquets, data packages or vouchers for a service
   */
  async getPackages(serviceCode: string): Promise<any> {
    return this.client.request('GET', `bills/packages/${serviceCode}`);
  }

  /**
   * Pay a utility bill (ENEO, CamWater, Canal+, StarSat)
   */
  async payBill(params: BillPayParams): Promise<any> {
    return this.client.request('POST', 'bills/pay', { body: params });
  }

  /**
   * Recharge mobile airtime or data plan (MTN, Orange, Nexttel, Camtel, YooMee)
   */
  async payAirtime(params: AirtimePayParams): Promise<any> {
    return this.client.request('POST', 'bills/airtime', { body: params });
  }

  /**
   * List all project invoices / receipts with filters and pagination
   */
  async listInvoices(params?: InvoiceListParams): Promise<{
    success: boolean;
    data: BillInvoice[];
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
  }> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null) query.append(k, String(v));
      });
    }
    const qStr = query.toString();
    return this.client.request('GET', `bills/invoices${qStr ? '?' + qStr : ''}`);
  }

  /**
   * Alias for listInvoices
   */
  async getInvoices(params?: InvoiceListParams): Promise<any> {
    return this.listInvoices(params);
  }

  /**
   * Get a specific invoice by reference or PTN
   */
  async getInvoice(reference: string): Promise<{ success: boolean; invoice: BillInvoice }> {
    return this.client.request('GET', `bills/invoices/${reference}`);
  }

  /**
   * Get JSON receipt details
   */
  async getReceipt(reference: string): Promise<any> {
    return this.client.request('GET', `bills/receipt/${reference}`);
  }

  /**
   * Get direct URL to the printable HTML receipt
   */
  getReceiptRenderUrl(reference: string): string {
    return `${this.client.baseUrl}/${this.client.prefix}/bills/receipt/${reference}/render`;
  }

  /**
   * Get direct URL to the JSON receipt endpoint
   */
  getReceiptUrl(reference: string): string {
    return `${this.client.baseUrl}/${this.client.prefix}/bills/receipt/${reference}`;
  }

  /**
   * Get the project's receipt branding template
   */
  async getTemplate(): Promise<any> {
    return this.client.request('GET', 'bills/template');
  }

  /**
   * Update the project's receipt branding template
   */
  async updateTemplate(templateData: any): Promise<any> {
    return this.client.request('POST', 'bills/template', { body: templateData });
  }
}
