"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Consignment_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Consignment"));
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const MethodsController_1 = __importDefault(require("./Methods/MethodsController"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
class ConsignmentsController {
    async index({ view }) {
        const data = await this.getAllConsignments();
        const Met = new MethodsController_1.default();
        const dashboard = await Met.dashboard();
        return view.render('dashboard/consignments/index', { data, dashboard });
    }
    async getAllConsignments() {
        const check = Database_1.default.from('consignments')
            .join('shipments', 'consignments.id', '=', 'shipments.consignment_id')
            .select('consignments.*')
            .select('shipments.status');
        return check;
    }
    async create({ view }) {
        return view.render('dashboard/consignments/create');
    }
    async store({ request, response, session }) {
        if (request.input('consignorId') === '0') {
            session.flash('response', { status: 'warning', message: 'You have to select a consignor' });
            return response.redirect('back');
        }
        else {
            const validationSchema = Validator_1.schema.create({
                name: Validator_1.schema.string({ trim: true }, [Validator_1.rules.maxLength(80)]),
            });
            const validateData = await request.validate({
                schema: validationSchema,
                messages: {
                    'name.required': 'Consignment name is required',
                    'name.maxLength': 'Consignment name should not be more than 80 characters',
                },
            });
            await Consignment_1.default.create({
                name: validateData.name,
            });
            session.flash('response', { status: 'success', message: 'Consignment created successfully' });
            return response.redirect('back');
        }
    }
    async show({ view, params }) {
        const allConsignments = await Consignment_1.default.find(params.id);
        const Met = new MethodsController_1.default();
        const dashboard = await Met.dashboard();
        return view.render('dashboard/consignments/edit', { allConsignments, dashboard });
    }
    async edit({}) { }
    async update({ request, response, session, params }) {
        const consignments = await Consignment_1.default.find(params.id);
        const validationSchema = Validator_1.schema.create({
            name: Validator_1.schema.string({ trim: true }, [Validator_1.rules.maxLength(80)]),
        });
        const validateData = await request.validate({
            schema: validationSchema,
            messages: {
                'name.required': 'Consignment name is required',
                'name.maxLength': 'Consignment name should not be more than 80 characters',
            },
        });
        (consignments.name = validateData.name), (consignments.access = request.input('status'));
        await consignments?.save();
        session.flash('response', { status: 'success', message: 'Consignment updated successfully' });
        return response.redirect().toRoute('consignments');
    }
    async destroy({ response, session, params }) {
        const consign = await Consignment_1.default.findOrFail(params.id);
        await consign.delete();
        session.flash('response', { status: 'success', message: 'Consignment deleted successfully' });
        return response.redirect('back');
    }
}
exports.default = ConsignmentsController;
//# sourceMappingURL=ConsignmentsController.js.map