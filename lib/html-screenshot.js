/**
 * html-screenshot
 * ver. 1.0.0
 */

const path = require('path');
const readline = require('readline');
const puppeteer = require('puppeteer');

module.exports = class HtmlScreenshot {
  constructor(headless) {
    this.url = 'https://supership.jp/';
    if (headless === false) {
      this.headless = false;
    } else {
      this.headless = true;
    }
  }

  async init() {
    this.browser = await puppeteer.launch({ headless: this.headless, args: ['--lang=ja,en-US,en'] });
    this.page = await this.browser.newPage();
    this.page.setViewport({ width: 1920, height: 1080 });
  }

  async goto(path, isScreenshot=false, isPdf=false) {
    console.log(`goto ${path}`);
    if (!path) {
      return;
    }
    if (path.startsWith('http')) {
      await this.page.goto(path, { waitUntil: 'networkidle0', timeout: 5000 });
    } else {
      let filepath = 'file://' + path;
      await this.page.goto(filepath, { waitUntil: 'networkidle0', timeout: 5000 });
    }
    await this.page.waitFor(3000);
    const title = await this.page.title();
    if (isScreenshot) {
      await this.createScreenshot(title);
    }
    if (isPdf) {
      await this.crreatePdf(title);
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