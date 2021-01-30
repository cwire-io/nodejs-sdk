"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataModel_1 = require("../../DataModel");
const DataModelField_1 = require("../../DataModelField");
const errors_1 = require("../../errors");
const parser_1 = require("./parser");
const MongooseDataModelORM_1 = require("./MongooseDataModelORM");
class MongooseDataModel extends DataModel_1.DataModel {
    constructor(model) {
        if (!model.modelName) {
            throw new errors_1.MissingRequiredPropertyError();
        }
        super(model.modelName, {});
        this.model = model;
        this.primaryKey = '_id';
        this.orm = new MongooseDataModelORM_1.MongooseDataModelORM(model, this);
        for (const fieldName of Object.keys(this.model.schema.paths)) {
            const field = this.model.schema.paths[fieldName];
            const dataType = parser_1.parseMongooseSchemaToCWireDataType(field);
            if (dataType !== null) {
                this.fields[fieldName] = new DataModelField_1.DataModelField(fieldName, {
                    type: dataType,
                    isPrimary: fieldName === '_id',
                });
            }
        }
    }
}
exports.default = MongooseDataModel;
//# sourceMappingURL=MongooseDataModel.js.map