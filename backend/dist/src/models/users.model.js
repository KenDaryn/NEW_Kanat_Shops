"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yup_1 = require("yup");
const UserSchema = (0, yup_1.object)({
    username: (0, yup_1.string)().required("Username is required!"),
    password: (0, yup_1.string)().required("Password is required!"),
    id_shops: (0, yup_1.number)(),
    createdOn: (0, yup_1.date)().default(() => new Date()),
});
exports.default = UserSchema;
