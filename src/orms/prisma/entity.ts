import { Model } from 'sequelize';

import { DataModelField } from '../../DataModelField';

export function buildEntitiesResponse(
  fields: DataModelField[],
  entities: any[],
) {
  const responseEntities: any[string] = [];
  for (const entity of entities) {
    const responseEntity: any = {};
    for (const field of fields) {
      responseEntity[field.getName()] = entity[field.getName()];
    }
    responseEntities.push(responseEntity);
  }

  return responseEntities;
}
