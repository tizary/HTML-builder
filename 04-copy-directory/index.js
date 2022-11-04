const fs = require('fs');
const path = require('path');
let nameDir = 'files-copy';

function copyDir() {
  fs.readdir(path.join(__dirname), 'utf-8', (err, files) => {
    if (err) throw err;
    const res = files.every(file => file === 'files-copy' ? false : true);
    if (!res) {
      fs.rmdir(path.join(__dirname, nameDir), { recursive:true }, err => {
        if (err) throw err;
        createDir(nameDir);
        copyNewFile(nameDir);
      });
    } else {
      createDir(nameDir);
      copyNewFile(nameDir);
    }
  });
}

copyDir();

function createDir(nameDir) {
  fs.mkdir(path.join(__dirname, nameDir), err => {
    if (err) throw err;
  });
}

function copyNewFile(nameDir) {
  fs.readdir(path.join(__dirname, 'files'), 'utf-8', (err, files) => {
    if (err) throw err;
    files.forEach(file => {
      fs.copyFile(path.join(__dirname, `files\\${file}`), path.join(__dirname, `${nameDir}\\${file}`), err => {
        if (err) throw err;
      });
    });
  });
}