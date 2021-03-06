#!/usr/bin/env node

/**
 * html-screenshot
 * ver. 1.0.1
 */

const program = require('commander');
const HtmlScreenshot = require('./lib/html-screenshot.js');

function collect(value, previous) {
  return previous.concat([value]);
}

program
  .version('1.0.1')
  .option('-p, --pdf', 'generae pdf')
  .option('-w, --wait-for <number>', 'The time that waits for loading.', parseInt, 3000)
  .option('-c, --click <query>', 'click selector', collect, [])
  .parse(process.argv);

(async () => {
    const htmlScreenshot = new HtmlScreenshot();
    await htmlScreenshot.init();
    htmlScreenshot.waitFor = program.waitFor;
    htmlScreenshot.click = program.click;
    await htmlScreenshot.goto(program.args[0], true, program.pdf);
    await htmlScreenshot.close();
})();

