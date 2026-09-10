import { BaasClient } from './client';
import {
  SendSmsOptions,
  SendSmsResult,
  SendEmailOptions,
  SendEmailResult,
} from './types';

/**
 * SMS Module for CamSchool BaaS
 * Price: 25 FCFA / SMS
 */
export class BaasSms {
  private client: BaasClient;

  constructor(client: BaasClient) {
    this.client = client;
  }

  /**
   * Send single or multiple SMS messages.
   * Billing: 25 FCFA per SMS.
   *
   * @example
   * ```typescript
   * const result = await baas.sms.send({
   *   to: '+237655797860',
   *   message: 'Votre commande #1234 a été expédiée !',
   *   senderId: 'CamSchool',
   * });
   * console.log('Coût total :', result.total_cost, result.currency);
   * ```
   */
  public async send(
    toOrOptions: string | string[] | SendSmsOptions,
    message?: string,
    options?: { senderId?: string; [key: string]: any }
  ): Promise<SendSmsResult> {
    let payload: Record<string, any> = {};

    if (typeof toOrOptions === 'object' && !Array.isArray(toOrOptions)) {
      payload = {
        to: toOrOptions.to || toOrOptions.recipients || toOrOptions.phone,
        message: toOrOptions.message || toOrOptions.body || toOrOptions.text,
        sender_id: toOrOptions.senderId || toOrOptions.sender_id,
        options: toOrOptions.options,
      };
    } else {
      payload = {
        to: toOrOptions,
        message: message,
        sender_id: options?.senderId,
        options: options,
      };
    }

    const res = await this.client.request<{ success: boolean; data: SendSmsResult }>(
      'POST',
      'sms/send',
      { body: payload }
    );

    return res.data || (res as any);
  }

  /**
   * Send bulk SMS messages to multiple recipients.
   * Billing: 25 FCFA * number of recipients.
   */
  public async sendBulk(
    recipients: string[],
    message: string,
    options?: { senderId?: string; [key: string]: any }
  ): Promise<SendSmsResult> {
    return this.send(recipients, message, options);
  }

  /**
   * Get SMS logs / history.
   */
  public async getLogs(params?: { limit?: number; page?: number }): Promise<any> {
    const query = new URLSearchParams();
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.page) query.set('page', String(params.page));
    const endpoint = `sms/logs${query.toString() ? '?' + query.toString() : ''}`;
    return this.client.request('GET', endpoint);
  }
}

/**
 * Email Module for CamSchool BaaS
 */
export class BaasMail {
  private client: BaasClient;

  constructor(client: BaasClient) {
    this.client = client;
  }

  /**
   * Send a transactional or notification email.
   *
   * @example
   * ```typescript
   * const result = await baas.mail.send({
   *   to: 'client@example.com',
   *   subject: 'Confirmation de commande',
   *   html: '<h1>Merci pour votre achat !</h1><p>Détails...</p>',
   *   fromName: 'Boutique CamSchool',
   * });
   * ```
   */
  public async send(
    toOrOptions: string | string[] | SendEmailOptions,
    subject?: string,
    bodyOrHtml?: string,
    options?: {
      isHtml?: boolean;
      fromName?: string;
      fromEmail?: string;
      replyTo?: string;
      cc?: string | string[];
      bcc?: string | string[];
    }
  ): Promise<SendEmailResult> {
    let payload: Record<string, any> = {};

    if (typeof toOrOptions === 'object' && !Array.isArray(toOrOptions)) {
      payload = {
        to: toOrOptions.to || toOrOptions.recipients || toOrOptions.email,
        subject: toOrOptions.subject,
        body: toOrOptions.body || toOrOptions.content || toOrOptions.message,
        html: toOrOptions.html,
        from_name: toOrOptions.fromName || toOrOptions.from_name,
        from_email: toOrOptions.fromEmail || toOrOptions.from_email,
        reply_to: toOrOptions.replyTo || toOrOptions.reply_to,
        cc: toOrOptions.cc,
        bcc: toOrOptions.bcc,
      };
    } else {
      payload = {
        to: toOrOptions,
        subject: subject,
        body: options?.isHtml ? undefined : bodyOrHtml,
        html: options?.isHtml ? bodyOrHtml : undefined,
        from_name: options?.fromName,
        from_email: options?.fromEmail,
        reply_to: options?.replyTo,
        cc: options?.cc,
        bcc: options?.bcc,
      };
    }

    const res = await this.client.request<{ success: boolean; data: SendEmailResult }>(
      'POST',
      'mail/send',
      { body: payload }
    );

    return res.data || (res as any);
  }

  /**
   * Get Email logs / history.
   */
  public async getLogs(params?: { limit?: number; page?: number }): Promise<any> {
    const query = new URLSearchParams();
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.page) query.set('page', String(params.page));
    const endpoint = `mail/logs${query.toString() ? '?' + query.toString() : ''}`;
    return this.client.request('GET', endpoint);
  }
}

/**
 * Unified Messaging Module (SMS & Emails)
 */
export class BaasMessaging {
  public sms: BaasSms;
  public mail: BaasMail;

  constructor(client: BaasClient) {
    this.sms = new BaasSms(client);
    this.mail = new BaasMail(client);
  }

  public async sendSms(
    to: string | string[] | SendSmsOptions,
    message?: string,
    options?: { senderId?: string }
  ): Promise<SendSmsResult> {
    return this.sms.send(to, message, options);
  }

  public async sendEmail(
    to: string | string[] | SendEmailOptions,
    subject?: string,
    bodyOrHtml?: string,
    options?: any
  ): Promise<SendEmailResult> {
    return this.mail.send(to, subject, bodyOrHtml, options);
  }
}
