import express, { Request, Router, Response } from "express";
import db from "../db/db";
import UserSchema, { Users } from "../models/users.model";
import validate from "../middlewares/validateRequest";
import { nanoid } from "nanoid";

const controller: Router = express.Router();

controller.post(
  "/",
  validate(UserSchema),
  async (req: Request, res: Response) => {
    try {
      const { username, password, id_shops } = req.body as Users;
      const user = await db.query("SELECT * FROM users WHERE login = $1", [
        username,
      ]);
      if (user.rows.length > 0) {
        return res.status(400).send({
          message: "User already exist!",
        });
      }
      const date = new Date().toLocaleString();
      const newUser = await db.query(
        `INSERT INTO users
            (login, password, id_role, create_date, id_shops, blocked)
            VALUES ($1, $2, $3, $4, $5, $6)`,
        [username, password, 2, date, id_shops, false]
      );
      res.status(200).send(newUser.rows[0]);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }
);

controller.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body as Users;
    const user = await db.query("SELECT * FROM users WHERE login = $1", [
      username,
    ]);
    if (user.rows.length === 0) {
      return res.status(401).send({ message: "Username not found!" });
    }
    const passwordUser = await db.query(
      "SELECT password from users where login = $1",
      [username]
    );
    console.log(passwordUser +' Пароль с базы');
    console.log('Пароль который быд получен ' +  password);
    
    if (passwordUser.rows[0].password !== password) {
      // return res.status(400).send({ message: "Wrong password" });
      return res.status(400).send({ message: passwordUser.rows[0] });
    }
    const token = nanoid();
    const userSetToken = await db.query(
      `UPDATE users SET 
                    token = $1
                    WHERE login = $2
                    RETURNING *`,
      [token, username]
    );
    const authorizedUser = await db.query(
      `select
            u.id,
            u.login,
            u.token,
            r.role,
            u.blocked
            from users u
            left join user_roles r on r.id = u.id_role
            where u.login = $1`,
      [username]
    );
    res.status(200).send(authorizedUser.rows[0]);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

controller.post("/change", async (req: Request, res: Response) => {
  try {
    const { username, password, id_shops } = req.body as Users;
    console.log(req.body);

    const user = await db.query("SELECT * FROM users WHERE login = $1", [
      username,
    ]);
    if (user.rows.length === 0) {
      return res.status(401).send({ message: "Username not found!" });
    }
    const date = new Date().toLocaleString();
    if (id_shops) {
      await db.query(
        `
        update users
        set password = $1,
        id_shops = $2,
        last_update_date = $3
        where login = $4
        `,
        [password, id_shops as Number, date, username]
      );
    } else {
      await db.query(
        `
        update users
        set password = $1,
        last_update_date = $2
        where login = $3
        `,
        [password, date, username]
      );
    }
    res.status(200).send({ message: "update successfull" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

controller.delete("/logout", async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).send({ error: "Unauthorized" });
    }

    const user = await db.query(`SELECT * from users WHERE token = $1`, [
      token,
    ]);

    if (user.rowCount === 0) {
      return res.status(200).send({ message: "Logout successfull!" });
    }

    const dropToken = null;
    const resetToken = await db.query(
      `UPDATE users SET 
                    token = $1
                    WHERE token = $2
                    RETURNING *`,
      [dropToken, token]
    );

    res.status(200).send({ message: "Logout successful" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

controller.get("/", async (req: Request, res: Response) => {
  try {
    const userInfo = await db.query(
      `select
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
      order by u.create_date desc`
    );

    res.status(200).send(userInfo.rows);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

export default controller;
