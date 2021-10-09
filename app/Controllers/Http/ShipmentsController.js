"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Consignment_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Consignment"));
const Shipment_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Shipment"));
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const MethodsController_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Controllers/Http/Methods/MethodsController"));
const Consignor_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Consignor"));
const FunctionsController_1 = __importDefault(require("./Methods/FunctionsController"));
class ShipmentsController {
    async index({ view }) {
        const allShipments = await Shipment_1.default.query().preload('consignment').preload('tracking');
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
        return view.render('dashboard/shipments/index', { allShip, dashboard });
    }
    async create({ view }) {
        const allConsignors = await Consignor_1.default.query().where('access', '=', 1);
        const Met = new MethodsController_1.default();
        const dashboard = await Met.dashboard();
        return view.render('dashboard/shipments/book', { allConsignors, dashboard });
    }
    async store({ request, response, session }) {
        const checkConsignmentExist = await Consignment_1.default.query()
            .where('name', request.input('consignment'))
            .andWhere('access', '>', 0)
            .first();
        if (checkConsignmentExist) {
            session.flash('response', {
                status: 'warning',
                message: `Consignment with (${checkConsignmentExist.$attributes.name}) exist`,
            });
            return response.redirect('back');
        }
        else if (request.input('consignment') === '') {
            session.flash('response', { status: 'warning', message: 'You need a consignment name' });
            return response.redirect('back');
        }
        else if (request.input('consignors') && request.input('consignors').length <= 0) {
            session.flash('response', {
                status: 'warning',
                message: 'You have to select at least one consignor',
            });
            return response.redirect('back');
        }
        else if (isNaN(request.input('amount'))) {
            session.flash('response', { status: 'warning', message: 'Amount can only be in numbers' });
            return response.redirect('back');
        }
        else {
            const Met = new MethodsController_1.default();
            const ConsignmentId = await Met.CreateConsignment(request.input('consignment'));
            const validationSchema = Validator_1.schema.create({
                amount: Validator_1.schema.string({ trim: true }),
                from: Validator_1.schema.string({ trim: true }, [Validator_1.rules.maxLength(80)]),
                to: Validator_1.schema.string({ trim: true }, [Validator_1.rules.maxLength(80)]),
                date_of_order: Validator_1.schema.date(),
                expected_date: Validator_1.schema.date(),
                goods_description: Validator_1.schema.string(),
                code: Validator_1.schema.string(),
                currency: Validator_1.schema.number(),
            });
            const validateData = await request.validate({
                schema: validationSchema,
                messages: {
                    'code.required': 'Tracking code is required',
                    'from.required': 'Location from is required',
                    'from.maxLength': 'Location from should not be more than 80 characters',
                    'to.required': 'Location to is required',
                    'to.maxLength': 'Location to should not be more than 80 characters',
                    'date_of_order.required': 'Select when the order was placed',
                    'expected_date': 'Select when the order is expected to arrive',
                    'amount': 'Please total amount of the shipment',
                },
            });
            const lastTrackingId = request.input('code');
            const consignmentId = ConsignmentId;
            const checkConsignment = await Shipment_1.default.query()
                .where('consignment_id', consignmentId)
                .andWhere('status', '>', 0)
                .first();
            const consignorsIds = JSON.stringify(request.input('consignors'));
            if (checkConsignment) {
                session.flash('response', {
                    status: 'warning',
                    message: `Shipment with the selected consignment is still active`,
                });
                return response.redirect('back');
            }
            else {
                await Shipment_1.default.create({
                    consignment_id: consignmentId,
                    tracking_id: lastTrackingId,
                    consignors: consignorsIds,
                    from: validateData.from,
                    currency: validateData.currency,
                    amount: validateData.amount,
                    to: validateData.to,
                    date_of_order: validateData.date_of_order,
                    expected_date: validateData.expected_date,
                    goods_description: validateData.goods_description,
                });
                session.flash('response', { status: 'success', message: `Shipment created successfully` });
                return response.redirect().toRoute('shipments');
            }
        }
    }
    async show({ view, params }) {
        const allShipments = await Shipment_1.default.find(params.id);
        const allConsignors = await Consignor_1.default.query().where('access', '=', 1);
        const Met = new MethodsController_1.default();
        const dashboard = await Met.dashboard();
        return view.render('dashboard/shipments/edit', { allShipments, allConsignors, dashboard });
    }
    async edit({}) { }
    async update({ request, response, session, params }) {
        const shipments = await Shipment_1.default.findOrFail(params.id);
        if (request.input('consignors') && request.input('consignors').length <= 0) {
            session.flash('response', {
                status: 'warning',
                message: 'You have to select at least one consignor',
            });
            return response.redirect('back');
        }
        else if (request.input('consignors') && isNaN(request.input('amount'))) {
            session.flash('response', { status: 'warning', message: 'Amount can only be in numbers' });
            return response.redirect('back');
        }
        else {
            const consignmentId = request.input('consignmentId');
            const checkConsignment = await Consignment_1.default.query().where('id', consignmentId).first();
            if (checkConsignment && checkConsignment?.access > 0) {
                const consignorsIds = JSON.stringify(request.input('consignors'));
                shipments.status = request.input('status');
                shipments.consignors = consignorsIds;
                shipments.from = request.input('from');
                shipments.to = request.input('to');
                shipments.currency = request.input('currency');
                shipments.amount = request.input('amount');
                shipments.goods_description = request.input('goods_description');
                shipments.date_of_order = request.input('date_of_order');
                shipments.expected_date = request.input('expected_date');
                await shipments?.save();
                session.flash('response', { status: 'success', message: 'Shipment updated successfully' });
                return response.redirect().toRoute('shipments');
            }
            else {
                session.flash('response', {
                    status: 'warning',
                    message: `This Shipment is set to in Active - Go to consignments and edit ( ${checkConsignment?.name} ) to active`,
                });
                return response.redirect().toRoute('shipments');
            }
        }
    }
    async destroy({ response, session, params }) {
        const shipment = await Shipment_1.default.findOrFail(params.id);
        const consignmentId = shipment.$attributes.consignmentId;
        const consignment = await Consignment_1.default.findOrFail(consignmentId);
        await shipment.delete();
        await consignment.delete();
        session.flash('response', { status: 'success', message: 'Shipment deleted successfully' });
        return response.redirect('back');
    }
}
exports.default = ShipmentsController;
//# sourceMappingURL=ShipmentsController.js.map