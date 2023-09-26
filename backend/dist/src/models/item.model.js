"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yup_1 = require("yup");
const ItemSchema = (0, yup_1.object)({
    item_name: (0, yup_1.string)().required("Name is required").max(55),
    create_date: (0, yup_1.date)(),
});
exports.default = ItemSchema;
