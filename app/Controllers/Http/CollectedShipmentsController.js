"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CollectedShipment_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/CollectedShipment"));
const Shipment_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Shipment"));
const FunctionsController_1 = __importDefault(require("./Methods/FunctionsController"));
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const MethodsController_1 = __importDefault(require("./Methods/MethodsController"));
class CollectedShipmentsController {
    async index({ view }) {
        const Func = new FunctionsController_1.default();
        const Met = new MethodsController_1.default();
        const dashboard = await Met.dashboard();
        let data = [];
        const shipments = await Shipment_1.default.query().preload('consignment');
        const CollectedShipmentsIds = await Met.getArrayOfCollectedShipmentIds();
        for (let i = 0; i < shipments.length; i++) {
            const e = shipments[i];
            if (CollectedShipmentsIds.includes(e.id)) {
                data.push({
                    id: e.$attributes.id,
                    consignment_name: e.consignment.$attributes.name,
                    tracking_id: e.$attributes.trackingId,
                    consignors: JSON.parse(e.$attributes.consignors),
                    from: e.$attributes.from,
                    to: e.$attributes.to,
                    amount: e.$attributes.amount,
                    date_of_order: await Func.formatDate(e.$attributes.date_of_order, 'DD-MM-YYYY'),
                });
            }
        }
        return view.render('dashboard/collected/index', { data, dashboard });
    }
    async create({ view }) {
        const shipments = await Shipment_1.default.query().where('status', '=', 7);
        const Met = new MethodsController_1.default();
        const dashboard = await Met.dashboard();
        let data = [];
        for (let i = 0; i < shipments.length; i++) {
            const e = shipments[i];
            data.push({
                id: e.id,
                tracking_id: e.$attributes.trackingId,
                consignors: await Met.getMultipleConsignorById(e.$attributes.consignors),
            });
        }
        return view.render('dashboard/collected/create', { data, dashboard });
    }
    async store({ request, response, session }) {
        const shipmentsD = request.input('shipments');
        if (shipmentsD === '0') {
            session.flash('response', {
                status: 'warning',
                message: 'You have to select a shipment with a consignor',
            });
            return response.redirect('back');
        }
        else {
            const validationSchema = Validator_1.schema.create({
                date: Validator_1.schema.date(),
                cbm: Validator_1.schema.string(),
                qty: Validator_1.schema.number(),
                fright_charge: Validator_1.schema.number(),
            });
            const validateData = await request.validate({
                schema: validationSchema,
                messages: {
                    'date.required': 'Collected date is required',
                },
            });
            const shipConsigId = shipmentsD.split(',');
            await CollectedShipment_1.default.create({
                consignor_id: shipConsigId[1],
                shipment_id: shipConsigId[0],
                description: request.input('description'),
                qty: validateData.qty,
                cbm: validateData.cbm,
                fright_charge: validateData.fright_charge,
                date_of_collection: request.input('date'),
            });
            session.flash('response', { status: 'success', message: `Collections created successfully` });
            return response.redirect().toRoute('collected');
        }
    }
    async single({ view, params }) {
        const trackingCode = params.tracking;
        const shipmentId = await Shipment_1.default.findByOrFail('tracking_id', trackingCode);
        const shipId = shipmentId.$attributes.id;
        const Met = new MethodsController_1.default();
        const Func = new FunctionsController_1.default();
        const dashboard = await Met.dashboard();
        const collectedShipments = await CollectedShipment_1.default.query().where('shipment_id', shipId);
        let dt = [];
        for (let i = 0; i < collectedShipments.length; i++) {
            const e = collectedShipments[i];
            const pusher = {
                id: e.id,
                consignor: await Met.getSingleConsignorById(e.$attributes.consignor_id),
                shipments: await Met.getSingleShipmentById(e.$attributes.shipment_id),
                description: e.$attributes.description,
                qty: e.$attributes.qty,
                cbm: e.$attributes.cbm,
                fright_charge: e.$attributes.fright_charge,
                date_of_collection: await Func.formatDate(e.$attributes.date_of_collection.ts, 'DD-MM-YYYY'),
                dataForPrint: await this.printSingleCollectedShipments(e.id),
            };
            dt.push(pusher);
        }
        console.log(dt[0]);
        return view.render('dashboard/collected/index', { dt, dashboard });
    }
    async printSingleCollectedShipments(arg) {
        const id = arg;
        const Met = new MethodsController_1.default();
        const collectedShipments = await CollectedShipment_1.default.find(id);
        const consignor = await Met.getSingleConsignorById(collectedShipments?.$attributes.consignor_id);
        const getShipmentDetails = await Met.getSingleShipmentById(collectedShipments?.$attributes.shipment_id);
        const data = {
            shipping_mark: getShipmentDetails.shipping_mark,
            consignee_name: consignor.first_name + ' ' + consignor.last_name,
            consignee_number: consignor.phone_number,
            container_number: getShipmentDetails.tracking,
            goods_description: getShipmentDetails.goods_description,
        };
        const properties = [
            'SHIPPING MARK',
            'CONSIGNEE NAME',
            'CONSIGNEE NUMBER',
            'QTY',
            'CBM',
            'FRIGHT CHARGE',
            'CONTAINER NUMBER',
            'GOODS DESCRIPTION',
        ];
        return { printable: JSON.stringify(data), properties: properties };
    }
    async show({}) { }
    async edit({}) { }
    async update({}) { }
    async destroy({}) { }
}
exports.default = CollectedShipmentsController;
//# sourceMappingURL=CollectedShipmentsController.js.map