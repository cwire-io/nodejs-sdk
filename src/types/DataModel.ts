import { APIDataModelField } from './DataModelFields';

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
