import { BaasClient } from './client';

export class BaasNotifications {
  private client: BaasClient;

  constructor(client: BaasClient) {
    this.client = client;
  }

  public async registerDeviceToken(
    token: string,
    platform: 'web' | 'android' | 'ios' = 'web',
    topics: string[] = []
  ): Promise<void> {
    await this.client.request('POST', 'notifications/devices', {
      body: {
        token,
        platform,
        topics,
      },
    });
  }

  public async send(params: {
    userId?: string;
    topic?: string;
    title: string;
    body: string;
    data?: Record<string, any>;
  }): Promise<{ success: boolean; data?: any }> {
    const res = await this.client.request('POST', 'notifications/send', {
      body: {
        user_id: params.userId,
        topic: params.topic,
        title: params.title,
        body: params.body,
        data: params.data || {},
      },
    });
    return res.data ? { success: true, data: res.data } : { success: true };
  }
}
