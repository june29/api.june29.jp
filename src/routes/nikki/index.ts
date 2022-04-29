import express from "express";
import axios from "axios";

const router = express.Router();
const nikkiRegex = /^\d{4}-\d{2}-\d{2} \w{3} : /;
const scrapboxApiBaseUrl = "https://scrapbox.io/api/pages/june29/";

router.get("/", (request: express.Request, response: express.Response) => {
  const url = scrapboxApiBaseUrl + encodeURIComponent("日記");

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
  const date = request.params["date"];
  const url = scrapboxApiBaseUrl + date;

  axios.get(url).then((scrapbox) => {
    const nikki = scrapbox.data["relatedPages"]["links1hop"].filter((page: any) => {
      return page.title.match(nikkiRegex);
    })[0];
    const page_name = encodeURIComponent(nikki.title.replace(" ", "_"));

    response.redirect("https://scrapbox.io/june29/" + page_name);
  }).catch((error) => {
    console.log(error);
  });
});

export default router;
