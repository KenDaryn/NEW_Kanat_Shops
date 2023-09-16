import express, { Request, Router, Response } from "express";
import db from "../db/db";

const controller: Router = express.Router();

// Тут добавить проверку на наличие связки
controller.get("/", async (req: Request, res: Response) => {
  try {
    const userInfo = await db.query(`select*from shops where state = true`);
    res.status(200).send(userInfo.rows);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

controller.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const token = req.get("Authorization");
    if (!token) res.status(400).send({ message: "Token must be present" });
    const user = (
      await db.query("SELECT * FROM users WHERE token = $1", [token])
    ).rows[0];
    await db.query("DELETE FROM shops WHERE id = $1", [id]);
    res.status(200).send({
      message: "Shops deleted successfully",
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

controller.post("/", async (req: Request, res: Response) => {
  const token = req.get("Authorization");
  if (!token) res.status(400).send({ message: "Token must be present" });

  const { name, address } = req.body;
  try {
    await db.query(
      `INSERT INTO shops (
          name,
          address,
          state
         ) VALUES ($1, $2, $3)`,
      [name, address, true]
    );
    res.status(200).send({
      message: "Shops created successfully",
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

export default controller;
