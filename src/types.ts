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
  | '<>'
  | '>'
  | '>='
  | '<'
  | '<='
  | 'in'
  | 'not_in'
  | 'contains'
  | 'array_contains'
  | 'array_contains_any'
  | 'array_contains_all'
  | 'starts_with'
  | 'ends_with'
  | 'like'
  | 'ilike'
  | 'regex'
  | 'between'
  | 'not_between'
  | 'is_null'
  | 'exists';

export interface QueryFilter {
  field: string;
  operator: QueryOperator;
  value: any;
}

export interface BaasJoinOptions {
  collection: string;
  localField?: string;
  foreignField?: string;
  as?: string;
  single?: boolean;
  type?: 'left' | 'inner';
  select?: string[];
  where?: QueryFilter[] | Record<string, any>;
  orderBy?: string;
  limit?: number;
  join?: BaasJoinOptions[];
}

export interface AggregationResult {
  count?: number;
  group_by?: string;
  groups?: Array<Record<string, any>>;
  [key: string]: any;
}

export interface QueryOptions {
  filters?: QueryFilter[];
  where?: Record<string, any> | QueryFilter[];
  order_by?: string | null;
  order_dir?: 'asc' | 'desc';
  limit?: number;
  page?: number;
  expand?: string | string[];
  join?: BaasJoinOptions[];
  select?: string | string[];
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

export interface SendSmsOptions {
  to?: string | string[];
  phone?: string | string[];
  recipients?: string | string[];
  message?: string;
  body?: string;
  text?: string;
  senderId?: string;
  sender_id?: string;
  options?: Record<string, any>;
}

export interface SmsSendDetail {
  to: string;
  status: 'sent' | 'failed';
  message_id?: string | null;
  cost: number;
  error?: string | null;
}

export interface SendSmsResult {
  success: boolean;
  count: number;
  sent_count: number;
  failed_count: number;
  price_per_sms: number;
  total_cost: number;
  currency: string;
  details: SmsSendDetail[];
}

export interface SendEmailOptions {
  to?: string | string[];
  email?: string | string[];
  recipients?: string | string[];
  subject: string;
  body?: string;
  html?: string;
  content?: string;
  message?: string;
  fromName?: string;
  from_name?: string;
  fromEmail?: string;
  from_email?: string;
  replyTo?: string;
  reply_to?: string;
  cc?: string | string[];
  bcc?: string | string[];
}

export interface EmailSendDetail {
  to: string;
  status: 'sent' | 'failed';
  error?: string | null;
}

export interface SendEmailResult {
  success: boolean;
  count: number;
  sent_count: number;
  failed_count: number;
  subject: string;
  details: EmailSendDetail[];
}
