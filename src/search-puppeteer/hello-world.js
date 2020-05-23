const puppeteer = require("puppeteer");

(async () => {
  const option = {
    headless: false,
    slowMo: 100,
  };

  const browser = await puppeteer.launch(option); // browserを作成
  const page = await browser.newPage(); // browserでpageを開く
  await page.goto("http://www.google.com"); // pageを移動
  await page.type(
    "#tsf > div:nth-child(2) > div.A8SBwf > div.RNNXgb > div > div.a4bIc > input",
    "puppeteer"
  );
  await page.click(
    "#tsf > div:nth-child(2) > div.A8SBwf > div.FPdoLc.tfB0Bf > center > input.gNO89b"
  );
  await page.screenshot({ path: "example.png" });

  await browser.close();
})();
