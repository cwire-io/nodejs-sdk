import { APIDataModelField } from './DataModelFields';
import { DataModel } from '../DataModel';
import { DATA_MODEL_ENTITY_EVENTS } from '../api/DataModelAPI';

export type DataModelReference = {
  field: string;
  model: string;
  modelField: string;
};

export type APIDataModel = {
  name: string;
  companyId: string;
  primaryKey: string;
  isEditable: boolean;
  isCreatable: boolean;
  route: string | null;
  isWorkerModel: boolean;
  fields: APIDataModelField[];
  references: DataModelReference[];
};

export type APIEntityEvent = {
  icon: string;
  type: string;
  color: string;
  entityId: string;
  modelName: string;
  description: string;
  after: Record<any, any> | null;
  before: Record<any, any> | null;
};

export type EntityEventOptions = {
  icon: string;
  color: string;
  description: string;
  after: Record<any, any> | null;
  before: Record<any, any> | null;
};
