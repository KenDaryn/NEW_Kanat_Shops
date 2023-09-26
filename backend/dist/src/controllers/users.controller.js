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
const db_1 = __importDefault(require("../db/db"));
const users_model_1 = __importDefault(require("../models/users.model"));
const validateRequest_1 = __importDefault(require("../middlewares/validateRequest"));
const nanoid_1 = require("nanoid");
const controller = express_1.default.Router();
controller.post("/", (0, validateRequest_1.default)(users_model_1.default), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, id_shops, id_role } = req.body;
        const user = yield db_1.default.query("SELECT * FROM users WHERE login = $1", [
            username,
        ]);
        if (user.rows.length > 0) {
            return res.status(400).send({
                message: "User already exist!",
            });
        }
        const date = new Date().toLocaleString();
        const newUser = yield db_1.default.query(`INSERT INTO users
            (login, password, id_role, create_date, id_shops, blocked)
            VALUES ($1, $2, $3, $4, $5, $6)`, [username, password, id_role, date, id_shops, false]);
        res.status(200).send(newUser.rows[0]);
    }
    catch (error) {
        res.status(500).send({ message: error.message });
    }
}));
controller.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const user = yield db_1.default.query("SELECT * FROM users WHERE login = $1", [
            username,
        ]);
        if (user.rows.length === 0) {
            return res.status(401).send({ message: "Username not found!" });
        }
        const passwordUser = yield db_1.default.query("SELECT password from users where login = $1", [username]);
        if (passwordUser.rows[0].password !== password) {
            return res.status(400).send({ message: "Wrong password" });
            // return res.status(400).send({ message: passwordUser.rows[0] });
        }
        const token = (0, nanoid_1.nanoid)();
        const userSetToken = yield db_1.default.query(`UPDATE users SET 
                    token = $1
                    WHERE login = $2
                    RETURNING *`, [token, username]);
        const authorizedUser = yield db_1.default.query(`select
            u.id,
            u.login,
            u.token,
            r.role,
            id_shops,
            u.blocked
            from users u
            left join user_roles r on r.id = u.id_role
            where u.login = $1`, [username]);
        res.status(200).send(authorizedUser.rows[0]);
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
}));
controller.post("/change", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, id_shops, id_role } = req.body;
        const user = yield db_1.default.query("SELECT * FROM users WHERE login = $1", [
            username,
        ]);
        if (user.rows.length === 0) {
            return res.status(401).send({ message: "Username not found!" });
        }
        const date = new Date().toLocaleString();
        if (id_shops && !id_role && !password) {
            yield db_1.default.query(`
        update users
        set 
        id_shops = $1,
        last_update_date = $2
        where login = $3
        `, [id_shops, date, username]);
        }
        if (!id_shops && id_role && !password) {
            yield db_1.default.query(`
        update users
        set 
        id_role = $1,
        last_update_date = $2
        where login = $3
        `, [id_role, date, username]);
        }
        if (!id_shops && !id_role && password) {
            yield db_1.default.query(`
        update users
        set password = $1,
        last_update_date = $2
        where login = $3
        `, [password, date, username]);
        }
        if (id_shops && id_role && password) {
            yield db_1.default.query(`
        update users
        set password = $1,
        id_shops = $2,
        id_role = $3,
        last_update_date = $4
        where login = $5
        `, [password, id_shops, id_role, date, username]);
        }
        if (!id_shops && id_role && password) {
            yield db_1.default.query(`
        update users
        set password = $1,
        id_role = $2,
        last_update_date = $3
        where login = $4
        `, [password, id_role, date, username]);
        }
        if (id_shops && !id_role && password) {
            yield db_1.default.query(`
        update users
        set password = $1,
        id_shops = $2,
        last_update_date = $3
        where login = $4
        `, [password, id_shops, date, username]);
        }
        if (id_shops && id_role && !password) {
            yield db_1.default.query(`
        update users
        set
        id_shops = $1,
        id_role = $2,
        last_update_date = $3
        where login = $4
        `, [id_shops, id_role, date, username]);
        }
        res.status(200).send({ message: "update successfull" });
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
}));
controller.delete("/logout", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).send({ error: "Unauthorized" });
        }
        const user = yield db_1.default.query(`SELECT * from users WHERE token = $1`, [
            token,
        ]);
        if (user.rowCount === 0) {
            return res.status(200).send({ message: "Logout successfull!" });
        }
        const dropToken = null;
        const resetToken = yield db_1.default.query(`UPDATE users SET 
                    token = $1
                    WHERE token = $2
                    RETURNING *`, [dropToken, token]);
        res.status(200).send({ message: "Logout successful" });
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
}));
controller.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userInfo = yield db_1.default.query(`select
      u.id,
      u.login,
      u.id_role,
      ur.role as "role_name",
      u.id_shops,
      s.name as "shop_name",
      u.create_date,
      u.last_update_date
      from users u
      inner join user_roles ur on ur.id = u.id_role
      left join shops s on s.id = u.id_shops
      where u.id_role !=1
      order by u.create_date desc`);
        res.status(200).send(userInfo.rows);
    }
    catch (error) {
        res.status(500).send({ message: error.message });
    }
}));
exports.default = controller;
