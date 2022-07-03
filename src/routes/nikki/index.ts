import express from "express";
import axios from "axios";
import { Feed } from "feed";

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

router.get("/atom.xml", (request: express.Request, response: express.Response) => {
  const url = "https://scrapbox.io/api/pages/june29?sort=created&limit=30";

  axios.get(url).then((scrapbox) => {
    const nikkis = scrapbox.data.pages.filter((page: any) => {
      return page.title.match(nikkiRegex) && !page.title.includes("(書きかけ)");
    }).sort((a: any, b: any) => {
      return b.title.localeCompare(a.title);
    }).slice(0, 10);

    const latestNikki = nikkis[0];
    const latestNikkiDate = new Date(latestNikki.updated * 1000);

    const feed = new Feed({
      title: "june29のScrapbox日記",
      description: "june29がScrapboxで書いている日記です",
      id: "https://scrapbox.io/june29",
      link: "https://scrapbox.io/june29",
      language: "ja",
      image: "https://june29.jp/img/ring.jpg",
      favicon: "https://scrapbox.io/assets/img/favicon/favicon.ico",
      copyright: "All rights reserved " + latestNikkiDate.getFullYear() + ", june29",
      updated: latestNikkiDate,
      generator: "https://api.june29.jp/",
      feedLinks: {
        atom: "https://api.june29.jp/nikki/atom.xml"
      },
      author: {
        name: "Jun OHWADA / june29",
        email: "june29.jp@gmail.com",
        link: "https://june29.jp"
      }
    });

    nikkis.forEach((nikki: any) => {
      const link = `https://scrapbox.io/june29/${encodeURIComponent(nikki.title)}`;
      const description = nikki.descriptions.filter((line: string) => {
        return !(line.startsWith("[***") || line.startsWith("[https://gyazo.com/"));
      }).map((line: string) => {
        return "<p>" + line.replace(/(\[|\])/g, "") + "</p>";
      }).join("\n");
      const image = `<p><img src="${nikki.image}"></p>`;

      feed.addItem({
        title: nikki.title,
        description: `${description}${image}`,
        id: link,
        link: link,
        content: "",
        date: new Date(nikki.updated * 1000)
      });
    });

    response.send(feed.atom1());
  }).catch((error) => {
    console.log(error);
  });
});

router.get("/:date", (request: express.Request, response: express.Response) => {
  const date = request.params["date"];
  const url = scrapboxApiBaseUrl + date;

  axios.get(url).then((scrapbox) => {
    const nikki = scrapbox.data["relatedPages"]["links1hop"].filter((page: any) => {
      return page.title.match(nikkiRegex) && page.title.includes(date);
    })[0];
    const page_name = encodeURIComponent(nikki.title.replace(" ", "_"));

    response.redirect("https://scrapbox.io/june29/" + page_name);
  }).catch((error) => {
    console.log(error);
  });
});

export default router;
