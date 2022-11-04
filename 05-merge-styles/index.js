const fs = require('fs');
const path = require('path');
const folderName = 'styles';
const cssArr = [];

fs.open(path.join(__dirname, 'project-dist', 'bundle.css'), 'w', (err) => {
  if (err) throw err;
});

fs.readdir(path.join(__dirname, 'styles'), (err, files) => {
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
    fs.appendFile(path.join(__dirname, 'project-dist', 'bundle.css'), item, (err) => {
      if (err) throw err;
    });
  });
}


