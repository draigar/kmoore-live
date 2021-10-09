"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const Consignor_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Consignor"));
const MethodsController_1 = __importDefault(require("./Methods/MethodsController"));
class ConsignorsController {
    async index({ view }) {
        const allConsignors = await Consignor_1.default.all();
        const Met = new MethodsController_1.default();
        const dashboard = await Met.dashboard();
        return view.render('dashboard/consignors/index', { allConsignors, dashboard });
    }
    async create({ view }) {
        const Met = new MethodsController_1.default();
        const dashboard = await Met.dashboard();
        return view.render('dashboard/consignors/create', { dashboard });
    }
    async store({ request, response, session }) {
        const phone = request.input('phone_number');
        const checkPhoneExist = await Consignor_1.default.findBy('phone_number', phone);
        if (checkPhoneExist) {
            session.flash('response', {
                status: 'warning',
                message: `Consignor with phone number (${phone}) exist `,
            });
            return response.redirect('back');
        }
        else {
            const validationSchema = Validator_1.schema.create({
                first_name: Validator_1.schema.string({ trim: true }, [Validator_1.rules.maxLength(80)]),
                last_name: Validator_1.schema.string({ trim: true }, [Validator_1.rules.maxLength(80)]),
                phone_number: Validator_1.schema.string(),
            });
            const validateData = await request.validate({
                schema: validationSchema,
                messages: {
                    'first_name.required': 'Enter first name',
                    'first_name.maxLength': 'First name should not exceed 25 characters',
                    'last_name.required': 'Enter last name',
                    'last_name.maxLength': 'Last name should not exceed 25 characters',
                    'phone_number': 'Phone number is required',
                },
            });
            await Consignor_1.default.create({
                first_name: validateData.first_name,
                last_name: validateData.last_name,
                phone_number: validateData.phone_number,
            });
            session.flash('response', { status: 'success', message: 'Consignor created successfully' });
            return response.redirect('back');
        }
    }
    async show({ view, params }) {
        const consignor = await Consignor_1.default.findOrFail(params.id);
        const Met = new MethodsController_1.default();
        const dashboard = await Met.dashboard();
        return view.render('dashboard/consignors/edit', { dashboard, consignor });
    }
    async edit({}) { }
    async update({ request, response, session, params }) {
        const consignors = await Consignor_1.default.find(params.id);
        const validationSchema = Validator_1.schema.create({
            first_name: Validator_1.schema.string({ trim: true }, [Validator_1.rules.maxLength(80)]),
            last_name: Validator_1.schema.string({ trim: true }, [Validator_1.rules.maxLength(80)]),
            phone_number: Validator_1.schema.string(),
        });
        const validateData = await request.validate({
            schema: validationSchema,
            messages: {
                'first_name.required': 'Enter first name',
                'first_name.maxLength': 'First name should not exceed 25 characters',
                'last_name.required': 'Enter last name',
                'last_name.maxLength': 'Last name should not exceed 25 characters',
                'phone_number': 'Phone number is required',
            },
        });
        consignors.first_name = validateData.first_name;
        consignors.last_name = validateData.last_name;
        consignors.phone_number = validateData.phone_number;
        consignors.access = request.input('status');
        await consignors?.save();
        session.flash('response', { status: 'success', message: 'Consignor updated successfully' });
        return response.redirect().toRoute('consignors');
    }
    async destroy({ response, session, params }) {
        const consig = await Consignor_1.default.findOrFail(params.id);
        await consig.delete();
        session.flash('response', { status: 'success', message: 'Consignor deleted successfully' });
        return response.redirect('back');
    }
}
exports.default = ConsignorsController;
//# sourceMappingURL=ConsignorsController.js.map