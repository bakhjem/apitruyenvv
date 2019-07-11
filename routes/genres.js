var express = require("express");
var router = express.Router();
const request = require("request-promise");
const cheerio = require("cheerio");
var cookieParser = require("cookie-parser");

/* GET users listing. */
router.get("/", function (req, res, next) {
  var novel = [];
  var id = req.query.id;
  var page = req.query.page;
  const URL =
    "https://247truyen.com/danh_sach_truyen?type=latest&category=";

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
  var lasterchapter = null;
  var idnovel = null;
  var idchapter = null;
  var cover = null;
  var lastupdates = [];
  var update_time = null;
  // var id = null;
  var view = null;
  var totalpages = null;
  var des = null;
  getPageContent(URL+id+'&state=all&page='+ page).then($ => {
    console.log(URL+id+'&state=all&page='+ page)
    // console.log(
    //   "http://www.nettruyen.com/tim-truyen?status=-1&sort=15&page=" + page
    // );
    // var pagett = $(".pagination-outter ul li.hidden").text();
    // totalpage = pagett.slice(pagett.search("/") + 2);
    $(".update_item").each(function (result) {
      // console.log($(this).html())
      $(this)
        .find(".nowrap a")
        .each(function () {
          novelsname = $(this).text();
          idnovel = $(this).attr('href');
          // idnovel = idnovel.slice(1)
           idnovel = idnovel.slice(idnovel.search("truyen/") + 7);
          console.log(idnovel);
        });
      $(this)
        .find(".chapter")
        .each(function () {
          lasterchapter = $(this).text();
          var chapterid = $(this).attr('href');
          idchapter = chapterid.slice(chapterid.search(idnovel + '/') + (idnovel.length + 1));
          console.log(idchapter)
        });
      $(this)
        .find("span")
        .each(function () {
          view = $(this).text();
          view = view.slice(view.search(':')+2)
        });

      $(this)
        .find("a img")
        .each(function () {
          cover = $(this).attr('src');
          // cover = 'https://webnovel.online' + cover;
          // console.log(cover);
          //   console.log(idchapter)
        });
      // $(this)
      //   .find("span:nth-child(2)")
      //   .each(function () {
      //     view = $(this).text();
      //     // console.log(cover);
      //     //   console.log(idchapter)
      //   });

      data.push({
        'novelsname': novelsname,
        'idnovel': idnovel,
        'lasterchapter': lasterchapter,
        'idchapter': idchapter,
        'cover': cover,
        'view': view,
        // 'lastupdates': lastupdates
      })
    });
    var totalpage = $('.phan-trang a:last-child').attr('href');
    if (totalpage === undefined) {
      var novels = {
        url: URL + page,
        page: page,
        data: data,
        totalpage: 1
      };

      return res.send(JSON.stringify(novels));
    }
    console.log(totalpage)
    totalpages = totalpage.slice(totalpage.search('page=') + 5);
    console.log(totalpages);
    var novels = {
      url: URL + page,
      page: page,
      data: data,
      totalpage: parseInt(totalpages)
    };

    res.send(JSON.stringify(novels));
  });
});

module.exports = router;
