import express from "express";

const router = express.Router();

router.get("/", (request: express.Request, response: express.Response) => {
  response.status(200).json({ message: "nikki" });
});

router.get("/:date", (request: express.Request, response: express.Response) => {
  response.status(200).json({ message: "nikki/:date" });
});

export default router;
