import { RDEEntityState } from '@seed/rde';

export interface Product extends RDEEntityState {
  id: string;
  name: string;
  productionDate: string;
  description: string;
}
