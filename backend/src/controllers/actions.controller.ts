import express, { Request, Router, Response } from "express";
import db from "../db/db";
import ActionsSchema, { Actions } from "../models/actions.models";
import validate from "../middlewares/validateRequest";
import { nanoid } from "nanoid";

const controller: Router = express.Router();

controller.post("/", async (req: Request, res: Response) => {
  try {
    const token = req.get("Authorization");
    const { count, summ, from, id_shop, id_item } = req.body;
    const user = await db.query("SELECT id FROM users WHERE token = $1", [
      token,
    ]);
    if (!user.rows.length) {
      return res.status(400).send({ message: "User not found" });
    }
    const invoiceNumber = nanoid();
    const date = new Date().toLocaleString();
    let i = 0;
    while (i < parseInt(count)) {
      await db.query(
        `
          INSERT INTO actions 
          (operation_type_id, 
            source_name, 
            item_id, 
            qty, 
            price, 
            total_price, 
            date,
            user_id,
            invoice_number)
            VALUES 
            ($1, 
            $2,
            $3,
            $4, 
            $5, 
            $6, 
            $7,
            (SELECT id FROM users WHERE token = $8),
            $9
            )`,
        [1, from, id_item, 1, summ, summ, date, token, invoiceNumber]
      );
      i++;
    }

    res.status(200).send({ message: "successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

controller.get("/", async (req: Request, res: Response) => {
  try {
    const invoiceNumbers = await db.query(
      `
      select
      ot.name as "opeation_name",
      a.source_name,
      i.name as "item_name",
	  sum(a.qty) as "qty",
      a.price,
      sum(a.total_price) as "total_price",
      a.invoice_number,
      a.date,
      u.login
      from actions a
      inner join items i on i.id = a.item_id
      inner join users u on u.id = a.user_id
      inner join operation_type ot on ot.id = a.operation_type_id
	  group by 
	  a.invoice_number,
      ot.name,
      a.source_name,
      i.name,
      a.qty,
      a.price,
      a.total_price,
	  a.date,
	  u.login
    order by a.date desc
      `
    );
    res.status(200).send(invoiceNumbers.rows);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

export default controller;
