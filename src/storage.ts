import { BaasClient } from './client';
import { BaasFileMetadata } from './types';
import { BaasError } from './errors';

export class BaasStorage {
  private client: BaasClient;

  constructor(client: BaasClient) {
    this.client = client;
  }

  public async upload(
    path: string,
    file: Blob | File | any,
    options: {
      filename?: string;
      isPublic?: boolean;
    } = {}
  ): Promise<BaasFileMetadata> {
    const formData = new FormData();
    formData.append('path', path);
    formData.append('visibility', options.isPublic === false ? 'private' : 'public');

    if (options.filename) {
      formData.append('file', file, options.filename);
    } else {
      formData.append('file', file);
    }

    const url = this.client.buildUrl('storage/upload');
    const headers: Record<string, string> = {
      'X-API-Key': this.client.apiKey,
      'X-Project-ID': this.client.projectId,
      Accept: 'application/json',
    };

    const token = this.client.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    let response: Response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });
    } catch (err: any) {
      throw new BaasError(`File upload network error: ${err?.message}`);
    }

    const json = await response.json();
    if (!response.ok) {
      throw new BaasError(json?.message || 'Storage upload failed', response.status, json);
    }

    return json.data;
  }

  public async listFiles(path?: string, limit = 50): Promise<BaasFileMetadata[]> {
    const res = await this.client.request('GET', 'storage/files');
    return Array.isArray(res.data) ? res.data : [];
  }

  public async getSignedUrl(path: string, expiresInMinutes = 60): Promise<string> {
    const res = await this.client.request('POST', 'storage/signed-url', {
      body: {
        path,
        expires_in: expiresInMinutes,
      },
    });
    return res.data?.signed_url || res.data?.url || '';
  }

  public async deleteFile(path: string): Promise<boolean> {
    const res = await this.client.request('DELETE', 'storage/files', {
      body: { path },
    });
    return res.success === true;
  }
}
