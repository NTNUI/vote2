import express, { Request, Response } from "express";

export default async function login(req: Request, res: Response) {
  return res.status(200).send({
    message: "Hello auth!",
  });
}
