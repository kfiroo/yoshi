const { matchCSS } = require('../../../../../utils');
const Scripts = require('../../../../../scripts');

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: Scripts.projectType.JS,
});

describe.each(['prod', 'dev'])('css auto prefixer [%s]', mode => {
  it('integration', async () => {
    await scripts[mode](async () => {
      await page.goto(`http://localhost:3000`);

      await matchCSS('app', page, [
        /-webkit-user-select:.+;-moz-user-select:.+;-ms-user-select:.+;user-select:.+/,
      ]);
    });
  });

  it('component tests', async () => {
    await scripts.test(mode);
  });
});
