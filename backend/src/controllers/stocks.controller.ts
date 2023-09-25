import express, { Request, Router, Response } from "express";
import db from "../db/db";
import ActionsSchema, { Actions } from "../models/actions.models";
import validate from "../middlewares/validateRequest";
import { nanoid } from "nanoid";
import { log } from "console";

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
    const user = await db.query("SELECT id_role FROM users WHERE token = $1", [
      token,
    ]);    
    if (user.rows[0].id_role === 1) {
      const invoiceNumbers = await db.query(
        `
        select
        row_number() OVER () AS "serial_number",
        a.item_id,
        i.name as "item_name",
        sum(a.qty) as "qty",
        sum(a.total_price) as "total_price",
      	(select price from actions where a.item_id = item_id order by date desc limit 1),
        a.id_shop,
		    s.name as "shop_name"
        from actions a
        inner join items i on i.id = a.item_id
		    inner join shops s on s.id = a.id_shop
        where a.operation_type_id = 1
        group by 
        a.item_id,
        i.name,
		    s.name,
        a.id_shop
        order by sum(a.qty)
        `
      );
      res.status(200).send(invoiceNumbers.rows);
    }else{
      const invoiceNumbers = await db.query(
      `select
      row_number() OVER () AS "serial_number",
      a.item_id,
      i.name as "item_name",
      sum(a.qty) as "qty",
      sum(a.total_price) as "total_price",
      (select price from actions where a.item_id = item_id order by date desc limit 1),
      s.name as "shop_name",
      a.id_shop
      from actions a
      inner join items i on i.id = a.item_id
      inner join shops s on s.id = a.id_shop
      where a.operation_type_id = 1
      and a.id_shop in (SELECT id_shops FROM users WHERE token = $1)
      group by 
      a.item_id,
      i.name,
      s.name,
      a.id_shop
      order by sum(a.qty)`,[token]);
      res.status(200).send(invoiceNumbers.rows);
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

controller.get("/less", async (req: Request, res: Response) => {
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
          a.item_id,
          i.name as "item_name",
          sum(a.qty) as "qty",
          sum(a.total_price) as "total_price",
          (select price from actions where a.item_id = item_id order by date desc limit 1),
          a.id_shop,
          s.name as "shop_name"
          from actions a
          inner join items i on i.id = a.item_id
          inner join shops s on s.id = a.id_shop
          where a.operation_type_id = 1
          group by 
          a.item_id,
          i.name,
          s.name,
          a.id_shop
          having sum(a.qty) < 11
          order by sum(a.qty)
          `);
      res.status(200).send(invoiceNumbers.rows);
    }else{
      const invoiceNumbers = await db.query(
        `
          select
          a.item_id,
          i.name as "item_name",
          sum(a.qty) as "qty",
          sum(a.total_price) as "total_price",
          (select price from actions where a.item_id = item_id order by date desc limit 1),
          s.name as "shop_name",
          a.id_shop
          from actions a
          inner join items i on i.id = a.item_id
          inner join shops s on s.id = a.id_shop
          where a.operation_type_id = 1
          and a.id_shop in (SELECT id_shops FROM users WHERE token = $1)
          group by 
          a.item_id,
          i.name,
          s.name,
          a.id_shop
          having sum(a.qty) < 11
          order by sum(a.qty)
          `,[token]);
      res.status(200).send(invoiceNumbers.rows);
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

controller.get("/sendClient", async (req: Request, res: Response) => {
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
            a.item_id,
            i.name as "item_name",
            sum(a.qty) as "qty",
            sum(a.total_price) as "total_price",
            (select price from actions where a.item_id = item_id order by date desc limit 1),
            a.id_shop,
            s.name as "shop_name"
            from actions a
            inner join items i on i.id = a.item_id
            inner join shops s on s.id = a.id_shop
            where a.operation_type_id = 2
            group by 
            a.item_id,
            i.name,
            s.name,
            a.id_shop
            order by sum(a.qty)
            `
      );
      res.status(200).send(invoiceNumbers.rows);
    }else{
      const invoiceNumbers = await db.query(
        `
            select
            a.item_id,
            i.name as "item_name",
            sum(a.qty) as "qty",
            sum(a.total_price) as "total_price",
            (select price from actions where a.item_id = item_id order by date desc limit 1),
            s.name as "shop_name",
            a.id_shop
            from actions a
            inner join items i on i.id = a.item_id
            inner join shops s on s.id = a.id_shop
            where a.operation_type_id = 2
            and a.id_shop = (SELECT id_shops FROM users WHERE token = $1)
            group by 
            a.item_id,
            i.name,
            s.name,
            a.id_shop
            order by sum(a.qty)
            `,[token]
      );
      res.status(200).send(invoiceNumbers.rows);
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

controller.get("/cancel", async (req: Request, res: Response) => {
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
              a.item_id,
              i.name as "item_name",
              sum(a.qty) as "qty",
              sum(a.total_price) as "total_price",
              (select price from actions where a.item_id = item_id order by date desc limit 1),
              a.id_shop,
              s.name as "shop_name"
              from actions a
              inner join items i on i.id = a.item_id
              inner join shops s on s.id = a.id_shop
              where a.operation_type_id = 4
              group by 
              a.item_id,
              i.name,
              s.name,
              a.id_shop
              order by sum(a.qty)
              `
        );
        res.status(200).send(invoiceNumbers.rows);
      }else{
        const invoiceNumbers = await db.query(
          `
              select
              a.item_id,
              i.name as "item_name",
              sum(a.qty) as "qty",
              sum(a.total_price) as "total_price",
              (select price from actions where a.item_id = item_id order by date desc limit 1),
              s.name as "shop_name",
              a.id_shop
              from actions a
              inner join items i on i.id = a.item_id
              inner join shops s on s.id = a.id_shop
              where a.operation_type_id = 4
              and a.id_shop in (SELECT id_shops FROM users WHERE token = $1)
              group by 
              a.item_id,
              i.name,
              s.name,
              a.id_shop
              order by sum(a.qty)
              `,[token]
        );
        res.status(200).send(invoiceNumbers.rows);
      }
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });

controller.get("/return", async (req: Request, res: Response) => {
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
              a.item_id,
              i.name as "item_name",
              sum(a.qty) as "qty",
              sum(a.total_price) as "total_price",
              (select price from actions where a.item_id = item_id order by date desc limit 1),
              a.id_shop,
              s.name as "shop_name"
              from actions a
              inner join items i on i.id = a.item_id
              inner join shops s on s.id = a.id_shop
              where a.operation_type_id = 3
              group by 
              a.item_id,
              i.name,
              s.name,
              a.id_shop
              order by sum(a.qty)
              `
        );
        res.status(200).send(invoiceNumbers.rows);
      }else{
        const invoiceNumbers = await db.query(
          `
              select
              a.item_id,
              i.name as "item_name",
              sum(a.qty) as "qty",
              sum(a.total_price) as "total_price",
              (select price from actions where a.item_id = item_id order by date desc limit 1),
              s.name as "shop_name",
              a.id_shop
              from actions a
              inner join items i on i.id = a.item_id
              inner join shops s on s.id = a.id_shop
              where a.operation_type_id = 3
              and a.id_shop in (SELECT id_shops FROM users WHERE token = $1)
              group by 
              a.item_id,
              i.name,
              s.name,
              a.id_shop
              order by sum(a.qty)
              `,[token]
        );
        res.status(200).send(invoiceNumbers.rows);
      }
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });

controller.get("/:id", async (req: Request, res: Response) => {
  try {
    const item_id = req.params.id;
    const parts = item_id.split("_")
    let id = parts[0]
    let id_shop = parts[1]

    const token = req.get("Authorization");
    if (!token) 
    res.status(400).send({ message: "Token must be present" });
    const user = await db.query("SELECT id_role FROM users WHERE token = $1", [
      token,
    ]);    
    if (user.rows[0].id_role === 1) {
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
        (select price from actions where a.item_id = item_id order by date desc limit 1),
        s.name as "shop_name"
        from actions a
        inner join items i on i.id = a.item_id
        inner join shops s on s.id = a.id_shop
        where a.operation_type_id = 1 and a.item_id = $1
        and a.id_shop = $2
        group by 
        a.item_id,
        i.name,
        i.image,
        i.create_date,
        s.name
          `,
        [id,id_shop]
      );
      res.status(200).send(invoiceNumbers.rows);
    } else{
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
        (select price from actions where a.item_id = item_id order by date desc limit 1),
        s.name as "shop_name",
        a.id_shop
        from actions a
        inner join items i on i.id = a.item_id
        inner join shops s on s.id = a.id_shop
        where a.operation_type_id = 1 and a.item_id = $1
        and a.id_shop in (SELECT id_shops FROM users WHERE token = $2)
        group by 
        a.item_id,
        i.name,
        i.image,
        i.create_date,
        s.name,
        a.id_shop
          `,
        [id, token]);
        res.status(200).send(invoiceNumbers.rows); 
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

controller.get("/sendClient/:id", async (req: Request, res: Response) => {
  try {
    const item_id = req.params.id;
    const parts = item_id.split("_")
    let id = parts[0]
    let id_shop = parts[1]
    
    const token = req.get("Authorization");
    if (!token) res.status(400).send({ message: "Token must be present" });
    const user = await db.query("SELECT id_role FROM users WHERE token = $1", [
      token,
    ]);    
    if (user.rows[0].id_role === 1) {
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
          (select price from actions where a.item_id = item_id order by date desc limit 1),
          s.name as "shop_name"
          from actions a
          inner join items i on i.id = a.item_id
          inner join shops s on s.id = a.id_shop
          where a.operation_type_id = 2 and a.item_id = $1
          and a.id_shop = $2
          group by 
          a.item_id,
          i.name,
          i.image,
          i.create_date,
          s.name
            `,
        [id,id_shop]
      );
      res.status(200).send(invoiceNumbers.rows);
    }else{
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
          (select price from actions where a.item_id = item_id order by date desc limit 1),
          s.name as "shop_name",
          a.id_shop
          from actions a
          inner join items i on i.id = a.item_id
          inner join shops s on s.id = a.id_shop
          where a.operation_type_id = 2 and a.item_id = $1
          and a.id_shop in (SELECT id_shops FROM users WHERE token = $2)
          group by 
          a.item_id,
          i.name,
          i.image,
          i.create_date,
          s.name,
          a.id_shop
            `,
        [id,token]
      );
      res.status(200).send(invoiceNumbers.rows);      
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

controller.get("/returnInfo/:id", async (req: Request, res: Response) => {
    try {
      const item_id = req.params.id;
      const parts = item_id.split("_")
      let id = parts[0]
      let id_shop = parts[1]
      const token = req.get("Authorization");
      if (!token) res.status(400).send({ message: "Token must be present" });
      const user = await db.query("SELECT id_role FROM users WHERE token = $1", [
        token,
      ]);    
      if (user.rows[0].id_role === 1) {
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
            (select price from actions where a.item_id = item_id order by date desc limit 1),
            s.name as "shop_name"
            from actions a
            inner join items i on i.id = a.item_id
            inner join shops s on s.id = a.id_shop
            where a.operation_type_id = 3 and a.item_id = $1
            and a.id_shop = $2
            group by 
            a.item_id,
            i.name,
            i.image,
            i.create_date,
            s.name
              `,
          [id,id_shop]
        );
        res.status(200).send(invoiceNumbers.rows);
      }else{
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
            (select price from actions where a.item_id = item_id order by date desc limit 1),
            s.name as "shop_name",
            a.id_shop
            from actions a
            inner join items i on i.id = a.item_id
            inner join shops s on s.id = a.id_shop
            where a.operation_type_id = 3 and a.item_id = $1
            and a.id_shop in (SELECT id_shops FROM users WHERE token = $2)
            group by 
            a.item_id,
            i.name,
            i.image,
            i.create_date,
            s.name,
            a.id_shop
              `,
          [id, token]   
)
res.status(200).send(invoiceNumbers.rows);
};
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });

controller.put("/sendClient/:id", async (req: Request, res: Response) => {
  try {
    const item_id = req.params.id;
    const parts = item_id.split("_")
    let id = parts[0]
    let id_shop = parts[1]
    const token = req.get("Authorization");
    if (!token) res.status(400).send({ message: "Token must be present" });
    const { count } = req.body;
    const user_id = await db.query("SELECT id FROM users WHERE token = $1", [
      token,
    ]);
    if (!user_id.rows.length) {
      return res.status(400).send({ message: "User not found" });
    }
    const data = await db.query(
      ` select
        a.item_id,
        i.create_date,
        i.name as "item_name",
        i.image,
        a.date,
        a.qty,
        a.total_price,
        a.price,
        a.invoice_number
        from actions a
        inner join items i on i.id = a.item_id
        where a.operation_type_id = 1 and a.item_id = $1 and a.id_shop = $3
        limit $2
          `,
      [id, count,id_shop]
    );
  const date = new Date().toLocaleString();
  let i = 0;
  while (i < data.rows.length) {
    await db.query(
      `
        INSERT INTO history 
        (operation_type_id, 
          item_id, 
          qty, 
          price, 
          total_price, 
          date,
          user_id,
          invoice_number,
          shop_id)
          VALUES 
          ($1, 
          $2,
          $3,
          $4, 
          $5, 
          $6, 
          (SELECT id FROM users WHERE token = $7),
          $8,
          $9
          )`,
      [ 2,
        id, 
        data.rows[i].qty, 
        data.rows[i].price, 
        data.rows[i].total_price, 
        date, 
        token, 
        data.rows[i].invoice_number,
        data.rows[i].id_shop]
    );
    i++;
  }
   // тут надо добавить цикл который будет пробегать по массиве и записывать в таблицу history
    await db.query(
      `UPDATE actions SET operation_type_id = 2, update_date = $1,
        user_id = (SELECT id FROM users WHERE token = $2)
        WHERE id in (select id from actions where item_id = $3 and operation_type_id = 1 and id_shop = $4 order by date asc limit $5)
        `,
      [date, token, parseInt(id),id_shop, count]
    );
    res.status(200).send({ message: "Update was successful" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

controller.put("/sendReturn/:id", async (req: Request, res: Response) => {
  try {
    const item_id = req.params.id;
    const parts = item_id.split("_")
    let id = parts[0]
    let id_shop = parts[1]
    const token = req.get("Authorization");
    if (!token) res.status(400).send({ message: "Token must be present" });
    const { count } = req.body;
    const user_id = await db.query("SELECT id FROM users WHERE token = $1", [
      token,
    ]);
    if (!user_id.rows.length) {
      return res.status(400).send({ message: "User not found" });
    }
    const data = await db.query(
      ` select
        a.item_id,
        i.create_date,
        i.name as "item_name",
        i.image,
        a.date,
        a.qty,
        a.total_price,
        a.price,
        a.invoice_number,
        a.id_shop
        from actions a
        inner join items i on i.id = a.item_id
        where a.operation_type_id = 2 and a.item_id = $1 and a.id_shop = $3
        limit $2
          `,
      [id, count,id_shop]
    );
  const date = new Date().toLocaleString();
  let i = 0;
  while (i < data.rows.length) {
    await db.query(
      `
        INSERT INTO history 
        (operation_type_id, 
          item_id, 
          qty, 
          price, 
          total_price, 
          date,
          user_id,
          invoice_number,
          shop_id)
          VALUES 
          ($1, 
          $2,
          $3,
          $4, 
          $5, 
          $6, 
          (SELECT id FROM users WHERE token = $7),
          $8,
          $9
          )`,
      [ 3,
        id, 
        data.rows[i].qty, 
        data.rows[i].price, 
        data.rows[i].total_price, 
        date, 
        token, 
        data.rows[i].invoice_number,
        data.rows[i].id_shop]
    );
    i++;
  }
    await db.query(
      `UPDATE actions SET operation_type_id = 3, update_date = $1,
          user_id = (SELECT id FROM users WHERE token = $2)
          WHERE id in (select id from actions where item_id = $3 and operation_type_id = 2 and id_shop = $4 order by date asc limit $5)
          `,
      [date, token, parseInt(id), id_shop,count]
    );
    res.status(200).send({ message: "Send stock was successful" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

controller.put("/sendStock/:id", async (req: Request, res: Response) => {
    try {
      const item_id = req.params.id;
      const parts = item_id.split("_")
      let id = parts[0]
      let id_shop = parts[1]
      const token = req.get("Authorization");
      if (!token) res.status(400).send({ message: "Token must be present" });
      const { count } = req.body;
      const user_id = await db.query("SELECT id FROM users WHERE token = $1", [
        token,
      ]);
      if (!user_id.rows.length) {
        return res.status(400).send({ message: "User not found" });
      }
      const data = await db.query(
        ` select
          a.item_id,
          i.create_date,
          i.name as "item_name",
          i.image,
          a.date,
          a.qty,
          a.total_price,
          a.price,
          a.invoice_number,
          a.id_shop
          from actions a
          inner join items i on i.id = a.item_id
          where a.operation_type_id = 2 and a.item_id = $1 and a.id_shop = $3
          limit $2
            `,
        [id, count,id_shop]
      );
    const date = new Date().toLocaleString();
    let i = 0;
    while (i < data.rows.length) {
      await db.query(
        `
          INSERT INTO history 
          (operation_type_id, 
            item_id, 
            qty, 
            price, 
            total_price, 
            date,
            user_id,
            invoice_number,
            shop_id)
            VALUES 
            ($1, 
            $2,
            $3,
            $4, 
            $5, 
            $6, 
            (SELECT id FROM users WHERE token = $7),
            $8,
            $9
            )`,
        [ 1,
          id, 
          data.rows[i].qty, 
          data.rows[i].price, 
          data.rows[i].total_price, 
          date, 
          token, 
          data.rows[i].invoice_number,
          data.rows[i].id_shop]
      );
      i++;
    }
      
      await db.query(
        `UPDATE actions SET operation_type_id = 1, update_date = $1,
            user_id = (SELECT id FROM users WHERE token = $2)
            WHERE id in (select id from actions where item_id = $3 and operation_type_id = 2 and id_shop = $4 order by date asc limit $5)
            `,
        [date, token, parseInt(id), id_shop, count]
      );
      res.status(200).send({ message: "Send stock was successful" });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });

controller.put("/returnSendStock/:id", async (req: Request, res: Response) => {
    try {
      const item_id = req.params.id;
      const parts = item_id.split("_")
      let id = parts[0]
      let id_shop = parts[1]
      const token = req.get("Authorization");
      if (!token) res.status(400).send({ message: "Token must be present" });
      const { count } = req.body;
      const user_id = await db.query("SELECT id FROM users WHERE token = $1", [
        token,
      ]);
      if (!user_id.rows.length) {
        return res.status(400).send({ message: "User not found" });
      }
      const data = await db.query(
        ` select
          a.item_id,
          i.create_date,
          i.name as "item_name",
          i.image,
          a.date,
          a.qty,
          a.total_price,
          a.price,
          a.invoice_number,
          a.id_shop
          from actions a
          inner join items i on i.id = a.item_id
          where a.operation_type_id = 3 and a.item_id = $1 and a.id_shop = $3
          limit $2
            `,
        [id, count,id_shop]
      );
    const date = new Date().toLocaleString();
    let i = 0;
    while (i < data.rows.length) {
      await db.query(
        `
          INSERT INTO history 
          (operation_type_id, 
            item_id, 
            qty, 
            price, 
            total_price, 
            date,
            user_id,
            invoice_number,
            shop_id)
            VALUES 
            ($1, 
            $2,
            $3,
            $4, 
            $5, 
            $6, 
            (SELECT id FROM users WHERE token = $7),
            $8,
            $9
            )`,
        [ 1,
          id, 
          data.rows[i].qty, 
          data.rows[i].price, 
          data.rows[i].total_price, 
          date, 
          token, 
          data.rows[i].invoice_number,
          data.rows[i].id_shop]
      );
      i++;
    }
      
      await db.query(
        `UPDATE actions SET operation_type_id = 1, update_date = $1,
            user_id = (SELECT id FROM users WHERE token = $2)
            WHERE id in (select id from actions where item_id = $3 and operation_type_id = 3 and id_shop = $4 order by date asc limit $5)
            `,
        [date, token, parseInt(id), id_shop, count]
      );
      res.status(200).send({ message: "Send stock was successful" });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });

controller.put("/cancel/:id", async (req: Request, res: Response) => {
  try {
    const item_id = req.params.id;
    const parts = item_id.split("_")
    let id = parts[0]
    let id_shop = parts[1]
    const token = req.get("Authorization");
    if (!token) res.status(400).send({ message: "Token must be present" });
    const { count } = req.body;
    const user_id = await db.query("SELECT id FROM users WHERE token = $1", [
      token,
    ]);
    if (!user_id.rows.length) {
      return res.status(400).send({ message: "User not found" });
    }
    const data = await db.query(
      ` select
        a.item_id,
        i.create_date,
        i.name as "item_name",
        i.image,
        a.date,
        a.qty,
        a.total_price,
        a.price,
        a.invoice_number,
        a.id_shop
        from actions a
        inner join items i on i.id = a.item_id
        where a.operation_type_id = 1 and a.item_id = $1 and a.id_shop = $3
        limit $2
          `,
      [id, count,id_shop]
    );
  const date = new Date().toLocaleString();
  let i = 0;
  while (i < data.rows.length) {
    await db.query(
      `
        INSERT INTO history 
        (operation_type_id, 
          item_id, 
          qty, 
          price, 
          total_price, 
          date,
          user_id,
          invoice_number,
          shop_id)
          VALUES 
          ($1, 
          $2,
          $3,
          $4, 
          $5, 
          $6, 
          (SELECT id FROM users WHERE token = $7),
          $8,
          $9
          )`,
      [ 4,
        id, 
        data.rows[i].qty, 
        data.rows[i].price, 
        data.rows[i].total_price, 
        date, 
        token, 
        data.rows[i].invoice_number,
        data.rows[i].id_shop]
    );
    i++;
  }
    await db.query(
      `UPDATE actions SET operation_type_id = 4, update_date = $1,
          user_id = (SELECT id FROM users WHERE token = $2)
          WHERE id in (select id from actions where item_id = $3 and operation_type_id = 1  and id_shop = $4 order by date asc limit $5)
          `,
      [date, token, parseInt(id), id_shop, count]
    );
    res.status(200).send({ message: "Cancel was successful" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

controller.put("/cancelReturn/:id", async (req: Request, res: Response) => {
    try {
      const item_id = req.params.id;
      const parts = item_id.split("_")
      let id = parts[0]
      let id_shop = parts[1]
      const token = req.get("Authorization");
      if (!token) res.status(400).send({ message: "Token must be present" });
      const { count } = req.body;
      const user_id = await db.query("SELECT id FROM users WHERE token = $1", [
        token,
      ]);
      if (!user_id.rows.length) {
        return res.status(400).send({ message: "User not found" });
      }
      const data = await db.query(
        ` select
          a.item_id,
          i.create_date,
          i.name as "item_name",
          i.image,
          a.date,
          a.qty,
          a.total_price,
          a.price,
          a.invoice_number,
          a.id_shop
          from actions a
          inner join items i on i.id = a.item_id
          where a.operation_type_id = 3 and a.item_id = $1 and a.id_shop = $3
          limit $2
            `,
        [id, count,id_shop]
      );
    const date = new Date().toLocaleString();
    let i = 0;
    while (i < data.rows.length) {
      await db.query(
        `
          INSERT INTO history 
          (operation_type_id, 
            item_id, 
            qty, 
            price, 
            total_price, 
            date,
            user_id,
            invoice_number,
            shop_id)
            VALUES 
            ($1, 
            $2,
            $3,
            $4, 
            $5, 
            $6, 
            (SELECT id FROM users WHERE token = $7),
            $8,
            $9
            )`,
        [ 4,
          id, 
          data.rows[i].qty, 
          data.rows[i].price, 
          data.rows[i].total_price, 
          date, 
          token, 
          data.rows[i].invoice_number,
          data.rows[i].id_shop]
      );
      i++;
    }
      await db.query(
        `UPDATE actions SET operation_type_id = 4, update_date = $1,
            user_id = (SELECT id FROM users WHERE token = $2)
            WHERE id in (select id from actions where item_id = $3 and operation_type_id = 3 and id_shop = $4 order by date asc limit $5)
            `,
        [date, token, parseInt(id), id_shop,count]
      );
      res.status(200).send({ message: "Cancel was successful" });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });

export default controller;
