import express from "express";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = express.Router();
router.get("/", (request: express.Request, response: express.Response) => {
  response.status(200).json({ message: "api.june29.jp" });
});

app.use("/", router);

const port = process.env.PORT || 3000;

app.listen(port);
console.log("The app listening on port " + port);
