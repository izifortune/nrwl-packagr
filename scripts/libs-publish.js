const { readdir } = require('fs-extra');
const { pexec } = require('./utils');


const publishLibs = async (dirs) => {
  for (let dir of dirs) {
    const publishResult = await pexec(`npm publish @common/${dir}`);
  }
}

(async () => {
  const dirs = await readdir('./@common');
  await publishLibs(dirs);
})()
