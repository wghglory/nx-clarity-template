import { RDEEntityState } from '@seed/shared/models';

export interface Product extends RDEEntityState {
  id: string;
  name: string;
  productionDate: string;
  description: string;
}
