import express, { Router, Request, Response, NextFunction } from "express";
import { User } from "../schemas/user";

const userRouter: Router = express.Router();

/**
 * GET /user
 */
userRouter.get(
  "/:fb_id",
  async (req: Request, res: Response, next: NextFunction) => {
    const fb_id = req.params.fb_id;
    const user = await User.findOne({ fb_id: fb_id });
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send(user);
  }
);

/**
 * POST /user
 */
userRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    const fb_id = req.body.fb_id;
    const theme = req.body.theme;
    const user = await User.findOne({ fb_id: fb_id });
    if (!user) {
      const newUser = new User({
        fb_id: fb_id,
        theme: theme,
        tracked_cards: [
          {
            location_id: "65535c9d9e3c5549804b7eec",
            card_components: [],
          },
        ],
      });
      newUser.save();
      res.send(newUser);
    } else {
      res.send(user);
    }
  }
);

/**
 * POST /user/theme
 */
userRouter.post(
  "/theme",
  async (req: Request, res: Response, next: NextFunction) => {
    const fb_id = req.body.fb_id;
    const theme = req.body.theme;
    const user = await User.findOne({ fb_id: fb_id });
    if (!user) {
      return res.status(404).send("User not found");
    }
    user.theme = theme;
    user.save();
    res.send(user);
  }
);

/**
 * POST /user/tracked_cards
 */
userRouter.post(
  "/tracked_cards",
  async (req: Request, res: Response, next: NextFunction) => {
    const fb_id = req.body.fb_id;
    const tracked_cards = req.body.tracked_cards;
    const user = await User.findOne({ fb_id: fb_id });
    if (!user) {
      return res.status(404).send("User not found");
    }
    user.tracked_cards = tracked_cards;
    user.save();
    res.send(user);
  }
);

/**
 * POST /user/deleteLocation
 */
userRouter.post("/deleteLocation", async (req: Request, res: Response) => {
  const fb_id = req.body.fb_id;
  const location_id = req.body.location_id;
  const user = await User.findOne({ fb_id: fb_id });
  if (!user) {
    return res.status(404).send("User not found");
  }

  user.tracked_cards = user.tracked_cards.filter(
    (card) => card.location_id != location_id
  );
  user.save();

  res.send({ message: "Location deleted" });
});

export default userRouter;
