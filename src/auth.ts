import { BaasClient } from './client';
import { BaasUser, BaasAuthResponse } from './types';

export class BaasAuth {
  private client: BaasClient;
  private currentUser: BaasUser | null = null;
  private listeners: Array<(user: BaasUser | null) => void> = [];

  constructor(client: BaasClient) {
    this.client = client;
  }

  public getCurrentUser(): BaasUser | null {
    return this.currentUser;
  }

  public isAuthenticated(): boolean {
    return !!this.client.getAuthToken();
  }

  public onAuthStateChange(callback: (user: BaasUser | null) => void): () => void {
    this.listeners.push(callback);
    callback(this.currentUser);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      try {
        listener(this.currentUser);
      } catch (err) {
        console.error('Error in onAuthStateChange listener:', err);
      }
    }
  }

  public async signUpWithEmail(
    email: string,
    password: string,
    displayName?: string,
    metadata?: Record<string, any>
  ): Promise<BaasAuthResponse> {
    const res = await this.client.request('POST', 'auth/register', {
      body: {
        email,
        password,
        display_name: displayName,
        metadata,
      },
    });

    const data = res.data || {};
    if (data.token) {
      this.client.setAuthToken(data.token);
    }

    this.currentUser = data.user || data;
    this.notifyListeners();
    return data;
  }

  public async signInWithEmail(email: string, password: string): Promise<BaasAuthResponse> {
    const res = await this.client.request('POST', 'auth/login', {
      body: { email, password },
    });

    const data = res.data || {};
    if (data.token) {
      this.client.setAuthToken(data.token);
    }

    this.currentUser = data.user || data;
    this.notifyListeners();
    return data;
  }

    public async signUpWithPhone(
    phoneNumber: string,
    password: string,
    displayName?: string,
    metadata?: Record<string, any>
  ): Promise<BaasAuthResponse> {
    const res = await this.client.request('POST', 'auth/phone/register', {
      body: {
        phone_number: phoneNumber,
        password,
        display_name: displayName,
        metadata,
      },
    });

    const data = res.data || {};
    if (data.token) {
      this.client.setAuthToken(data.token);
    }

    this.currentUser = data.user || data;
    this.notifyListeners();
    return data;
  }

  public async signInWithPhone(phoneNumber: string, password: string): Promise<BaasAuthResponse> {
    const res = await this.client.request('POST', 'auth/phone/login', {
      body: {
        phone_number: phoneNumber,
        password,
      },
    });

    const data = res.data || {};
    if (data.token) {
      this.client.setAuthToken(data.token);
    }

    this.currentUser = data.user || data;
    this.notifyListeners();
    return data;
  }

  public async sendPhoneOtp(phoneNumber: string): Promise<{ otp_token: string; message: string }> {
    const res = await this.client.request('POST', 'auth/otp/send', {
      body: { phone_number: phoneNumber },
    });
    return res.data || { message: res.message };
  }

  public async verifyPhoneOtp(
    phoneNumber: string,
    code: string,
    token: string
  ): Promise<BaasAuthResponse> {
    const res = await this.client.request('POST', 'auth/otp/verify', {
      body: {
        phone_number: phoneNumber,
        code,
        token,
      },
    });

    const data = res.data || {};
    if (data.token) {
      this.client.setAuthToken(data.token);
    }

    this.currentUser = data.user || data;
    this.notifyListeners();
    return data;
  }

  public async signInAnonymously(deviceId?: string): Promise<BaasAuthResponse> {
    const res = await this.client.request('POST', 'auth/anonymous', {
      body: { device_id: deviceId },
    });

    const data = res.data || {};
    if (data.token) {
      this.client.setAuthToken(data.token);
    }

    this.currentUser = data.user || data;
    this.notifyListeners();
    return data;
  }

  public async refreshToken(refreshToken?: string): Promise<string> {
    const res = await this.client.request('POST', 'auth/refresh', {
      body: { refresh_token: refreshToken },
    });

    const data = res.data || {};
    const token = data.token;
    if (token) {
      this.client.setAuthToken(token);
    }
    return token;
  }

  public async getProfile(): Promise<BaasUser> {
    const res = await this.client.request('GET', 'auth/me');
    this.currentUser = res.data;
    this.notifyListeners();
    return res.data;
  }

  public signOut(): void {
    this.client.setAuthToken(null);
    this.currentUser = null;
    this.notifyListeners();
  }
}
