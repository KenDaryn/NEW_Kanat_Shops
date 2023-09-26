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
const express_1 = __importDefault(require("express"));
const util_1 = require("util");
const storage_1 = require("@google-cloud/storage");
const db_1 = __importDefault(require("../db/db"));
const item_model_1 = __importDefault(require("../models/item.model"));
const validateRequest_1 = __importDefault(require("../middlewares/validateRequest"));
const path_1 = __importDefault(require("path"));
const nanoid_1 = require("nanoid");
const uploadsImageSmall_1 = __importDefault(require("../middlewares/uploadsImageSmall"));
const controller = express_1.default.Router();
const storage = new storage_1.Storage({
    projectId: "leafy-sight-398211",
    credentials: require("../../google-cloud-key.json"),
});
const bucket = storage.bucket("kanat_shop");
controller.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield db_1.default.query(`
      select
      (select count(id) from actions where i.id in (item_id)),
      *
      from items i
      where state = $1
`, [true]);
        res.status(200).send(item.rows);
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
}));
controller.get("/archive", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield db_1.default.query(`
      select
      *
      from items i
      where state = $1
`, [false]);
        res.status(200).send(item.rows);
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
}));
controller.post("/", uploadsImageSmall_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Тут надо поменять логику в части сначала добавить запись в бд потом добавить ссылку на фото
    // Что бы не засорять google хранилище
    try {
        const token = req.get("Authorization");
        if (!token)
            res.status(400).send({ message: "Token must be present" });
        const user = (yield db_1.default.query("SELECT * FROM users WHERE token = $1", [token])).rows[0];
        const { item_name } = req.body;
        const create_date = new Date().toLocaleString();
        let publicUrl = "";
        const insertIntoDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const newItem = yield db_1.default.query(`INSERT INTO items (
            name,
            image,
            create_date,
            state
          ) VALUES ($1, $2, $3, $4)`, [item_name, publicUrl, create_date, true]);
                res.status(200).send({
                    message: "Item created successfully",
                    item: newItem,
                });
            }
            catch (error) {
                res.status(500).send({ message: error.message });
            }
        });
        if (req.file) {
            const blob = bucket.file((0, nanoid_1.nanoid)() + path_1.default.extname(req.file.originalname));
            const blobStream = blob.createWriteStream({
                resumable: false,
            });
            blobStream.on("error", (err) => {
                res.status(500).send({ message: err.message });
            });
            blobStream.on("finish", () => {
                publicUrl = (0, util_1.format)(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);
                insertIntoDatabase();
            });
            blobStream.end(req.file.buffer);
        }
        else {
            insertIntoDatabase();
        }
    }
    catch (error) {
        res.status(500).send({ message: error.message });
    }
}));
controller.put("/:id", (0, validateRequest_1.default)(item_model_1.default), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.get("Authorization");
        const user = yield db_1.default.query("SELECT id FROM users WHERE token = $1", [
            token,
        ]);
        if (user.rows.length === 0) {
            return res.status(401).send({ error: "Unauthorized" });
        }
        const { item_name } = req.body;
        console.log(req.body);
        const id = req.params.id;
        const updatedItem = yield db_1.default.query(`UPDATE items
          SET
            name = $1
          WHERE id = $2
          RETURNING *`, [item_name, id]);
        const updatedItemData = updatedItem.rows[0];
        res.status(200).send({
            message: "Item updated successfully",
            item: updatedItemData,
        });
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
}));
// Тут добавить удаление фото в google storage не сделал!!!!!!!!!!!!!!!!!!
controller.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Добавить проверку на наличие записи по item
    try {
        const id = req.params.id;
        const deletedItem = yield db_1.default.query("DELETE FROM items WHERE id = $1 RETURNING *", [id]);
        if (deletedItem.rows.length === 0) {
            return res.status(404).send({ message: "Item not found" });
        }
        res.status(200).send({
            message: "Item deleted successfully",
        });
    }
    catch (error) {
        res.status(500).send({ message: error.message });
    }
}));
controller.put("/archive/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield db_1.default.query("update items set state = $1 where id = $2", [false, id]);
        res.status(200).send({
            message: "Item archive successfully",
        });
    }
    catch (error) {
        res.status(500).send({ message: error.message });
    }
}));
controller.put("/active/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield db_1.default.query("update items set state = $1 where id = $2", [true, id]);
        res.status(200).send({
            message: "Item active successfully",
        });
    }
    catch (error) {
        res.status(500).send({ message: error.message });
    }
}));
exports.default = controller;
