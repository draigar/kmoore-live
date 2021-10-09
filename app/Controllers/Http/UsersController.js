"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const MethodsController_1 = __importDefault(require("./Methods/MethodsController"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
class UsersController {
    async index({ view }) {
        const users = await User_1.default.all();
        const Met = new MethodsController_1.default();
        const dashboard = await Met.dashboard();
        return view.render('dashboard/users/index', { users, dashboard });
    }
    async login({ view }) {
        return view.render('auth/login');
    }
    async doLogin({ request, auth, session, response }) {
        const { email, password } = request.all();
        const user = await User_1.default.query().where('email', email).andWhere('access', '1').first();
        if (user) {
            const passwordVerify = await User_1.default.query()
                .where('email', email)
                .andWhere('password', password)
                .first();
            if (passwordVerify) {
                await auth.login(user);
                return response.redirect('/dashboard');
            }
            else {
                session.flash('notification', `Sorry we could not verify that ${email} with that password exist`);
                return response.redirect('back');
            }
        }
        else {
            session.flash('notification', `Sorry we could not verify that ${email} exist`);
            return response.redirect('back');
        }
    }
    async logout({ auth, response }) {
        await auth.logout();
        return response.redirect('/');
    }
    async create({ view }) {
        const Met = new MethodsController_1.default();
        const dashboard = await Met.dashboard();
        return view.render('dashboard/users/create', { dashboard });
    }
    async store({ request, response, session }) {
        const validationSchema = Validator_1.schema.create({
            username: Validator_1.schema.string({ trim: true }, [Validator_1.rules.maxLength(20)]),
            email: Validator_1.schema.string({ trim: true }, [Validator_1.rules.maxLength(30)]),
            password: Validator_1.schema.string({ trim: true }, [Validator_1.rules.maxLength(8), Validator_1.rules.minLength(5)]),
        });
        const validateData = await request.validate({
            schema: validationSchema,
            messages: {
                'username.required': 'Enter username',
                'username.maxLength': 'Username should not exceed 20 characters',
                'email.required': 'Enter email address',
                'email.maxLength': 'Email address should not exceed 30 characters',
                'password.required': 'Password is required',
                'password.maxLength': 'Password should only be at least 8 characters',
                'password.minLength': 'Password should only be above 5 characters',
            },
        });
        const checkDuplicateEmail = await User_1.default.query().where('email', request.input('email')).first();
        if (checkDuplicateEmail !== null) {
            session.flash('response', { status: 'warning', message: 'User with email exist' });
            return response.redirect('back');
        }
        else {
            await Database_1.default.table('users').insert({
                username: validateData.username,
                email: validateData.email,
                password: request.input('password'),
            });
            session.flash('response', { status: 'success', message: 'User created successfully' });
            return response.redirect('back');
        }
    }
    async show({ view, params }) {
        const user = await User_1.default.findOrFail(params.id);
        return view.render('dashboard/users/edit', { user });
    }
    async edit({}) { }
    async update({ request, response, session, params }) {
        const user = await User_1.default.find(params.id);
        if (request.input('password')) {
            const validationSchema = Validator_1.schema.create({
                username: Validator_1.schema.string({ trim: true }, [Validator_1.rules.maxLength(20)]),
                password: Validator_1.schema.string({ trim: true }, [Validator_1.rules.maxLength(8), Validator_1.rules.minLength(5)]),
            });
            const validateData = await request.validate({
                schema: validationSchema,
                messages: {
                    'username.required': 'Enter username',
                    'username.maxLength': 'Username should not exceed 20 characters',
                    'password.maxLength': 'Password should only be at least 8 characters',
                    'password.minLength': 'Password should only be above 5 characters',
                },
            });
            if (!user?.username)
                return;
            user.username = validateData.username;
            user.password = validateData.password;
            user.access = request.input('status');
            await user?.save();
            session.flash('response', { status: 'success', message: 'User updated successfully' });
            return response.redirect().toRoute('users');
        }
        else {
            await user?.save();
            session.flash('response', { status: 'success', message: 'User updated successfully' });
            return response.redirect().toRoute('users');
        }
    }
    async destroy({ response, session, params }) {
        const user = await User_1.default.findOrFail(params.id);
        await user.delete();
        session.flash('response', { status: 'success', message: 'User deleted successfully' });
        return response.redirect('back');
    }
}
exports.default = UsersController;
//# sourceMappingURL=UsersController.js.map