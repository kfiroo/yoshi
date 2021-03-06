const Scripts = require('../../../../../scripts');

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: Scripts.projectType.JS,
});

describe.each(['prod', 'dev'])('component svg inclusion [%s]', mode => {
  it('integration', async () => {
    await scripts[mode](async () => {
      await page.goto(`http://localhost:3000`);
      const result = await page.$eval(
        '#component-svg-inclusion',
        elm => elm.innerHTML,
      );

      expect(result).toMatch(/(<svg)([^<]*|[^>]*)/);
    });
  });

  it('component tests', async () => {
    await scripts.test(mode);
  });
});
