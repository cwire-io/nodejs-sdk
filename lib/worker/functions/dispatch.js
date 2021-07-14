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
exports.Dispatch = void 0;
const WorkerFunction_1 = require("../WorkerFunction");
class Dispatch extends WorkerFunction_1.WorkerFunction {
    controller(clientId, modelName, action, entityIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.cwire.getDataModelByName(modelName);
            if (!model) {
                return { success: false };
            }
            const modelAction = model.getActionByName(action);
            if (!modelAction) {
                return { success: false };
            }
            const options = { clientId };
            switch (modelAction.getType()) {
                case 'none': {
                    yield modelAction.callHandler(options);
                    break;
                }
                case 'one': {
                    yield modelAction.callHandler(entityIds[0], options);
                    break;
                }
                case 'multiple': {
                    yield modelAction.callHandler(entityIds, options);
                    break;
                }
                default: {
                    return { success: false };
                }
            }
            return { success: true };
        });
    }
    getName() {
        return 'DATA_MODEL::DISPATCH_ACTION';
    }
    getParameters() {
        return [
            {
                name: 'clientId',
                type: 'string',
                isRequired: true,
            },
            {
                type: 'option',
                options: this.cwire.getDataModelsList().map((model) => model.getName()),
                name: 'modelName',
                isRequired: true,
            },
            {
                type: 'option',
                name: 'action',
                isRequired: true,
                options: this.cwire
                    .getDataModelsList()
                    .map((model) => model.getActionsList().map((action) => action.getName()))
                    .reduce((current, actions) => [...current, ...actions], []),
            },
            {
                name: 'entityIds',
                type: 'values',
                isRequired: false,
            },
        ];
    }
}
exports.Dispatch = Dispatch;
//# sourceMappingURL=dispatch.js.map