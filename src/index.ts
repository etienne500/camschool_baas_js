import { BaasClient } from './client';
import { BaasConfig } from './types';

/**
 * Initialize a new CamSchool BaaS Client instance.
 */
export function createClient(config: BaasConfig): BaasClient {
  return new BaasClient(config);
}

export { BaasClient };
export * from './types';
export * from './errors';
export * from './auth';
export * from './database';
export * from './storage';
export * from './notifications';

export default createClient;
