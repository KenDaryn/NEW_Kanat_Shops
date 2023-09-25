import express, { Request, Router, Response } from "express";
import db from "../db/db";
import { nanoid } from "nanoid";

const controller: Router = express.Router();

controller.post("/", async (req: Request, res: Response) => {
  try {
    const token = req.get("Authorization");
    const { count, summ, from, id_shop, id_item } = req.body;
    const user = await db.query("SELECT id_role FROM users WHERE token = $1", [
      token,
    ]);
    if (!user.rows.length) {
      return res.status(400).send({ message: "User not found" });
    }
    const invoiceNumber = nanoid();
    const date = new Date().toLocaleString();
    if (user.rows[0].id_role === 1) {
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
              invoice_user_id,
              invoice_number,
              id_shop)
              VALUES 
              ($1, 
              $2,
              $3,
              $4, 
              $5, 
              $6, 
              $7,
              (SELECT id FROM users WHERE token = $8),
              $9,
              $10
              )`,
          [1, from, id_item, 1, summ, summ, date, token, invoiceNumber,id_shop]
        );
        i++;
      }
      res.status(200).send({ message: "successfully" });
      }else{
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
                invoice_user_id,
                invoice_number,
                id_shop)
                VALUES 
                ($1, 
                $2,
                $3,
                $4, 
                $5, 
                $6, 
                $7,
                (SELECT id FROM users WHERE token = $8),
                $9,
                (SELECT id_shops FROM users WHERE token = $10)
                )`,
            [1, from, id_item, 1, summ, summ, date, token, invoiceNumber,token]
          );
          i++;
        }
        res.status(200).send({ message: "successfully" });
      }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

controller.get("/", async (req: Request, res: Response) => {
  try {
    const token = req.get("Authorization");
    if (!token) res.status(400).send({ message: "Token must be present" });
    const user = await db.query("SELECT id_role FROM users WHERE token = $1", [
      token,
    ]); 
      if (user.rows[0].id_role === 1) {
        const invoiceNumbers = await db.query(
        `
        select
        (select count (id) from history where invoice_number = a.invoice_number),
        a.source_name,
        i.name as "item_name",
        sum(a.qty) as "qty",
        a.price,
        sum(a.total_price) as "total_price",
        a.invoice_number,
        a.date,
        s.name as "shop_name",
        i.image,
        u.login
        from actions a
        inner join items i on i.id = a.item_id
        inner join shops s on s.id = a.id_shop
        inner join users u on u.id = a.invoice_user_id
        group by 
        a.invoice_number,
        a.source_name,
        i.name,
        a.qty,
        a.price,
        a.total_price,
        a.date,
        s.name,
        i.image,
        u.login
        order by a.date desc
        `
      );
      res.status(200).send(invoiceNumbers.rows);
    }else{
      const invoiceNumbers = await db.query(
        `
        select
        (select count (id) from history where invoice_number = a.invoice_number),
        a.source_name,
        i.name as "item_name",
        sum(a.qty) as "qty",
        a.price,
        sum(a.total_price) as "total_price",
        a.invoice_number,
        a.date,
        s.name as "shop_name",
        i.image,
        u.login
        from actions a
        inner join items i on i.id = a.item_id
        inner join shops s on s.id = a.id_shop
        inner join users u on u.id = a.invoice_user_id
        where a.id_shop in (SELECT id_shops FROM users WHERE token = $1)
        group by 
        a.invoice_number,
        a.source_name,
        i.name,
        a.qty,
        a.price,
        a.total_price,
        a.date,
        s.name,
        i.image,
        u.login
        order by a.date desc
        `,[token]
      );
      res.status(200).send(invoiceNumbers.rows);
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

controller.get("/:invoice_number", async (req: Request, res: Response) => {
  try {
    const invoice_number = req.params.invoice_number;
    const token = req.get("Authorization");
    if (!token) res.status(400).send({ message: "Token must be present" });
        const invoiceNumbers = await db.query(
        `
        select
        a.source_name,
		    a.item_id,
        i.name as "item_name",
        sum(a.qty) as "qty",
        a.price,
        sum(a.total_price) as "total_price",
        a.date,
        s.name as "shop_name",
		    a.id_shop,
        i.image,
        u.login
        from actions a
        inner join items i on i.id = a.item_id
        inner join shops s on s.id = a.id_shop
        inner join users u on u.id = a.invoice_user_id
		    where a.invoice_number = $1
        group by
		    a.item_id,
        a.invoice_number,
        a.source_name,
        i.name,
        a.qty,
        a.price,
        a.total_price,
        a.date,
        s.name,
		    a.id_shop,
        i.image,
        u.login
        order by a.date desc
        `,[invoice_number]
      );
      res.status(200).send(invoiceNumbers.rows);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


controller.delete("/:invoice_number", async (req: Request, res: Response) => {
  try {
    const id = req.params.invoice_number;
    const token = req.get("Authorization");
    if (!token) res.status(400).send({ message: "Token must be present" });
    await db.query("DELETE FROM actions WHERE invoice_number = $1", [id]);
    res.status(200).send({
      message: "Shops deleted successfully",
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

controller.put("/:invoice_number", async (req: Request, res: Response) => {
  try {
    const invoice_number = req.params.invoice_number;
    
    const {item_id, source_name, qty, price,id_shop, count} = req.body;
    
    const token = req.get("Authorization");
    if (!token) res.status(400).send({ message: "Token must be present" });
    const user_id = await db.query("SELECT id FROM users WHERE token = $1", [
      token,
    ]);
    if (!user_id.rows.length) {
      return res.status(400).send({ message: "User not found" });
    }
    const data_invoice = await db.query(
      ` select sum(qty) from actions where invoice_number = $1
          `,
      [invoice_number]
    );
  const date = new Date().toLocaleString();
  
  if(qty > count)
  {
    const total = qty - count;
    console.log('Total' + total);
    
    await db.query(
      `UPDATE 
      actions 
      set 
      source_name = $1, 
      item_id = $2, 
      price = $3, 
      total_price = $3, 
      update_date = $4, 
      id_shop = $5,
      user_id = (SELECT id FROM users WHERE token = $6),
      date = $7
      where invoice_number = $8`,
      [source_name, item_id, price, date, id_shop, token,date,invoice_number])
      let i = 0;
      while (i < total) {
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
              invoice_user_id,
              invoice_number,
              id_shop)
              VALUES 
              ($1, 
              $2,
              $3,
              $4, 
              $5, 
              $6, 
              $7,
              (SELECT id FROM users WHERE token = $8),
              $9,
              $10
              )`,
          [1, source_name, item_id, 1, price, price, date, token, invoice_number,id_shop]
        );
        i++;
      }

  }if(qty === count)
  {
    await db.query(
      `UPDATE 
      actions 
      set 
      source_name = $1, 
      item_id = $2, 
      price = $3, 
      total_price = $3, 
      update_date = $4, 
      id_shop = $5,
      user_id = (SELECT id FROM users WHERE token = $6),
      date = $7
      where invoice_number = $8`,
      [source_name, item_id, price, date, id_shop, token,date,invoice_number]
    )
  }if(qty < count)
  {
    const total = count - qty;
    await db.query(
      `DELETE actions where invoice_number = $1 limit $2`,[invoice_number,total]
    );
    await db.query(
      `UPDATE 
      actions 
      set 
      source_name = $1, 
      item_id = $2, 
      price = $3, 
      total_price = $3, 
      update_date = $4, 
      id_shop = $5,
      user_id = (SELECT id FROM users WHERE token = $6),
      date = $7
      where invoice_number = $8`,
      [source_name, item_id, price, date, id_shop, token,date,invoice_number]
    )
  }
    res.status(200).send({ message: "update was successful" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

export default controller;
