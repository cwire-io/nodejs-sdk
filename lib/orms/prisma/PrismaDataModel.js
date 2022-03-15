"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaType = void 0;
const DataModelField_1 = require("../../DataModelField");
const errors_1 = require("../../errors");
const DataModel_1 = require("../../types/DataModel");
const DataModel_2 = require("../../DataModel");
const query_1 = require("./query");
const entity_1 = require("./entity");
const field_1 = require("./field");
exports.PrismaType = 'Prisma';
class PrismaDataModel extends DataModel_2.DataModel {
    constructor(model, prisma, options) {
        super(model.name, options);
        this.model = model;
        this.prisma = prisma;
        for (const field of model.fields) {
            if (field.relationFromFields) {
                continue;
            }
            this.fields[field.name] = new DataModelField_1.DataModelField(field.name, Object.assign({ type: field_1.parsePrismaDataTypeToCWireDataType(field.type), isPrimary: field.isId, isUnique: field.isUnique, isReadonly: field.isReadonly, isNullable: field.hasDefaultValue && field.default === null }, (field.hasDefaultValue ? { defaultValue: field.default } : {})));
        }
        if (model.primaryKey && model.primaryKey.fields) {
            for (const fieldName of model.primaryKey.fields) {
                if (this.fields[fieldName]) {
                    this.fields[fieldName].setPrimaryField(true);
                }
            }
        }
    }
    static getPrismaSettings(prisma) {
        return prisma._dmmf;
    }
    static parse(prisma, options) {
        if (options.blacklist && options.whitelist) {
            throw new errors_1.DuplicatedOptionsParsedError();
        }
        let { datamodel: { models }, } = PrismaDataModel.getPrismaSettings(prisma);
        if (options.whitelist) {
            models = models.filter((model) => (options.whitelist || []).includes(model.name));
        }
        if (options.blacklist) {
            models = models.filter((model) => !(options.blacklist || []).includes(model.name));
        }
        return models.map((model) => new PrismaDataModel(model, prisma, options));
    }
    constructReferences(cwire, nativeModels) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const field of this.model.fields) {
                if (!field.relationFromFields) {
                    continue;
                }
                for (const index in field.relationFromFields) {
                    const fieldName = field.relationFromFields[index];
                    if (this.getFieldByName(fieldName)) {
                        this.getFieldByName(fieldName).setReference({
                            type: 'one',
                            model: field.type,
                            field: field.relationToFields[index],
                        });
                    }
                }
            }
        });
    }
    getName() {
        return this.model.name;
    }
    getType() {
        return exports.PrismaType;
    }
    getPrismaModelName() {
        return this.getName().charAt(0).toLowerCase() + this.getName().slice(1);
    }
    count(cwire, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _count: { _all: result }, } = yield this.prisma[this.getPrismaModelName()].aggregate(Object.assign(Object.assign({}, query_1.parseQueryToPrisma(this, query)), { _count: { _all: true } }));
            return result;
        });
    }
    create(cwire, values) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.prisma[this.getPrismaModelName()].create({
                data: values,
            });
            return entity_1.buildEntitiesResponse(this.getFieldsList(), [result]);
        });
    }
    findAll(cwire, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield this.prisma[this.getPrismaModelName()].findMany(query_1.parseQueryToPrisma(this, query));
            return entity_1.buildEntitiesResponse(this.getFieldsList(), results);
        });
    }
    findOne(cwire, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.prisma[this.getPrismaModelName()].findFirst(query_1.parseQueryToPrisma(this, query));
            return entity_1.buildEntitiesResponse(this.getFieldsList(), [result]);
        });
    }
    remove(cwire, query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma[this.getPrismaModelName()].deleteMany(query_1.parseQueryToPrisma(this, query));
        });
    }
    update(cwire, query, changes) {
        return __awaiter(this, void 0, void 0, function* () {
            const { count } = yield this.prisma[this.getPrismaModelName()].updateMany(Object.assign(Object.assign({}, query_1.parseQueryToPrisma(this, query)), { data: changes }));
            if (count === 0) {
                return [];
            }
            return this.findAll(cwire, query);
        });
    }
    calculate(cwire, calcFn, fieldName, query) {
        return __awaiter(this, void 0, void 0, function* () {
            let calculationKey;
            switch (calcFn) {
                case DataModel_1.DataModelCalculationFunctions.AVG: {
                    calculationKey = '_avg';
                    break;
                }
                case DataModel_1.DataModelCalculationFunctions.MAX: {
                    calculationKey = '_max';
                    break;
                }
                case DataModel_1.DataModelCalculationFunctions.MIN: {
                    calculationKey = '_min';
                    break;
                }
                case DataModel_1.DataModelCalculationFunctions.SUM: {
                    calculationKey = '_sum';
                    break;
                }
            }
            if (query.group) {
                const results = yield this.prisma[this.getPrismaModelName()].groupBy(Object.assign(Object.assign({}, query_1.parseQueryToPrisma(this, query)), { by: query.group, [calculationKey]: {
                        [fieldName]: true,
                    } }));
                return results.map((result) => ({
                    value: result[calculationKey][fieldName],
                    [query.group[0]]: result[query.group[0]],
                }));
            }
            const result = yield this.prisma[this.getPrismaModelName()].aggregate(Object.assign(Object.assign({}, query_1.parseQueryToPrisma(this, query)), { [calculationKey]: {
                    [fieldName]: true,
                } }));
            return result[calculationKey][fieldName];
        });
    }
}
exports.default = PrismaDataModel;
//# sourceMappingURL=PrismaDataModel.js.map