export interface VcdList<T> {
  resultTotal: number;
  pageCount: number;
  page: number;
  pageSize: number;
  associations: any;
  values: T[];
}

export interface RDEList<T extends RDEEntityState> {
  resultTotal: number;
  pageCount: number;
  page: number;
  pageSize: number;
  associations: any;
  values: RDEValue<T>[];
}

export interface RDEValue<T extends RDEEntityState> {
  id: string;
  entityType: string;
  name: string;
  externalId: string | null;
  entity: T;
  // RDE state
  state: 'RESOLVED' | 'RESOLUTION_ERROR' | 'PRE_CREATED';
  owner: {
    name: string;
    id: string;
  };
  org: {
    name: string;
    id: string;
  };
}

export interface RDEEntityState {
  // our BE defined state and error message
  state: 'success' | 'error';
  state_reason: string; // only when state is 'error'
}
