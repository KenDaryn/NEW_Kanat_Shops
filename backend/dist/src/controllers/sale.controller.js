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
const upload_1 = __importDefault(require("../middlewares/upload"));
const util_1 = require("util");
const storage_1 = require("@google-cloud/storage");
const db_1 = __importDefault(require("../db/db"));
const nanoid_1 = require("nanoid");
const controller = express_1.default.Router();
const storage = new storage_1.Storage({
    projectId: "rugged-night-391816",
    credentials: require('../../google-cloud-key.json')
});
const bucket = storage.bucket("flower_shop_1");
controller.get("/showcase", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const showcase = yield db_1.default.query(`
      select
      o.bouquet_id as id,
	  o.order_number,					
      o.actual_price,
      (select  bouquet_name from bouquets where id = o.bouquet_id) as "name_bouquet",
      (select image from bouquets_images where id_bouquet = o.bouquet_id limit 1) as "image_bouquet",
	  (select username from users where id = o.user_id),
	  o.added_date
      from orders o
      where o.order_number in ( select invoice_number from actions where operation_type_id = 3)
      `);
        res.status(200).send(showcase.rows);
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
}));
controller.get("/showcase/:bouquet_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderNumber = req.params.bouquet_id;
        const query = `
	  select
	  a.invoice_number,
	  u.username,
	  a.date,
	  (select bouquet_name from bouquets where id in (select bouquet_id from orders where order_number = $1 )),
	  (select image from bouquets_images where id_bouquet in (select bouquet_id from orders where order_number = $1 ))as image_bouquet,
	  i.item_name,
    a.qty,
	  a.price
	  from actions a
	  inner join items i on i.id = a.item_id 
	  inner join users u on u.id = a.user_id
	  where invoice_number = $1
      `;
        const result = yield db_1.default.query(query, [orderNumber]);
        res.status(200).json(result.rows);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
controller.put("/:bouquet_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.bouquet_id;
        const token = req.get("Authorization");
        const { total_sum, count } = req.body;
        const user_id = yield db_1.default.query("SELECT id FROM users WHERE token = $1", [
            token
        ]);
        if (!user_id.rows.length) {
            return res.status(400).send({ message: "User not found" });
        }
        const order = yield db_1.default.query(`select count (o.bouquet_id) from orders o 
      where o.bouquet_id = $1 
      and o.order_number in (select a.invoice_number from actions a where a.operation_type_id =3)`, [id]);
        if (!order.rows.length || order.rows[0].count < count) {
            return res
                .status(400)
                .send({ error: "Bouquet_not found or quantity more than in the base" });
        }
        const update_date = new Date().toISOString();
        yield db_1.default.query(`UPDATE actions SET operation_type_id = 2, update_date = $1,
      user_id = (SELECT id FROM users WHERE token = $2)
      WHERE
      invoice_number in ( select order_number from orders where bouquet_id = $3 and order_number in
        (select a.invoice_number from actions a where a.operation_type_id = 3) order by order_number limit $4)
      `, [update_date, token, id, count]);
        yield db_1.default.query(`UPDATE orders
      SET total_sum = $1, update_date = $2, user_id = (SELECT id FROM users WHERE token = $3)
      WHERE bouquet_id in (select bouquet_id from orders where bouquet_id = $4 order by order_number limit $5)`, [total_sum, update_date, token, id, count]);
        res.status(200).send({ message: "Update was successful" });
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
}));
controller.post("/showcase", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.get("Authorization");
    if (!token)
        return res.status(400).send("Token must present!");
    try {
        const user = yield db_1.default.query("SELECT * FROM users WHERE token = $1", [
            token
        ]);
        if (!user.rows.length)
            return res.status(400).send({ message: "User not found" });
        if (user.rows[0].id_role !== 1 && 2)
            return res.status(403).send({ message: "Access forbidden" });
        const { bouquets } = req.body;
        if (!bouquets || !bouquets.length)
            return res.status(400).send({ message: "Bad request" });
        for (let i = 0; i < bouquets.length; i++) {
            let orderNumber = (0, nanoid_1.nanoid)();
            let create_date = new Date().toISOString();
            yield db_1.default.query(`
        INSERT INTO orders 
        (order_number, 
          bouquet_id, 
          actual_price, 
          total_sum, 
          added_date, 
          update_date, 
          user_id)
          VALUES 
          ($1, 
          $2,
          (select sum(i.price * r.qty) from items i
          inner join recipes r on r.id_item = i.id
          where r.id_bouquet = $2), 
          $3, 
          $4, 
          $5, 
          (SELECT id FROM users WHERE token = $6)
          ) RETURNING *`, [orderNumber, bouquets[i], 0, create_date, null, token]);
            let itemArr = yield db_1.default.query(`select id_item from recipes where id_bouquet = $1;`, [bouquets[i]]);
            itemArr.rows.forEach((item) => __awaiter(void 0, void 0, void 0, function* () {
                yield db_1.default.query(`
         INSERT INTO actions 
         (operation_type_id, 
           source_id, 
           target_id, 
           item_id, 
           qty,     
           price,
           total_price, 
           invoice_number, 
           date, 
           update_date, 
           user_id --
           )
         VALUES 
         ($1, +
          $2, +
          $3, +
          $4, +
          (select qty from recipes where id_bouquet = $5 and id_item = $4), 
          (select price from items where id = $4), 
          ((select qty from recipes where id_bouquet = $5 and id_item = $4)*(select price from items where id = $4)), 
          $6, 
          $7, 
          $8, 
          (SELECT id FROM users WHERE token = $9))
       `, [
                    3,
                    2,
                    4,
                    item.id_item,
                    bouquets[i],
                    orderNumber,
                    create_date,
                    null,
                    token
                ]);
            }));
        }
        res.status(200).send("successfully added");
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
}));
controller.post("/showcase_custom", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    yield (0, upload_1.default)(req, res);
    const fileOriginalName = (_a = req.file) === null || _a === void 0 ? void 0 : _a.originalname;
    const { name, description, items } = req.body;
    const token = req.get("Authorization");
    if (!token)
        return res.status(400).send("Token must present!");
    const user = yield db_1.default.query("SELECT * FROM users WHERE token = $1", [token]);
    if (!user.rows.length)
        return res.status(400).send({ message: "User not found" });
    try {
        // Запись нового букета
        yield db_1.default.query(`INSERT INTO bouquets (bouquet_name, bouquet_description, 
                author, id_category)
              VALUES ($1, $2, (SELECT username FROM users WHERE token = $3), 5);
              `, [name, description, token]);
        const arrItems = JSON.parse(items);
        const totalPrice = Array.from(arrItems).reduce((accumulator, item) => accumulator + parseInt(item.price) * parseInt(item.qty), 0);
        const date = new Date().toISOString();
        const orderNumber = (0, nanoid_1.nanoid)();
        // Запись в orders
        yield db_1.default.query(`INSERT INTO orders (bouquet_id, order_number, actual_price,total_sum,added_date,user_id)
              VALUES ((select id from bouquets order by id desc limit 1), $1, $2, 0, $3,(SELECT id FROM users WHERE token = $4));
              `, [`AV${orderNumber}`, totalPrice, date, token]);
        // Запись в actions
        for (const item of arrItems) {
            yield db_1.default.query(`INSERT INTO actions (operation_type_id, source_id,target_id,item_id,qty,price, total_price,invoice_number, date,user_id)
                VALUES (3,2,4, $1, $2, $3, $4,$5,$6,(SELECT id FROM users WHERE token = $7));
                `, [
                item.id,
                item.qty,
                item.price,
                totalPrice,
                `AV${orderNumber}`,
                date,
                token
            ]);
        }
        if (!req.file) {
            return res.status(200).send({ message: "Insert was successful" });
        }
        const blob = bucket.file(req.file.originalname);
        const blobStream = blob.createWriteStream({
            resumable: false
        });
        blobStream.on("error", (err) => {
            res.status(500).send({ message: err.message });
        });
        blobStream.on("finish", () => __awaiter(void 0, void 0, void 0, function* () {
            const publicUrl = (0, util_1.format)(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);
            try {
                // Запись картинки букета
                yield db_1.default.query(`
              INSERT INTO bouquets_images (id_bouquet, image) 
              VALUES ((select id from bouquets order by id desc limit 1), $1)
              RETURNING *
          `, [publicUrl]);
            }
            catch (error) {
                res.status(500).send({ error: error.message });
            }
            res.status(200).send({ message: "Insert was successful" });
        }));
        blobStream.end(req.file.buffer);
    }
    catch (err) {
        res.status(500).send({
            message: `Could not upload the file: ${fileOriginalName}. ${err}`
        });
    }
}));
controller.put("/write_off/:order_number", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.order_number;
        const token = req.get("Authorization");
        const user_id = yield db_1.default.query("SELECT id FROM users WHERE token = $1", [
            token
        ]);
        if (!user_id.rows.length) {
            return res.status(400).send({ message: "User not found" });
        }
        const update_date = new Date().toISOString();
        yield db_1.default.query(`UPDATE actions SET operation_type_id = 4, update_date = $1,
      user_id = (SELECT id FROM users WHERE token = $2)
      WHERE
      invoice_number = $3
      `, [update_date, token, id]);
        res.status(200).send({ message: "Update was successful" });
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
}));
controller.put("/sendBasket/:order_number", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.order_number;
        const token = req.get("Authorization");
        const user_id = yield db_1.default.query("SELECT id FROM users WHERE token = $1", [
            token
        ]);
        if (!user_id.rows.length) {
            return res.status(400).send({ message: "User not found" });
        }
        const update_date = new Date().toISOString();
        yield db_1.default.query(`UPDATE actions SET operation_type_id = 5, update_date = $1,
      user_id = (SELECT id FROM users WHERE token = $2)
      WHERE
      invoice_number = $3
      `, [update_date, token, id]);
        res.status(200).send({ message: "Update was successful" });
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
}));
controller.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const token = req.get("Authorization");
    if (!token)
        return res.status(400).send("Token must be present!");
    try {
        const user = yield db_1.default.query("SELECT * FROM users WHERE token = $1", [
            token
        ]);
        if (!user.rows.length)
            return res.status(400).send({ message: "User not found" });
        const { bouquets, totalSales } = req.body;
        if (!bouquets || !bouquets.length)
            return res.status(400).send({ message: "Bad request" });
        const orderNum = (0, nanoid_1.nanoid)();
        const orderPrefix = "av-";
        const create_date = new Date().toISOString();
        // const totalSales = bouquets.reduce(
        //   (total, bouquet) => total + bouquet.total_price,
        //   0
        // );
        const lastGeneralOrder = yield db_1.default.query("SELECT order_number FROM general_orders ORDER BY id DESC LIMIT 1");
        const lastOrderNumber = ((_b = lastGeneralOrder.rows[0]) === null || _b === void 0 ? void 0 : _b.order_number) || 'av-0000';
        const lastNumber = parseInt(lastOrderNumber.split("-")[1]);
        const nextNumber = lastNumber + 1;
        const orderNumber = `${orderPrefix}${nextNumber
            .toString()
            .padStart(5, "0")}`;
        const generalOrderIdResult = yield db_1.default.query(`
      INSERT INTO general_orders (order_number, order_date, total_sales)
      VALUES ($1, $2, $3) RETURNING id`, [orderNumber, new Date().toISOString(), totalSales]);
        const generalOrderId = generalOrderIdResult.rows[0].id;
        yield Promise.all(bouquets.map((bouquetData) => __awaiter(void 0, void 0, void 0, function* () {
            const { bouquet, actual_price, total_price, payment_type } = bouquetData;
            const orderIdResult = yield db_1.default.query(`
          INSERT INTO orders (general_order_id, order_number, bouquet_id, actual_price, total_sum, payment_type, added_date, update_date, user_id)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`, [
                generalOrderId,
                `av-${orderNum}`,
                bouquet,
                actual_price,
                total_price,
                payment_type,
                create_date,
                null,
                user.rows[0].id
            ]);
            const orderId = orderIdResult.rows[0].id;
            const actions = yield db_1.default.query(`
            UPDATE actions 
SET operation_type_id = $1, source_id = $2, target_id = $3
WHERE operation_type_id = 5;
            `, [
                2,
                3,
                9,
            ]);
            return Promise.all([orderId, [actions]]);
        })));
        res
            .status(200)
            .send({ message: "Orders and general order created successfully" });
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
}));
controller.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const generalOrders = yield db_1.default.query(`SELECT DISTINCT go.*, u.first_name, u.last_name
      FROM general_orders go
      JOIN orders o ON go.id = o.general_order_id
      JOIN users u ON o.user_id = u.id
      ORDER BY go.order_date DESC`);
        res.status(200).send(generalOrders.rows);
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
}));
controller.get("/basket", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.get("Authorization");
    if (!token)
        return res.status(400).send("Token must present!");
    try {
        const user = yield db_1.default.query("SELECT * FROM users WHERE token = $1", [
            token
        ]);
        if (!user.rows.length)
            return res.status(400).send({ message: "User not found" });
        if (user.rows[0].id_role !== 1 && 2)
            return res.status(403).send({ message: "Access forbidden" });
        const result = (yield db_1.default.query(`
    select o.bouquet_id as id, o.actual_price, o.total_sum,  
    o.added_date, b.invoice_number as order_number, i.image as image_bouquet, bt.bouquet_name as name_bouquet 
    from orders o
    join (
      select distinct invoice_number from actions
      where operation_type_id = 5
    ) b ON b.invoice_number = o.order_number
    left join (
      select distinct on(id_bouquet) * from bouquets_images
    ) i on i.id_bouquet = o.bouquet_id
    join bouquets bt on o.bouquet_id = bt.id
    `)).rows;
        res.status(200).send(result);
    }
    catch (error) {
        res.status(500).send({ message: error.message });
    }
}));
controller.get("/:general_order_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { general_order_id } = req.params;
    try {
        const orders = yield db_1.default.query(`SELECT o.*, u.last_name, u.first_name, pt.name as payment_type, b.bouquet_name
      FROM orders o
      INNER JOIN users u ON o.user_id = u.id
      INNER JOIN payment_type pt ON o.payment_type = pt.id
      INNER JOIN bouquets b ON o.bouquet_id = b.id
      WHERE o.general_order_id = $1`, [general_order_id]);
        res.status(200).send(orders.rows);
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
}));
exports.default = controller;
