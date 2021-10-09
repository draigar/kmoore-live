"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const MethodsController_1 = __importDefault(require("./Methods/MethodsController"));
const Sm_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Sm"));
const axios_1 = __importDefault(require("axios"));
const Consignor_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Consignor"));
class SmsController {
    async index({ view }) {
        const Met = new MethodsController_1.default();
        const dashboard = await Met.dashboard();
        const sms = await Sm_1.default.all();
        let data = [];
        for (let i = 0; i < sms.length; i++) {
            const el = sms[i];
            data.push({
                id: el.$attributes.id,
                message_id: el.$attributes.message_id,
                sender_id: el.$attributes.sender_id,
                message: el.$attributes.message,
                numbers: el.$attributes.numbers,
            });
        }
        return view.render('dashboard/sms/index', { dashboard, data });
    }
    async create({ view }) {
        const Met = new MethodsController_1.default();
        const dashboard = await Met.dashboard();
        const consignors = await Consignor_1.default.all();
        const consignorNumbers = [];
        for (let i = 0; i < consignors.length; i++) {
            const el = consignors[i];
            const number = el.$attributes.phone_number;
            consignorNumbers.push(number);
        }
        return view.render('dashboard/sms/create', { dashboard, consignorNumbers });
    }
    async store({ request, response, session }) {
        const senderId = request.input('sender_id');
        const number = request.input('numbers');
        const message = request.input('message');
        const validationSchema = Validator_1.schema.create({
            sender_id: Validator_1.schema.string({ trim: true }, [Validator_1.rules.maxLength(11)]),
            numbers: Validator_1.schema.string({ trim: true }),
            message: Validator_1.schema.string(),
        });
        const validateData = await request.validate({
            schema: validationSchema,
            messages: {
                'sender_id.required': 'Enter sender id minimum of 11 characters',
                'sender_id.maxLength': 'Sender id should not exceed 11 characters',
                'numbers.required': 'Enter number list',
                'message': 'Message is required',
            },
        });
        const messageResponse = await this.processRequest(senderId, number, message);
        const { status } = messageResponse;
        if (!status) {
            session.flash('response', { status: 'failure', message: 'SMS could not be sent' });
        }
        else {
            await Sm_1.default.create({
                sender_id: validateData.sender_id,
                numbers: validateData.numbers,
                message: validateData.message,
                message_id: messageResponse.data.data.message_id,
            });
            session.flash('response', { status: 'success', message: 'SMS Created and Sent successfully' });
        }
        return response.redirect('back');
    }
    async show({}) { }
    async edit({}) { }
    async update({}) { }
    async destroy({}) { }
    async processRequest(from, to, message) {
        const requestOptions = {
            method: 'POST',
            redirect: 'follow',
        };
        const token = 'y5VI1vrH2FNVcbnhM0jIJcJljo6dHUbU9LHOhzuwB7Yff977gztfarsi9k9v';
        const url = `https://www.bulksmsnigeria.com/api/v1/sms/create?api_token=${token}&from=${from}&to=${to}&body=${message}&dnd=2`;
        try {
            const res = await axios_1.default.get(url, requestOptions);
            const val = res.data;
            return { status: true, data: val };
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }
}
exports.default = SmsController;
//# sourceMappingURL=SmsController.js.map