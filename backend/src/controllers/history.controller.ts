import express, { Request, Router, Response } from "express";
import db from "../db/db";

const controller: Router = express.Router();

controller.get("/", async (req: Request, res: Response) => {
  try {
    const token = req.get("Authorization");
    if (!token) res.status(400).send({ message: "Token must be present" });
    const shop_id = await db.query("SELECT id_shops FROM users WHERE token = $1", [
      token,
    ]);
    const historyInfo = await db.query(`select
    h.id,
    ot.name as "operation_type",
    i.name as "item_name",
    s.name as "shop",
    h.qty,
    h.price,
    h.total_price,
    h.invoice_number,
    h.date,
    u.login
    from history h
    left join operation_type ot on ot.id = h.operation_type_id
    left join items i on i.id = h.item_id
    left join shops s on s.id = h.shop_id
    left join users u on u.id = h.user_id
    where shop_id = $1`,[shop_id.rows[0].id_shops]);
    res.status(200).send(historyInfo.rows);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

export default controller;