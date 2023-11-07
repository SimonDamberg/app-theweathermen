import express, { Router, Request, Response, NextFunction } from "express";
import { SMHI } from "../schemas/smhi";

const smhiRouter: Router = express.Router();

/**
 * GET /smhi
 * TODO
 */
smhiRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const smhi = await SMHI.find();
  res.send(smhi);
});

export default smhiRouter;