const Scripts = require('../../../../scripts');

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: Scripts.projectType.JS,
});

describe.each(['prod'])('fails with case sensitive imports [%s]', mode => {
  it('integration', async () => {
    try {
      await scripts[mode]();
    } catch (error) {
      if (process.platform === 'darwin') {
        expect(error.message).toMatch(
          "Cannot find file: 'clientcasesensitive.js' does not match the " +
            "corresponding name on disk: './src/clientCaseSensitive.js'.",
        );
      } else {
        expect(error.message).toMatch(
          "Module not found: Can't resolve './clientcasesensitive'",
        );
      }
    }
  });
});
