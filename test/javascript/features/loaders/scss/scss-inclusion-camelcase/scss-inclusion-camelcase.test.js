const { matchCSS } = require('../../../../../utils');
const Scripts = require('../../../../../scripts');

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: Scripts.projectType.JS,
});

describe.each(['prod', 'dev'])('scss inclusion camel case [%s]', mode => {
  it('integration', async () => {
    await scripts[mode](async () => {
      await page.goto(`http://localhost:3000`);

      const className = await page.$eval('#scss-camelcase-inclusion', elm =>
        elm.getAttribute('class'),
      );

      await matchCSS('app', page, [
        new RegExp(`.${className}{background:#ccc;color:#000;*}`),
      ]);
    });
  });

  it('component tests', async () => {
    await scripts.test(mode);
  });
});
