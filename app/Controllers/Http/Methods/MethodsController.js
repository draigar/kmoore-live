"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const CollectedShipment_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/CollectedShipment"));
const Consignment_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Consignment"));
const Consignor_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Consignor"));
const Shipment_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Shipment"));
const Tracking_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Tracking"));
const FunctionsController_1 = __importDefault(require("./FunctionsController"));
class MethodsController {
    async CreateTracking() {
        const Func = new FunctionsController_1.default();
        const trackingCode = await Func.generateRandomNumbers(1, 12);
        await Tracking_1.default.create({
            tracking_code: trackingCode,
        });
        return trackingCode;
    }
    async track(code, response, session) {
        const checkCode = await Shipment_1.default.findBy('tracking_id', code);
        if (checkCode) {
            const checkShipment = checkCode;
            if (checkShipment.$attributes.status > 0) {
                const Func = new FunctionsController_1.default();
                const mData = {
                    name: await (await Consignment_1.default.find(checkShipment.$attributes.consignmentId))?.$attributes.name,
                    from: checkShipment.$attributes.from,
                    to: checkShipment.$attributes.to,
                    status: checkShipment.$attributes.status,
                    date_of_order: await Func.formatDate(checkShipment.$attributes.date_of_order, 'DD-MM-YYYY'),
                    expected_date: await Func.formatDate(checkShipment.$attributes.expected_date, 'DD-MM-YYYY'),
                };
                session.flash('tracking', mData);
                return response.redirect('back');
            }
            else {
                session.flash('response', {
                    status: 'warning',
                    message: `Shipment with the code (${code}) is not active`,
                });
                return response.redirect('back');
            }
        }
        else {
            session.flash('response', {
                status: 'warning',
                message: `Shipment with the code (${code}) does not exist`,
            });
            return response.redirect('back');
        }
    }
    async dashboard() {
        let data = [];
        const allShipments = await Shipment_1.default.all();
        const allConsignors = await Consignor_1.default.all();
        const runningShipments = await Shipment_1.default.query().where('status', '>', 0);
        data.push({
            runningShipments: runningShipments.length,
            allConsignors: allConsignors.length,
            allShipments: allShipments.length,
        });
        return data;
    }
    async getSingleConsignorById(id) {
        const consignor = await Consignor_1.default.find(id);
        const Func = new FunctionsController_1.default();
        const dt = {
            id: consignor?.$attributes.id,
            first_name: consignor?.$attributes.first_name,
            last_name: consignor?.$attributes.last_name,
            phone_number: consignor?.$attributes.phone_number,
            access: consignor?.$attributes.access,
            created_at: await Func.formatDate(consignor?.$attributes.createdAt.ts, 'DD-MM-YYYY'),
            updated_at: await Func.formatDate(consignor?.$attributes.updatedAt.ts, 'DD-MM-YYYY'),
        };
        return dt;
    }
    async getMultipleConsignorById(ids) {
        ids = JSON.parse(ids);
        const Func = new FunctionsController_1.default();
        const consignor = await Database_1.default.from('consignors').whereIn('id', ids);
        let data = [];
        for (let i = 0; i < consignor.length; i++) {
            const el = consignor[i];
            data.push({
                id: el.id,
                first_name: el.first_name,
                last_name: el.last_name,
                phone_number: el.phone_number,
                access: el.access,
                created_at: await Func.formatDate(el.created_at, 'DD-MM-YYYY'),
                updated_at: await Func.formatDate(el.updated_at, 'DD-MM-YYYY'),
            });
        }
        return data;
    }
    async getSingleShipmentById(id) {
        const shipment = await Shipment_1.default.find(id);
        const dt = {
            id: shipment?.$attributes.id,
            tracking: shipment?.$attributes.trackingId,
            shipping_mark: shipment?.$attributes.shipping_mark,
            currency: shipment?.$attributes.currency,
            amount: shipment?.$attributes.amount,
            goods_description: shipment?.$attributes.goods_description,
        };
        return dt;
    }
    async CreateConsignment(name) {
        const [lastInsertId] = await Database_1.default.table('consignments').insert({
            name: name,
        });
        return lastInsertId;
    }
    async getArrayOfCollectedShipmentIds() {
        const shipment = await CollectedShipment_1.default.all();
        let ids = [];
        for (let i = 0; i < shipment.length; i++) {
            const e = shipment[i];
            ids.push(e.$attributes.shipment_id);
        }
        const rs = ids.filter((value, index) => ids.indexOf(value) === index);
        return rs;
    }
}
exports.default = MethodsController;
//# sourceMappingURL=MethodsController.js.map