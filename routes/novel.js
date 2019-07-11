var express = require("express");
var router = express.Router();
const request = require("request-promise");
const cheerio = require("cheerio");
var cookieParser = require("cookie-parser");

/* GET users listing. */
router.get("/", function (req, res, next) {
  var novel = [];
  var idnovels = req.query.id;
  const URL = "https://247truyen.com/doc_truyen/";

  const getPageContent = uri => {
    const options = {
      uri,
      headers: {
        "User-Agent": "Request-Promise"
      },
      transform: body => {
        return cheerio.load(body);
      }
    };

    return request(options);
  };
  var data = [];
  var novelsname = null;
  var author = null;
  var genresdata = [];
  var chapterlist = [];
  var dateupdate = null;
  var view = null;
  var othername = null;
  var lasterchapter = null;
  var idnovel = null;
  var idchapter = null;
  var cover = null;
  var lastupdates = [];
  var update_time = null;
  var id = null;
  var totalpages = null;
  getPageContent(URL + idnovels).then($ => {
    novelsname = $(".entry-title").text();
    cover = $('.info_image img').attr('src');
    // cover = 'https://webnovel.online'+cover;
    // othername = $(".truyen_info_right li:nth-child(1) span").text();
    author = $(".truyen_info_right li:nth-child(2) a").text();

    $(".truyen_info_right li:nth-child(3) a").each(function (result) {
      genres = $(this).text();
      idgenres = $(this).attr("href");
      // idgenres = idgenres.slice(('&category=').length,)
      var dem = idgenres.search("&state");
      idgenres = idgenres.slice(idgenres.search("category=") + 9, dem);
      //   console.log(idgenres);
      genresdata.push({
        genrename: genres,
        idgenres: idgenres
      });
    });
    status = $(".truyen_info_right li:nth-child(4) a").text();
    view = $(".truyen_info_right li:nth-child(7)").text();
    view = view.slice(view.search(': ')+1)
    // dateupdate = $(".updated").text();
    description = $("#noidungm").html();
    // description = description.slice(1,description.search('<hr>'))
    $(".chapter-list .row").each(function (result) {
      $(this)
        .find("span a")
        .each(function () {
          chaptername = $(this).text();
          var chapterid = $(this).attr("href");
          idchapter = chapterid.slice(
            chapterid.search(idnovels + "/") + (idnovels.length + 1)
          );
          chapterlist.unshift({
            chaptername: chaptername,
            idchapter: idchapter
          })
        });

    });
    novel = {
      novelsname: novelsname,
      idnovels: idnovels,
      // othername: othername,
      author: author,
      cover: cover,
      genresdata: genresdata,
      status: status,
      // dateupdate: dateupdate,
      description: description,
      chapterlist: chapterlist,
      view: view
    }
    // console.log(chapterlist);
    res.send(JSON.stringify(novel));
  });
});

module.exports = router;
