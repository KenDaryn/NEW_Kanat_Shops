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
    const token = req.get("Authorization");
    if (!token) res.status(400).send({ message: "Token must be present" });
    const invoiceNumbers = await db.query(
      `
      select
      a.item_id,
      i.name as "item_name",
      sum(a.qty) as "qty",
      sum(a.total_price) as "total_price",
      ROUND(avg(a.price),2) as  "avg_price"
      from actions a
      inner join items i on i.id = a.item_id
      where a.operation_type_id = 1
      group by 
      a.item_id,
      i.name
      order by sum(a.qty)
      `
    );
    res.status(200).send(invoiceNumbers.rows);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

controller.get("/less", async (req: Request, res: Response) => {
  try {
    const token = req.get("Authorization");
    if (!token) res.status(400).send({ message: "Token must be present" });
    const invoiceNumbers = await db.query(
      `
        select
        a.item_id,
        i.name as "item_name",
        sum(a.qty) as "qty",
        sum(a.total_price) as "total_price",
        ROUND(avg(a.price),2) as  "avg_price"
        from actions a
        inner join items i on i.id = a.item_id
        where a.operation_type_id = 1
        group by 
        a.item_id,
        i.name
        having sum(a.qty) < 11
        order by sum(a.qty)
        `
    );
    res.status(200).send(invoiceNumbers.rows);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

controller.get("/sendClient", async (req: Request, res: Response) => {
  try {
    const token = req.get("Authorization");
    if (!token) res.status(400).send({ message: "Token must be present" });
    const invoiceNumbers = await db.query(
      `
          select
          a.item_id,
          i.name as "item_name",
          sum(a.qty) as "qty",
          sum(a.total_price) as "total_price",
          ROUND(avg(a.price),2) as  "avg_price"
          from actions a
          inner join items i on i.id = a.item_id
          where a.operation_type_id = 2
          group by 
          a.item_id,
          i.name
          order by sum(a.qty)
          `
    );
    res.status(200).send(invoiceNumbers.rows);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

controller.get("/cancel", async (req: Request, res: Response) => {
    try {
      const token = req.get("Authorization");
      if (!token) res.status(400).send({ message: "Token must be present" });
      const invoiceNumbers = await db.query(
        `
            select
            a.item_id,
            i.name as "item_name",
            sum(a.qty) as "qty",
            sum(a.total_price) as "total_price",
            ROUND(avg(a.price),2) as  "avg_price"
            from actions a
            inner join items i on i.id = a.item_id
            where a.operation_type_id = 4
            group by 
            a.item_id,
            i.name
            order by sum(a.qty)
            `
      );
      res.status(200).send(invoiceNumbers.rows);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });

controller.get("/return", async (req: Request, res: Response) => {
    try {
      const token = req.get("Authorization");
      if (!token) res.status(400).send({ message: "Token must be present" });
      const invoiceNumbers = await db.query(
        `
            select
            a.item_id,
            i.name as "item_name",
            sum(a.qty) as "qty",
            sum(a.total_price) as "total_price",
            ROUND(avg(a.price),2) as  "avg_price"
            from actions a
            inner join items i on i.id = a.item_id
            where a.operation_type_id = 3
            group by 
            a.item_id,
            i.name
            order by sum(a.qty)
            `
      );
      res.status(200).send(invoiceNumbers.rows);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });

controller.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const token = req.get("Authorization");
    if (!token) res.status(400).send({ message: "Token must be present" });
    const invoiceNumbers = await db.query(
      ` select
      a.item_id,
      i.create_date,
      i.name as "item_name",
      i.image,
      max(a.date) as "max_date",
      min(a.date) as "min_date",
      sum(a.qty) as "qty",
      sum(a.total_price) as "total_price",
      ROUND(avg(a.price),2) as  "avg_price"
      from actions a
      inner join items i on i.id = a.item_id
      where a.operation_type_id = 1 and a.item_id = $1
      group by 
      a.item_id,
      i.name,
      i.image,
      i.create_date
        `,
      [id]
    );
    res.status(200).send(invoiceNumbers.rows);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

controller.get("/sendClient/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const token = req.get("Authorization");
    if (!token) res.status(400).send({ message: "Token must be present" });
    const invoiceNumbers = await db.query(
      ` select
        a.item_id,
        i.create_date,
        i.name as "item_name",
        i.image,
        max(a.date) as "max_date",
        min(a.date) as "min_date",
        sum(a.qty) as "qty",
        sum(a.total_price) as "total_price",
        ROUND(avg(a.price),2) as  "avg_price"
        from actions a
        inner join items i on i.id = a.item_id
        where a.operation_type_id = 2 and a.item_id = $1
        group by 
        a.item_id,
        i.name,
        i.image,
        i.create_date
          `,
      [id]
    );
    res.status(200).send(invoiceNumbers.rows);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

controller.get("/returnInfo/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const token = req.get("Authorization");
      if (!token) res.status(400).send({ message: "Token must be present" });
      const invoiceNumbers = await db.query(
        ` select
          a.item_id,
          i.create_date,
          i.name as "item_name",
          i.image,
          max(a.date) as "max_date",
          min(a.date) as "min_date",
          sum(a.qty) as "qty",
          sum(a.total_price) as "total_price",
          ROUND(avg(a.price),2) as  "avg_price"
          from actions a
          inner join items i on i.id = a.item_id
          where a.operation_type_id = 3 and a.item_id = $1
          group by 
          a.item_id,
          i.name,
          i.image,
          i.create_date
            `,
        [id]
      );
      res.status(200).send(invoiceNumbers.rows);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });

controller.put("/sendClient/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const token = req.get("Authorization");
    if (!token) res.status(400).send({ message: "Token must be present" });
    const { count } = req.body;
    const user_id = await db.query("SELECT id FROM users WHERE token = $1", [
      token,
    ]);
    if (!user_id.rows.length) {
      return res.status(400).send({ message: "User not found" });
    }
    const date = new Date().toLocaleString();
    await db.query(
      `UPDATE actions SET operation_type_id = 2, update_date = $1,
        user_id = (SELECT id FROM users WHERE token = $2)
        WHERE id in (select id from actions where item_id = $3 and operation_type_id = 1 order by date asc limit $4)
        `,
      [date, token, parseInt(id), count]
    );
    res.status(200).send({ message: "Update was successful" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

controller.put("/sendReturn/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const token = req.get("Authorization");
    if (!token) res.status(400).send({ message: "Token must be present" });
    const { count } = req.body;
    const user_id = await db.query("SELECT id FROM users WHERE token = $1", [
      token,
    ]);
    if (!user_id.rows.length) {
      return res.status(400).send({ message: "User not found" });
    }
    const date = new Date().toLocaleString();
    await db.query(
      `UPDATE actions SET operation_type_id = 3, update_date = $1,
          user_id = (SELECT id FROM users WHERE token = $2)
          WHERE id in (select id from actions where item_id = $3 and operation_type_id = 2 order by date asc limit $4)
          `,
      [date, token, parseInt(id), count]
    );
    res.status(200).send({ message: "Send stock was successful" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

controller.put("/sendStock/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const token = req.get("Authorization");
      if (!token) res.status(400).send({ message: "Token must be present" });
      const { count } = req.body;
      const user_id = await db.query("SELECT id FROM users WHERE token = $1", [
        token,
      ]);
      if (!user_id.rows.length) {
        return res.status(400).send({ message: "User not found" });
      }
      const date = new Date().toLocaleString();
      await db.query(
        `UPDATE actions SET operation_type_id = 1, update_date = $1,
            user_id = (SELECT id FROM users WHERE token = $2)
            WHERE id in (select id from actions where item_id = $3 and operation_type_id = 3 order by date asc limit $4)
            `,
        [date, token, parseInt(id), count]
      );
      res.status(200).send({ message: "Send stock was successful" });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });

controller.put("/cancel/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const token = req.get("Authorization");
    if (!token) res.status(400).send({ message: "Token must be present" });
    const { count } = req.body;
    const user_id = await db.query("SELECT id FROM users WHERE token = $1", [
      token,
    ]);
    if (!user_id.rows.length) {
      return res.status(400).send({ message: "User not found" });
    }
    const date = new Date().toLocaleString();
    await db.query(
      `UPDATE actions SET operation_type_id = 4, update_date = $1,
          user_id = (SELECT id FROM users WHERE token = $2)
          WHERE id in (select id from actions where item_id = $3 and operation_type_id = 1 order by date asc limit $4)
          `,
      [date, token, parseInt(id), count]
    );
    res.status(200).send({ message: "Cancel was successful" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

controller.put("/cancelReturn/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const token = req.get("Authorization");
      if (!token) res.status(400).send({ message: "Token must be present" });
      const { count } = req.body;
      const user_id = await db.query("SELECT id FROM users WHERE token = $1", [
        token,
      ]);
      if (!user_id.rows.length) {
        return res.status(400).send({ message: "User not found" });
      }
      const date = new Date().toLocaleString();
      await db.query(
        `UPDATE actions SET operation_type_id = 4, update_date = $1,
            user_id = (SELECT id FROM users WHERE token = $2)
            WHERE id in (select id from actions where item_id = $3 and operation_type_id = 3 order by date asc limit $4)
            `,
        [date, token, parseInt(id), count]
      );
      res.status(200).send({ message: "Cancel was successful" });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });

export default controller;
