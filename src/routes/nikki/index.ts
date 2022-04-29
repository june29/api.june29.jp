import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/", (request: express.Request, response: express.Response) => {
  const url = "https://scrapbox.io/api/pages/june29/" + encodeURIComponent("日記");
  const nikkiRegex = /^\d{4}-\d{2}-\d{2} \w{3} : /

  axios.get(url).then((scrapbox) => {
    const nikkis = scrapbox.data["relatedPages"]["links1hop"].filter((page: any) => {
      return page.title.match(nikkiRegex);
    }).sort((a: any, b: any) => {
      return b.title.localeCompare(a.title);
    });
    response.render("nikki/index", { layout: "layout", title: "Nikki", nikkis: nikkis });
  }).catch((error) => {
    console.log(error);
  });

});

router.get("/:date", (request: express.Request, response: express.Response) => {
  response.status(200).json({ message: "nikki/:date" });
});

export default router;
