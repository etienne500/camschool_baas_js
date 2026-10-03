import { BaasClient } from './client';
import {
  BaasDocument,
  QueryFilter,
  QueryOperator,
  BatchOperation,
  BaasJoinOptions,
  AggregationResult,
} from './types';

export class BaasDatabase {
  private client: BaasClient;

  constructor(client: BaasClient) {
    this.client = client;
  }

  public collection<T = Record<string, any>>(name: string): BaasCollectionReference<T> {
    return new BaasCollectionReference<T>(this.client, name);
  }

  public batch(): BaasWriteBatch {
    return new BaasWriteBatch(this.client);
  }
}

export class BaasQuery<T = Record<string, any>> {
  protected client: BaasClient;
  public collectionName: string;
  protected filters: QueryFilter[] = [];
  protected complexWhere: Record<string, any> | null = null;
  protected joins: BaasJoinOptions[] = [];
  protected expandPaths: string[] = [];
  protected selectFields: string[] = [];
  protected orderByField: string | null = null;
  protected orderDir: 'asc' | 'desc' = 'asc';
  protected limitCount?: number;
  protected pageNumber?: number;

  constructor(client: BaasClient, collectionName: string) {
    this.client = client;
    this.collectionName = collectionName;
  }

  public where(field: string, operator: QueryOperator, value: any): BaasQuery<T> {
    const q = this.clone();
    q.filters.push({ field, operator, value });
    return q;
  }

  /**
   * Add a deep recursive multi-table join definition (supports depth 10+).
   */
  public join(options: BaasJoinOptions): BaasQuery<T> {
    const q = this.clone();
    q.joins.push(options);
    return q;
  }

  /**
   * Expand/Populate relations using dot-notation string paths (e.g. 'author.company.country.region.continent').
   */
  public expand(paths: string | string[]): BaasQuery<T> {
    const q = this.clone();
    const arr = Array.isArray(paths) ? paths : [paths];
    q.expandPaths.push(...arr);
    return q;
  }

  /**
   * Alias for expand().
   */
  public populate(paths: string | string[]): BaasQuery<T> {
    return this.expand(paths);
  }

  /**
   * Select specific fields to return from the documents.
   */
  public select(fields: string | string[]): BaasQuery<T> {
    const q = this.clone();
    const arr = Array.isArray(fields) ? fields : [fields];
    q.selectFields.push(...arr);
    return q;
  }

  /**
   * Add an OR filter expression across multiple conditions.
   */
  public whereOr(conditions: Array<QueryFilter | Record<string, any>>): BaasQuery<T> {
    const q = this.clone();
    if (!q.complexWhere) q.complexWhere = {};
    if (!q.complexWhere['$or']) q.complexWhere['$or'] = [];
    q.complexWhere['$or'].push(...conditions);
    return q;
  }

  /**
   * Add an AND filter expression across multiple conditions.
   */
  public whereAnd(conditions: Array<QueryFilter | Record<string, any>>): BaasQuery<T> {
    const q = this.clone();
    if (!q.complexWhere) q.complexWhere = {};
    if (!q.complexWhere['$and']) q.complexWhere['$and'] = [];
    q.complexWhere['$and'].push(...conditions);
    return q;
  }

  /**
   * Pass a rich MongoDB/Firestore-like query tree ($and, $or, $nor, $regex, nested fields).
   */
  public whereComplex(tree: Record<string, any>): BaasQuery<T> {
    const q = this.clone();
    q.complexWhere = { ...(q.complexWhere || {}), ...tree };
    return q;
  }

  public orderBy(field: string, direction: 'asc' | 'desc' = 'asc'): BaasQuery<T> {
    const q = this.clone();
    q.orderByField = field;
    q.orderDir = direction;
    return q;
  }

  public limit(count: number): BaasQuery<T> {
    const q = this.clone();
    q.limitCount = count;
    return q;
  }

  public page(num: number): BaasQuery<T> {
    const q = this.clone();
    q.pageNumber = num;
    return q;
  }

  protected clone(): BaasQuery<T> {
    const copy = new BaasQuery<T>(this.client, this.collectionName);
    copy.filters = [...this.filters];
    copy.complexWhere = this.complexWhere ? JSON.parse(JSON.stringify(this.complexWhere)) : null;
    copy.joins = JSON.parse(JSON.stringify(this.joins));
    copy.expandPaths = [...this.expandPaths];
    copy.selectFields = [...this.selectFields];
    copy.orderByField = this.orderByField;
    copy.orderDir = this.orderDir;
    copy.limitCount = this.limitCount;
    copy.pageNumber = this.pageNumber;
    return copy;
  }

  /**
   * Execute the query and retrieve matching documents with hydrated multi-table joins.
   */
  public async get(): Promise<BaasDocument<T>[]> {
    const payload: Record<string, any> = {
      order_dir: this.orderDir,
    };

    if (this.filters.length > 0) payload.filters = this.filters;
    if (this.complexWhere) payload.where = this.complexWhere;
    if (this.joins.length > 0) payload.join = this.joins;
    if (this.expandPaths.length > 0) payload.expand = this.expandPaths.join(',');
    if (this.selectFields.length > 0) payload.select = this.selectFields.join(',');
    if (this.orderByField) payload.order_by = this.orderByField;
    if (this.limitCount !== undefined) payload.limit = this.limitCount;
    if (this.pageNumber !== undefined) payload.page = this.pageNumber;

    const res = await this.client.request(
      'POST',
      `collections/${this.collectionName}/query`,
      { body: payload }
    );

    const items: any[] = Array.isArray(res.data) ? res.data : [];
    return items.map((item) => {
      const docData = item.data !== undefined ? item.data : item;
      return {
        id: item.document_id || item.id,
        document_id: item.document_id || item.id,
        data: docData,
        created_at: item.created_at,
        updated_at: item.updated_at,
      };
    });
  }

  /**
   * Compute statistical aggregations ($sum, $avg, $min, $max, $count, $groupBy).
   */
  public async aggregate(
    aggregations: Record<string, string | Record<string, any>>,
    groupBy?: string
  ): Promise<AggregationResult> {
    const payload: Record<string, any> = {
      aggregate: aggregations,
    };
    if (groupBy) payload.groupBy = groupBy;
    if (this.filters.length > 0) payload.filters = this.filters;
    if (this.complexWhere) payload.where = this.complexWhere;

    const res = await this.client.request(
      'POST',
      `collections/${this.collectionName}/aggregate`,
      { body: payload }
    );

    return res.data || {};
  }

  /**
   * Count documents matching the current query filters.
   */
  public async count(): Promise<number> {
    const agg = await this.aggregate({ total: 'count:id' });
    return typeof agg.total === 'number' ? agg.total : (agg.count ?? 0);
  }
}

export class BaasCollectionReference<T = Record<string, any>> extends BaasQuery<T> {
  constructor(client: BaasClient, collectionName: string) {
    super(client, collectionName);
  }

  public doc(documentId?: string): BaasDocumentReference<T> {
    return new BaasDocumentReference<T>(this.client, this.collectionName, documentId);
  }

  public async add(data: T): Promise<BaasDocumentReference<T>> {
    const res = await this.client.request(
      'POST',
      `collections/${this.collectionName}/documents`,
      { body: { data } }
    );

    const docId = res.data?.document_id || res.data?.id;
    return this.doc(docId);
  }
}

export class BaasDocumentReference<T = Record<string, any>> {
  private client: BaasClient;
  public collectionName: string;
  public id: string;

  constructor(client: BaasClient, collectionName: string, documentId?: string) {
    this.client = client;
    this.collectionName = collectionName;
    this.id = documentId || '';
  }

  public async get(options?: { expand?: string | string[]; join?: BaasJoinOptions[] }): Promise<BaasDocument<T>> {
    if (!this.id) {
      throw new Error('Document ID is required for get().');
    }

    const queryParams: string[] = [];
    if (options?.expand) {
      const exp = Array.isArray(options.expand) ? options.expand.join(',') : options.expand;
      queryParams.push(`expand=${encodeURIComponent(exp)}`);
    }

    const queryStr = queryParams.length ? `?${queryParams.join('&')}` : '';

    const res = await this.client.request(
      'GET',
      `collections/${this.collectionName}/documents/${this.id}${queryStr}`
    );

    const item = res.data || {};
    return {
      id: item.document_id || item.id || this.id,
      document_id: item.document_id || item.id || this.id,
      data: item.data !== undefined ? item.data : item,
      created_at: item.created_at,
      updated_at: item.updated_at,
    };
  }

  public async set(data: Partial<T>, options: { merge?: boolean } = {}): Promise<void> {
    if (!this.id) {
      throw new Error('Document ID is required for set(). Use collection.add() for auto IDs.');
    }

    await this.client.request(
      'PUT',
      `collections/${this.collectionName}/documents/${this.id}`,
      {
        body: {
          data,
          merge: !!options.merge,
        },
      }
    );
  }

  public async update(data: Partial<T>): Promise<void> {
    if (!this.id) {
      throw new Error('Document ID is required for update().');
    }

    await this.client.request(
      'PATCH',
      `collections/${this.collectionName}/documents/${this.id}`,
      { body: data }
    );
  }

  public async delete(): Promise<boolean> {
    if (!this.id) {
      throw new Error('Document ID is required for delete().');
    }

    const res = await this.client.request(
      'DELETE',
      `collections/${this.collectionName}/documents/${this.id}`
    );
    return res.success === true;
  }
}

export class BaasWriteBatch {
  private client: BaasClient;
  private operations: BatchOperation[] = [];

  constructor(client: BaasClient) {
    this.client = client;
  }

  public set(
    doc: BaasDocumentReference<any>,
    data: Record<string, any>,
    options: { merge?: boolean } = {}
  ): this {
    this.operations.push({
      type: 'set',
      collection: doc.collectionName,
      document_id: doc.id,
      data,
      merge: !!options.merge,
    });
    return this;
  }

  public update(doc: BaasDocumentReference<any>, data: Record<string, any>): this {
    this.operations.push({
      type: 'update',
      collection: doc.collectionName,
      document_id: doc.id,
      data,
    });
    return this;
  }

  public delete(doc: BaasDocumentReference<any>): this {
    this.operations.push({
      type: 'delete',
      collection: doc.collectionName,
      document_id: doc.id,
    });
    return this;
  }

  public async commit(): Promise<any> {
    return await this.client.request('POST', 'batch', {
      body: { operations: this.operations },
    });
  }
}
