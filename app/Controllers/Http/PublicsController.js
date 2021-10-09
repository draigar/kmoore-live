"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MethodsController_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Controllers/Http/Methods/MethodsController"));
class PublicsController {
    async index({ view }) {
        return view.render('welcome');
    }
    async tracking({ view }) {
        return view.render('tracking');
    }
    async getTracker({ request, response, session }) {
        const code = request.input('track');
        if (code) {
            const Met = new MethodsController_1.default();
            await Met.track(code, response, session);
        }
        return response.redirect().toRoute('tracking');
    }
    async contact({ view }) {
        return view.render('contact');
    }
}
exports.default = PublicsController;
//# sourceMappingURL=PublicsController.js.map