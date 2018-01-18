const { getAffectedLibs, pexec } = require('./utils');

const libs = getAffectedLibs();
(async () => {
  try {
    await pexec(`node ./node_modules/.bin/jest ${libs.join(' ')}`)
  } catch (e) {
    console.error(e);
  }
})();
