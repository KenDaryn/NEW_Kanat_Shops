import express, { Request, Router, Response } from "express";
import db from "../db/db";

const controller: Router = express.Router();

controller.get("/", async (req: Request, res: Response) => {
  try {
    const userInfo = await db.query(`select*from user_roles where id != 1`);
    res.status(200).send(userInfo.rows);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

export default controller;