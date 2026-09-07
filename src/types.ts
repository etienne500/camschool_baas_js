export interface BaasConfig {
  baseUrl: string;
  projectId: string;
  apiKey: string;
  prefix?: string;
  storageKey?: string;
  autoRestoreSession?: boolean;
}

export interface BaasUser {
  id: string;
  email?: string;
  phoneNumber?: string;
  displayName?: string;
  avatarUrl?: string;
  isAnonymous?: boolean;
  metadata?: Record<string, any>;
  createdAt?: string;
}

export interface BaasAuthResponse {
  token: string;
  user: BaasUser;
  expires_at?: string;
}

export interface BaasDocument<T = Record<string, any>> {
  id: string;
  document_id?: string;
  data: T;
  created_at?: string;
  updated_at?: string;
}

export type QueryOperator =
  | '=='
  | '='
  | '!='
  | '>'
  | '>='
  | '<'
  | '<='
  | 'in'
  | 'not_in'
  | 'contains'
  | 'array_contains';

export interface QueryFilter {
  field: string;
  operator: QueryOperator;
  value: any;
}

export interface QueryOptions {
  filters?: QueryFilter[];
  order_by?: string | null;
  order_dir?: 'asc' | 'desc';
  limit?: number;
  page?: number;
}

export interface BaasFileMetadata {
  id: string;
  path: string;
  filename: string;
  url: string;
  size: number;
  mime_type?: string;
  created_at?: string;
}

export interface BatchOperation {
  type: 'set' | 'update' | 'delete';
  collection: string;
  document_id: string;
  data?: Record<string, any>;
  merge?: boolean;
}
