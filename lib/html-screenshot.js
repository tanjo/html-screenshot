/**
 * html-screenshot
 * ver. 1.0.0
 */

const path = require('path');
const puppeteer = require('puppeteer');

module.exports = class HtmlScreenshot {
  constructor(headless) {
    this.url = 'https://supership.jp/';
    if (headless === false) {
      this.headless = false;
    } else {
      this.headless = true;
    }
    this.waitFor = 3000;
    this.click = [];
  }

  async init() {
    this.browser = await puppeteer.launch({ headless: this.headless, args: ['--lang=ja,en-US,en'] });
    this.page = await this.browser.newPage();
    this.page.setViewport({ width: 1920, height: 1080 });
  }

  async goto(url, isScreenshot=false, isPdf=false) {
    console.log(`goto ${url}`);
    if (!url) {
      return;
    }
    if (url.startsWith('http')) {
      await this.page.goto(url, { waitUntil: 'networkidle0', timeout: 5000 });
    } else {
      let filepath = 'file://' + path.resolve(url);
      await this.page.goto(filepath, { waitUntil: 'networkidle0', timeout: 5000 });
    }

    await this._intercept();

    const title = await this.page.title();
    if (isScreenshot) {
      await this.createScreenshot(title);
    }
    if (isPdf) {
      await this.crreatePdf(title);
    }
  }

  async _intercept() {
    await this.page.waitFor(this.waitFor);

    if (this.click.length > 0) {
      for (var i = 0; i < this.click.length; i++) {
        console.log(`click ${this.click[i]}`);
        await this.page.click(this.click[i]);
      }
      await this.page.waitFor(this.waitFor);
    }
  }

  async createScreenshot(title) {
    await this.page.screenshot({ path: `${process.cwd()}/${title}.png`, fullPage: true });
    console.log(`Create: ${process.cwd()}/${title}.png`);
  }

  async crreatePdf(title) {
    if (this.headless) {
      await this.page.pdf({ path: `${process.cwd()}/${title}.pdf`, printBackground: true, format: 'A4', scale: 100 / 100 });
      console.log(`Create: ${process.cwd()}/${title}.pdf`);
    }
  }

  async close() {
    await this.browser.close();
  }
};