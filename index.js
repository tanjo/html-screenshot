#!/usr/bin/env node

/**
 * html-screenshot
 * ver. 1.0.1
 */

const program = require('commander');
const HtmlScreenshot = require('./lib/html-screenshot.js');
const packageJson = require('./package.json');

function collect(value, previous) {
  return previous.concat([value]);
}

program
  .version(packageJson.version)
  .option('-p, --pdf', 'generae pdf')
  .option('-w, --wait-for <number>', 'The time that waits for loading.', parseInt, 3000)
  .option('-c, --click <query>', 'click selector', collect, [])
  .option('-de, --delete-element <query>', 'delete element', collect, [])
  .option('-nojs, --no-js', 'JavaScript is disabled')
  .parse(process.argv);

(async () => {
    const htmlScreenshot = new HtmlScreenshot();
    await htmlScreenshot.init();
    htmlScreenshot.waitFor = program.opts().waitFor;
    htmlScreenshot.click = program.opts().click ?? [];
    htmlScreenshot.deleteElement = program.opts().deleteElement ?? [];
    htmlScreenshot.js = program.opts().js;
    await htmlScreenshot.goto(program.args[0], true, program.opts().pdf);
    await htmlScreenshot.close();
})();
