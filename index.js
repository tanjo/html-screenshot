#!/usr/bin/env node

/**
 * html-screenshot
 * ver. 1.0.0
 */

 const HtmlScreenshot = require('./lib/html-screenshot.js');

 (async () => {
     const htmlScreenshot = new HtmlScreenshot();
     await htmlScreenshot.init();
     await htmlScreenshot.goto(process.argv[2], true);
     await htmlScreenshot.close();
 })();

