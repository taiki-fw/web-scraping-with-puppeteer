const puppeteer = require("puppeteer");
const stringify = require("csv-stringify");
const iconv = require("iconv-lite");
const fs = require("fs");
const path = require("path");
const delay = require("delay");

const searchNewBooksNum = 10;

const getInfoFromChildPage = async (browser, url) => {
  const childPage = await browser.newPage();
  await childPage.goto(url);
  const h1Title = await childPage.evaluate(
    () => document.querySelector("h1.titleType1").textContent
  );
  const result = await childPage.evaluate(() =>
    Array.from(document.querySelectorAll("#bookSample")).map(
      (bookSample) => bookSample.innerText
    )
  );
  await childPage.close();
  result.unshift(h1Title);
  return result;
};

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 50,
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });

  await page.goto("http://www.shuwasystem.co.jp");
  // 新刊の蘭にある書籍の詳細ページへのリンクを取得
  const results = await page.evaluate(() =>
    Array.from(document.querySelectorAll("div.tool_tip > div > a")).map(
      (a) => a.href
    )
  );

  const csvData = []; // CSVに保存するための情報を保持する.
  // それぞれの新刊の詳細情報ページの情報を取得する.
  for (let i = 0; i < searchNewBooksNum; i++) {
    await delay(1000); // スクレイピングする際にはアクセス間隔を1秒あける. => 相手のサーバーに負荷をかけないように対策
    console.log(results[i]);
    const texts = await getInfoFromChildPage(browser, results[i]);
    csvData.push(texts);
  }
  console.log(csvData);

  // ここからはCSVに出力するためだけの処理.
  // csvDataを文字列化する.
  stringify(csvData, (error, csvString) => {
    const writableStream = fs.createWriteStream(
      path.join(__dirname, "/src/search-new-books/秀和システム新刊案内.csv")
    );
    writableStream.write(iconv.encode(csvString, "UTF-8"));
  });

  await browser.close();
})();
