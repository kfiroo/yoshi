const path = require('path');
const fs = require('fs-extra');
const Scripts = require('../../../../scripts');

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: Scripts.projectType.TS,
});

const workerFilePath = path.join(scripts.testDirectory, 'src/worker.ts');

describe.each(['dev'])('hmr, web-worker [%s]', mode => {
  it.skip('refresh the browser after changes in the web-worker', async () => {
    await scripts[mode](async () => {
      const originalLog = 'hello from a web worker';
      const overriddenLog = 'hello from the other side';

      await page.goto(`http://localhost:3000`);

      await page.waitForFunction(
        `document.querySelector('h1').innerText === 'hello from a web worker'`,
      );

      // change worker file to contain different log
      const originalContent = fs.readFileSync(workerFilePath, 'utf-8');
      const editedContent = originalContent.replace(originalLog, overriddenLog);
      fs.writeFileSync(workerFilePath, editedContent);

      // wait for a refresh & new log in the console
      await page.waitForNavigation();
      await page.waitForFunction(
        `document.querySelector('h1').innerText === 'hello from the other side'`,
      );

      // revert the change
      fs.writeFileSync(workerFilePath, originalContent);

      // wait for a refresh & back to original log
      await page.waitForNavigation();
      await page.waitForFunction(
        `document.querySelector('h1').innerText === 'hello from a web worker'`,
      );
    });
  });

  it.skip('shows error overlay on the browser', async () => {
    await scripts[mode](async () => {
      // There is a jest-puppeteer listener that throws an error in case there is
      // a runtime error in the page. while this is generally a good thing,
      // in this tests we create a runtime error and don't want the browser to exit
      // we want to remove the listener, but only from this test, therefore the hack below
      // https://github.com/smooth-code/jest-puppeteer/blob/85a1122c3cb970b5b7979af7e6900eeb23c20c86/packages/jest-environment-puppeteer/src/PuppeteerEnvironment.js#L109
      page.removeAllListeners();

      // change worker file to contain something that will raise a compilation error
      const originalContent = fs.readFileSync(workerFilePath, 'utf-8');
      fs.writeFileSync(workerFilePath, '>>>error');

      await page.goto(`http://localhost:3000`);

      await page.waitForSelector('#webpack-dev-server-client-overlay');

      // revert the change
      fs.writeFileSync(workerFilePath, originalContent);

      // wait for a refresh
      await page.waitForNavigation();

      // After we've removed the listeners from the page,
      // we reset the page to not effect other tests
      await jestPuppeteer.resetPage(); // eslint-disable-line
    });
  });
});
