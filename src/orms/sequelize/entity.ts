import { Model } from 'sequelize';

import { DataModelField } from '../../DataModelField';

export function buildEntitiesResponse(
  fields: DataModelField[],
  entities: Model<any, any>[],
) {
  const responseEntities: any[string] = [];
  for (const entity of entities) {
    const responseEntity: any = {};
    for (const field of fields) {
      responseEntity[field.getName()] = entity.get(field.getName());
    }
    responseEntities.push(responseEntity);
  }

  return responseEntities;
}
