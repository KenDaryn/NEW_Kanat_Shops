"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const jet_logger_1 = __importDefault(require("jet-logger"));
const items_controller_1 = __importDefault(require("../src/controllers/items.controller"));
// import suppliersController from "../src/controllers/suppliers.controller";
const users_controller_1 = __importDefault(require("../src/controllers/users.controller"));
const actions_controller_1 = __importDefault(require("../src/controllers/actions.controller"));
// import suppliersStoragesController from "../src/controllers/suppliersStorages.controller";
// import storagesController from "../src/controllers/storages.controller";
const shops_controller_1 = __importDefault(require("./controllers/shops.controller"));
const stocks_controller_1 = __importDefault(require("./controllers/stocks.controller"));
const role_controller_1 = __importDefault(require("./controllers/role.controller"));
const history_controller_1 = __importDefault(require("./controllers/history.controller"));
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    app.listen(PORT, () => {
        jet_logger_1.default.info(`Server is running on http://localhost:${PORT}`);
    });
});
const app = (0, express_1.default)();
const PORT = 3000;
app.use(express_1.default.json());
app.use(express_1.default.static("public"));
app.use((0, cors_1.default)());
app.use("/items", items_controller_1.default);
// app.use("/suppliers", suppliersController);
app.use("/users", users_controller_1.default);
app.use("/actions", actions_controller_1.default);
// app.use("/suppliers_controllers", suppliersStoragesController);
// app.use("/storages", storagesController);
app.use("/shops", shops_controller_1.default);
app.use("/stocks", stocks_controller_1.default);
app.use("/role", role_controller_1.default);
app.use("/history", history_controller_1.default);
run().catch(jet_logger_1.default.err);
