const { getAffectedLibs, pexec } = require("./utils");

const buildLibs = async (apps, rest) => {
  if (apps.length > 0) {
    console.log("Building " + apps.join(', '));
    for (app of apps) {
      await pexec("./node_modules/.bin/ng-packagr -p libs/" + app + "/package.json", { stdio: [0, 1, 2]});
    }
  }
  else {
    console.log('No apps to build');
  }
}

(async () => {
  try {
    const libs = getAffectedLibs();
    await buildLibs(libs, {});
  } catch (e) {
    console.error(e);
  }
})();
