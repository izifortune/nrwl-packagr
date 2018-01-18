const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { parseFiles } = require('@nrwl/schematics/src/command-line/shared');
const { affectedApps } = require('@nrwl/schematics/src/command-line/affected-apps');
const {
  readdir
} = require('fs-extra');

const pexec = (cmd) =>
  new Promise((res, rej) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        rej(stderr);
      } else {
        res(stdout);
      }
    })
  });

const allFilesInDir = (dirName) => {
  var res = [];
  fs.readdirSync(dirName).forEach(function (c) {
    var child = path.join(dirName, c);
    try {
      if (!fs.statSync(child).isDirectory()) {
        res.push(child);
      }
      else if (fs.statSync(child).isDirectory()) {
        res = res.concat(allFilesInDir(child));
      }
    }
    catch (e) { }
  });
  return res;
}

const getAffectedLibs = () => {
  const p = parseFiles(process.argv.slice(3));
  const touchedFiles = p.files;
  const config = JSON.parse(fs.readFileSync('.angular-cli.json', 'utf-8'));
  const projects = (config.apps ? config.apps : []).map(function (p) {
    return {
      name: p.name,
      isApp: p.root.startsWith('libs/'),
      files: allFilesInDir(path.dirname(p.root))
    };
  });
  if (!config.project.npmScope) {
    throw new Error(".angular-cli.json must define the npmScope property.");
  }
  return affectedApps(config.project.npmScope, projects, function (f) { return fs.readFileSync(f, 'utf-8'); }, touchedFiles);
}

module.exports = {
  getAffectedLibs,
  pexec
};
