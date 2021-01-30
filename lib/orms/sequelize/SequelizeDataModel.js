"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataModel_1 = require("../../DataModel");
const DataModelField_1 = require("../../DataModelField");
const parser_1 = require("./parser");
class SequelizeDataModel extends DataModel_1.DataModel {
    constructor(model) {
        super(model.getTableName(), {
            type: 'Sequelize',
        });
        this.model = model;
        for (const sequelizeField of Object.values(this.model.rawAttributes)) {
            if (sequelizeField.field) {
                if (sequelizeField.primaryKey) {
                    this.primaryKey = sequelizeField.field;
                }
                const fieldOptions = {
                    isPrimary: sequelizeField.primaryKey,
                    type: parser_1.parseSequelizeDataTypeToCWireDataType(sequelizeField.type),
                };
                this.fields[sequelizeField.field] = new DataModelField_1.DataModelField(sequelizeField.field, fieldOptions);
            }
        }
    }
}
exports.default = SequelizeDataModel;
//# sourceMappingURL=SequelizeDataModel.js.map