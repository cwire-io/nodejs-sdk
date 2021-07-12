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
exports.FrontendClient = exports.CWireFrontendClient = void 0;
const errors_1 = require("./errors");
const CWire_1 = require("./CWire");
class CWireFrontendClient {
    static openLink(clientId, url, options = { type: 'current' }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield CWire_1.CWire.getInstance().getAPI().getAxios().post('/frontend-client/actions/openLink', Object.assign(Object.assign({}, options), { url,
                    clientId }));
                return true;
            }
            catch (error) {
                return false;
            }
        });
    }
    static showNotification(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new errors_1.FeatureIsNotImplementedNowError();
        });
    }
}
exports.CWireFrontendClient = CWireFrontendClient;
class FrontendClient extends CWireFrontendClient {
}
exports.FrontendClient = FrontendClient;
//# sourceMappingURL=CWireFrontendClient.js.map