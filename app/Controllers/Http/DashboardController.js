"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Shipment_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Shipment"));
const FunctionsController_1 = __importDefault(require("./Methods/FunctionsController"));
const MethodsController_1 = __importDefault(require("./Methods/MethodsController"));
class DashboardController {
    async index({ view }) {
        let allShipments = await Shipment_1.default.query().preload('consignment').preload('tracking');
        const Func = new FunctionsController_1.default();
        const Met = new MethodsController_1.default();
        const dashboard = await Met.dashboard();
        let data = [];
        for (let i = 0; i < allShipments.length; i++) {
            const dt = allShipments[i];
            const pusher = {
                id: dt.id,
                consignment_name: dt.consignment.$attributes.name,
                tracking_code: dt.trackingId,
                from: dt.$attributes.from,
                to: dt.$attributes.to,
                status: dt.$attributes.status,
                date_of_order: await Func.formatDate(dt.$attributes.date_of_order.ts, 'DD-MM-YYYY'),
                expected_date: await Func.formatDate(dt.$attributes.expected_date.ts, 'DD-MM-YYYY'),
                created_at: await Func.formatDate(dt.$attributes.createdAt, 'DD-MM-YYYY'),
                updated_at: await Func.formatDate(dt.$attributes.updatedAt, 'DD-MM-YYYY'),
            };
            data.push(pusher);
        }
        const allShip = data;
        return view.render('dashboard/index', { allShip, dashboard });
    }
}
exports.default = DashboardController;
//# sourceMappingURL=DashboardController.js.map