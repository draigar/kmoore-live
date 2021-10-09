"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
Route_1.default.get('/', 'PublicsController.index').as('public');
Route_1.default.get('/tracking', 'PublicsController.tracking').as('tracking');
Route_1.default.post('/track-shipment', 'PublicsController.getTracker').as('public-tracking');
Route_1.default.get('/contact', 'PublicsController.contact').as('contact');
Route_1.default.get('/login', 'UsersController.login').as('login');
Route_1.default.post('/login', 'UsersController.doLogin').as('doLogin');
Route_1.default.post('/logout', 'UsersController.logout').as('logout');
Route_1.default.group(() => {
    Route_1.default.get('/', 'DashboardController.index').as('dashboard');
    Route_1.default.get('/consignors', 'ConsignorsController.index').as('consignors');
    Route_1.default.get('/create-consignors', 'ConsignorsController.create').as('create-consignors');
    Route_1.default.post('/create-consignors', 'ConsignorsController.store').as('store-consignors');
    Route_1.default.get('/update-consignors/:id', 'ConsignorsController.show');
    Route_1.default.patch('/update-consignors/:id', 'ConsignorsController.update');
    Route_1.default.post('/delete-consignors/:id', 'ConsignorsController.destroy');
    Route_1.default.get('/consignments', 'ConsignmentsController.index').as('consignments');
    Route_1.default.get('/create-consignments', 'ConsignmentsController.create').as('create-consignments');
    Route_1.default.post('/create-consignments', 'ConsignmentsController.store').as('store-consignments');
    Route_1.default.get('/edit-consignments/:id', 'ConsignmentsController.show').as('update-consignments');
    Route_1.default.post('/edit-consignments/:id', 'ConsignmentsController.update').as('edit-consignments');
    Route_1.default.post('/delete-consignments/:id', 'ConsignmentsController.destroy');
    Route_1.default.get('/shipments', 'ShipmentsController.index').as('shipments');
    Route_1.default.get('/book-shipments', 'ShipmentsController.create').as('book-shipments');
    Route_1.default.post('/book-shipments', 'ShipmentsController.store').as('store-shipments');
    Route_1.default.get('/edit-shipments/:id', 'ShipmentsController.show').as('edit-shipments');
    Route_1.default.post('/edit-shipments/:id', 'ShipmentsController.update').as('update-shipments');
    Route_1.default.post('/delete-shipments/:id', 'ShipmentsController.destroy').as('delete-shipments');
    Route_1.default.get('/tracking', 'TrackingsController.index').as('trackingDashboard');
    Route_1.default.get('/tracking/:code', 'TrackingsController.index');
    Route_1.default.post('/track-shipments', 'TrackingsController.trackShipments').as('tracking-shipments');
    Route_1.default.get('/activities', 'ActivitiesController.index').as('activities');
    Route_1.default.get('/users', 'UsersController.index').as('users');
    Route_1.default.get('/create-users', 'UsersController.create').as('create-users');
    Route_1.default.post('/create-users', 'UsersController.store').as('store-users');
    Route_1.default.get('/edit-users/:id', 'UsersController.show').as('edit-users');
    Route_1.default.post('/edit-users/:id', 'UsersController.update').as('update-users');
    Route_1.default.post('/delete-users/:id', 'UsersController.destroy').as('delete-user');
    Route_1.default.get('/sms', 'SmsController.index').as('sms');
    Route_1.default.get('/sms/create', 'SmsController.create').as('create-sms');
    Route_1.default.post('/create-sms', 'SmsController.store').as('store-sms');
    Route_1.default.get('/collected-shipments', 'CollectedShipmentsController.index').as('collected');
    Route_1.default.get('/create-collections', 'CollectedShipmentsController.create').as('collections');
    Route_1.default.post('/create-collections', 'CollectedShipmentsController.store').as('create-collections');
    Route_1.default.get('/collected-shipments/:tracking', 'CollectedShipmentsController.single').as('collectedShipmentSingle');
    Route_1.default.post('/printSingleCollectedShipments/:id', 'CollectedShipmentsController.printSingleCollectedShipments').as('printSingleCollectedShipments');
})
    .prefix('dashboard')
    .middleware(['auth']);
//# sourceMappingURL=routes.js.map