"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const luxon_1 = require("luxon");
const Orm_1 = global[Symbol.for('ioc.use')]("Adonis/Lucid/Orm");
const Consignment_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Consignment"));
const Tracking_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Tracking"));
const CollectedShipment_1 = __importDefault(require("./CollectedShipment"));
class Shipment extends Orm_1.BaseModel {
}
__decorate([
    Orm_1.column({ isPrimary: true }),
    __metadata("design:type", Number)
], Shipment.prototype, "id", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", Number)
], Shipment.prototype, "consignment_id", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", Number)
], Shipment.prototype, "consignmentId", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", Number)
], Shipment.prototype, "tracking_id", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", Number)
], Shipment.prototype, "trackingId", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", Number)
], Shipment.prototype, "currency", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Shipment.prototype, "amount", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Shipment.prototype, "shipping_mark", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Shipment.prototype, "goods_description", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", Object)
], Shipment.prototype, "consignors", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Shipment.prototype, "from", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Shipment.prototype, "to", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", Number)
], Shipment.prototype, "status", void 0);
__decorate([
    Orm_1.column.dateTime(),
    __metadata("design:type", luxon_1.DateTime)
], Shipment.prototype, "date_of_order", void 0);
__decorate([
    Orm_1.column.dateTime(),
    __metadata("design:type", luxon_1.DateTime)
], Shipment.prototype, "expected_date", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Shipment.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Shipment.prototype, "updatedAt", void 0);
__decorate([
    Orm_1.belongsTo(() => Consignment_1.default),
    __metadata("design:type", Object)
], Shipment.prototype, "consignment", void 0);
__decorate([
    Orm_1.belongsTo(() => Tracking_1.default),
    __metadata("design:type", Object)
], Shipment.prototype, "tracking", void 0);
__decorate([
    Orm_1.hasMany(() => CollectedShipment_1.default),
    __metadata("design:type", Object)
], Shipment.prototype, "collectedShipment", void 0);
exports.default = Shipment;
//# sourceMappingURL=Shipment.js.map