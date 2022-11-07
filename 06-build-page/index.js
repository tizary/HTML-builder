const fs = require('fs');
const path = require('path');
const nameDir = 'project-dist';
let htmlStr = '';
let folderAssetsName = 'assets';

fs.readFile(path.join(__dirname, 'template.html'), "utf8", (err, data) => {
  if (err) throw err;
  htmlStr += data;

});

function createDir(nameDir, folderAssetsName) {
  fs.mkdir(path.join(__dirname, nameDir), err => {
    if (err) throw err;
    fs.mkdir(path.join(__dirname, nameDir, folderAssetsName), err => {
      if (err) throw err;
    });
  });
}

fs.readdir(path.join(__dirname), 'utf-8', (err, files) => {
  if (err) throw err;
  const res = files.every(file => file === nameDir ? false : true);
  if (!res) {
    fs.rmdir(path.join(__dirname, nameDir), { recursive:true }, err => {
      if (err) throw err;
      createDir(nameDir, folderAssetsName);
      copyAssets(folderAssetsName, nameDir);
      copyFile(nameDir);
      findComponent(nameDir);
      createNewFile(nameDir, 'style.css');
      copyCSS();
    });
  } else {
    createDir(nameDir, folderAssetsName);
    copyAssets(folderAssetsName, nameDir);
    copyFile(nameDir);
    findComponent(nameDir);
    createNewFile(nameDir, 'style.css');
    copyCSS();
  }
});

function createNewFile(nameDir, fileName) {
  fs.open(path.join(__dirname, nameDir, fileName), 'w', err =>{
    if (err) throw err;
  });
}

function copyFile(nameDir) {
  fs.copyFile(path.join(__dirname, 'template.html'), path.join(__dirname, nameDir, 'index.html'), err => {
    if (err) throw err;
  });
}

function findComponent(nameDir) {
  const folderName = 'components';
  fs.readdir(path.join(__dirname, folderName), (err, files) => {
    if (err) throw err;
    files.forEach(file => {
      fs.stat(path.join(__dirname, folderName, file), (errStat, stats) => {
        if(errStat) throw errStat;
        if (stats.isFile() && path.extname(file).slice(1) === 'html') {
          const fileName = path.basename(file, '.html');
          if (htmlStr.indexOf(`{{${fileName}}}`) !== 0) {
            find(folderName, file, fileName, nameDir);

          }
        }
      });
    });
  });
}

function find(folderName, file, fileName, nameDir) {
  fs.readFile(path.join(__dirname, folderName, file), "utf8", (err, data) => {
    if (err) throw err;
    htmlStr = htmlStr.replace(`{{${fileName}}}`, data);
    if (data)
    fs.writeFile(path.join(__dirname, nameDir, 'index.html'), htmlStr, err => {
      if (err) throw err;
    });
  });
}

function copyCSS() {
  const cssArr = [];
  const folderName = 'styles';
  fs.readdir(path.join(__dirname, folderName), (err, files) => {
    if (err) throw err;
    files.forEach(file => {
      fs.stat(path.join(__dirname, folderName, file), (errStat, stats) => {
        if(errStat) throw errStat;
        if (stats.isFile() && path.extname(file).slice(1) === 'css') {
          const stream = fs.createReadStream(path.join(__dirname, folderName, file), 'utf-8');
          let data = '';
          stream.on('data', chunk => {
            data += chunk;
            cssArr.push(data);
            writeFile(cssArr);
          });
        }
      });
    });
  });

  function writeFile(cssArr) {
    cssArr.forEach(item => {
      fs.appendFile(path.join(__dirname, 'project-dist', 'style.css'), item, (err) => {
        if (err) throw err;
      });
    });
  }
}

function copyAssets(folderAssetsName, nameDir) {
  fs.readdir(path.join(__dirname, folderAssetsName), 'utf-8', (err, files) => {
    if (err) throw err;
    files.forEach(file => {
      fs.stat(path.join(__dirname, folderAssetsName, file), (errStat, stats) => {
        if(errStat) throw errStat;
        if (stats.isFile()) {
          fs.copyFile(path.join(__dirname, folderAssetsName, file), path.join(__dirname, nameDir, folderAssetsName, file), err => {
            if (err) throw err;
          });
        } else {
          let name = folderAssetsName;
          name = name + `\\${file}`;
          createDirAssets(name);
          return copyAssets(name, nameDir);
        }
      });
    });
  });
}

function createDirAssets(name) {
  fs.mkdir(path.join(__dirname, nameDir, name), err => {
    if (err) throw err;
  });
}

