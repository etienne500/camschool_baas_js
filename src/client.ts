import { BaasConfig } from './types';
import { BaasAuth } from './auth';
import { BaasDatabase, BaasCollectionReference } from './database';
import { BaasStorage } from './storage';
import { BaasNotifications } from './notifications';
import {
  BaasError,
  BaasAuthError,
  BaasPermissionError,
  BaasNotFoundError,
  BaasQuotaError,
} from './errors';

export class BaasClient {
  public baseUrl: string;
  public projectId: string;
  public apiKey: string;
  public prefix: string;
  private authToken: string | null = null;
  private storageKey: string;

  public auth: BaasAuth;
  public database: BaasDatabase;
  public storage: BaasStorage;
  public notifications: BaasNotifications;

  constructor(config: BaasConfig) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, '');
    this.projectId = config.projectId;
    this.apiKey = config.apiKey;
    this.prefix = config.prefix || 'api/baas/v1';
    this.storageKey = config.storageKey || `camschool_baas_token_${this.projectId}`;

    // Initialize submodules
    this.auth = new BaasAuth(this);
    this.database = new BaasDatabase(this);
    this.storage = new BaasStorage(this);
    this.notifications = new BaasNotifications(this);

    // Auto-restore session from localStorage if in browser environment
    if (config.autoRestoreSession !== false && typeof window !== 'undefined' && window.localStorage) {
      const savedToken = window.localStorage.getItem(this.storageKey);
      if (savedToken) {
        this.authToken = savedToken;
      }
    }
  }

  public getAuthToken(): string | null {
    return this.authToken;
  }

  public setAuthToken(token: string | null): void {
    this.authToken = token;
    if (typeof window !== 'undefined' && window.localStorage) {
      if (token) {
        window.localStorage.setItem(this.storageKey, token);
      } else {
        window.localStorage.removeItem(this.storageKey);
      }
    }
  }

  public buildUrl(endpoint: string): string {
    const cleanEndpoint = endpoint.replace(/^\/+/, '');
    return `${this.baseUrl}/${this.prefix}/${this.projectId}/${cleanEndpoint}`;
  }

  public getHeaders(customHeaders: Record<string, string> = {}): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-API-Key': this.apiKey,
      'X-Project-ID': this.projectId,
      ...customHeaders,
    };
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }
    return headers;
  }

  public async request<T = any>(
    method: string,
    endpoint: string,
    options: {
      body?: any;
      headers?: Record<string, string>;
    } = {}
  ): Promise<T> {
    const url = this.buildUrl(endpoint);
    const headers = this.getHeaders(options.headers);

    const init: RequestInit = {
      method: method.toUpperCase(),
      headers,
    };

    if (options.body !== undefined) {
      init.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
    }

    let response: Response;
    try {
      response = await fetch(url, init);
    } catch (err: any) {
      throw new BaasError(`Network error: ${err?.message || 'Failed to fetch'}`);
    }

    let json: any;
    try {
      json = await response.json();
    } catch {
      json = { message: await response.text() };
    }

    if (response.ok) {
      return json;
    }

    const message = json?.message || `Request failed with status ${response.status}`;

    switch (response.status) {
      case 401:
        throw new BaasAuthError(message, 401, json);
      case 403:
        throw new BaasPermissionError(message, 403, json);
      case 404:
        throw new BaasNotFoundError(message, 404, json);
      case 429:
        throw new BaasQuotaError(message, 429, json);
      default:
        throw new BaasError(message, response.status, json);
    }
  }

  public collection<T = Record<string, any>>(name: string): BaasCollectionReference<T> {
    return this.database.collection<T>(name);
  }
}
