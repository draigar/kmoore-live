"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MethodsController_1 = __importDefault(require("./Methods/MethodsController"));
class TrackingsController {
    async index({ view, params, session, response }) {
        const code = params.code;
        const Met = new MethodsController_1.default();
        const dashboard = await Met.dashboard();
        if (code) {
            await Met.track(code, response, session);
        }
        return view.render('dashboard/tracking/index', { dashboard });
    }
    async trackShipments({ request, response, session }) {
        const code = request.input('code');
        const Met = new MethodsController_1.default();
        await Met.track(code, response, session);
    }
    async create({}) { }
    async store({}) { }
    async show({}) { }
    async edit({}) { }
    async update({}) { }
    async destroy({}) { }
}
exports.default = TrackingsController;
//# sourceMappingURL=TrackingsController.js.map