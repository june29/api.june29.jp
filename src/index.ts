import express from "express";
import nikkiRouter from "./routes/nikki/index";

const app = express();

app.set("view engine", "pug");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = express.Router();
router.get("/", (request: express.Request, response: express.Response) => {
  response.render("index", { layout: "layout", title: "Hello" });
});

app.use("/", router);
app.use("/nikki", nikkiRouter);

const port = process.env.PORT || 3000;

app.listen(port);
console.log("The app listening on port " + port);
