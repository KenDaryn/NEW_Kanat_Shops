import express, { Request, Router, Response } from "express";
import { format } from "util";
import { Storage } from "@google-cloud/storage";
import db from "../db/db";
import ItemsSchema, { Items } from "../models/item.model";
import validate from "../middlewares/validateRequest";
import path from "path";
import { nanoid } from "nanoid";
import { log } from "console";
import processFile from "../middlewares/uploadsImageSmall";

const controller: Router = express.Router();

const storage = new Storage({
  projectId: "leafy-sight-398211",
  credentials: require("../../google-cloud-key.json"),
});
const bucket = storage.bucket("kanat_shop");

controller.get("/", async (req: Request, res: Response) => {
  try {
    const item = await db.query(
      `
      select
      (select count(id) from actions where i.id in (item_id)),
      *
      from items i
      where state = $1
`,
      [true]
    );

    res.status(200).send(item.rows);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

controller.get("/archive", async (req: Request, res: Response) => {
  try {
    const item = await db.query(
      `
      select
      *
      from items i
      where state = $1
`,
      [false]
    );

    res.status(200).send(item.rows);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

controller.post("/", processFile, async (req: Request, res: Response) => {
  // Тут надо поменять логику в части сначала добавить запись в бд потом добавить ссылку на фото
  // Что бы не засорять google хранилище
  try {
    const token = req.get("Authorization");
    if (!token) res.status(400).send({ message: "Token must be present" });
    const user = (
      await db.query("SELECT * FROM users WHERE token = $1", [token])
    ).rows[0];

    const { item_name } = req.body as Items;

    const create_date = new Date().toLocaleString();

    let publicUrl = "";
    const insertIntoDatabase = async () => {
      try {
        const newItem = await db.query(
          `INSERT INTO items (
            name,
            image,
            create_date,
            state
          ) VALUES ($1, $2, $3, $4)`,
          [item_name, publicUrl, create_date, true]
        );

        res.status(200).send({
          message: "Item created successfully",
          item: newItem,
        });
      } catch (error) {
        res.status(500).send({ message: error.message });
      }
    };

    if (req.file) {
      const blob = bucket.file(nanoid() + path.extname(req.file.originalname));

      const blobStream = blob.createWriteStream({
        resumable: false,
      });

      blobStream.on("error", (err) => {
        res.status(500).send({ message: err.message });
      });

      blobStream.on("finish", () => {
        publicUrl = format(
          `https://storage.googleapis.com/${bucket.name}/${blob.name}`
        );
        insertIntoDatabase();
      });

      blobStream.end(req.file.buffer);
    } else {
      insertIntoDatabase();
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

controller.put(
  "/:id",
  validate(ItemsSchema),
  async (req: Request, res: Response) => {
    try {
      const token = req.get("Authorization");
      const user = await db.query("SELECT id FROM users WHERE token = $1", [
        token,
      ]);
      if (user.rows.length === 0) {
        return res.status(401).send({ error: "Unauthorized" });
      }
      const { item_name } = req.body as Items;
      console.log(req.body);

      const id = req.params.id;
      const updatedItem = await db.query(
        `UPDATE items
          SET
            name = $1
          WHERE id = $2
          RETURNING *`,
        [item_name, id]
      );

      const updatedItemData = updatedItem.rows[0];
      res.status(200).send({
        message: "Item updated successfully",
        item: updatedItemData,
      });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
);

// Тут добавить удаление фото в google storage не сделал!!!!!!!!!!!!!!!!!!
controller.delete("/:id", async (req: Request, res: Response) => {
  // Добавить проверку на наличие записи по item
  try {
    const id = req.params.id;
    const deletedItem = await db.query(
      "DELETE FROM items WHERE id = $1 RETURNING *",
      [id]
    );

    if (deletedItem.rows.length === 0) {
      return res.status(404).send({ message: "Item not found" });
    }
    res.status(200).send({
      message: "Item deleted successfully",
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

controller.put("/archive/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await db.query("update items set state = $1 where id = $2", [false, id]);
    res.status(200).send({
      message: "Item archive successfully",
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});
controller.put("/active/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await db.query("update items set state = $1 where id = $2", [true, id]);
    res.status(200).send({
      message: "Item active successfully",
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

export default controller;
