const { getAffectedLibs } = require('./utils');

const libs = getAffectedLibs();
console.log(libs.join(' '));
