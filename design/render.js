/*
  Рендер HTML-макетів кейсів у WebP.
  Кожен файл design/<id>.html містить елементи з атрибутом data-shot="<назва>".
  Кожен такий елемент знімається окремо (з прозорим фоном, 2x) у img/cases/<id>/<назва>.webp.

  Запуск:  cd design && npm install && npm run render
  Тільки один проєкт:  node render.js verde
*/
const path = require("path");
const fs = require("fs");
const puppeteer = require("puppeteer-core");

const CHROME = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome"
].find((p) => p && fs.existsSync(p));

const PROJECTS = ["monetra", "verde", "pulse", "medisense", "cargoflow", "kavarnia", "agronova"];
const only = process.argv.slice(2);
const list = only.length ? only : PROJECTS;

(async () => {
  if (!CHROME) throw new Error("Chrome/Edge не знайдено. Вкажіть CHROME_PATH.");
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 2600, height: 2200, deviceScaleFactor: 2 });

  for (const id of list) {
    const file = path.join(__dirname, `${id}.html`);
    const out = path.join(__dirname, "..", "img", "cases", id);
    fs.mkdirSync(out, { recursive: true });

    await page.goto("file:///" + file.replace(/\\/g, "/"), { waitUntil: "networkidle0" });
    await page.evaluate(() => document.fonts.ready);

    const shots = await page.$$("[data-shot]");
    for (const el of shots) {
      const name = await el.evaluate((n) => n.dataset.shot);
      const dest = path.join(out, `${name}.webp`);
      await el.screenshot({ path: dest, type: "webp", quality: 86, omitBackground: true });
      console.log(`✓ ${id}/${name}.webp  ${(fs.statSync(dest).size / 1024).toFixed(0)} KB`);
    }
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
