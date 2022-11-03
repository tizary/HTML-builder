const fs = require('fs');
const path = require('path');
const folderName = 'secret-folder';

  fs.readdir(path.join(__dirname, folderName), 'utf-8', (err, files) => {
    if (err) throw err;
    files.forEach(file => {
      fs.stat(path.join(__dirname, `${folderName}\\${file}`), (errStat, stats) => {
        if(errStat) throw errStat;
        if (stats.isFile()) {
          const fileName = file.slice(0, file.indexOf('.'));
          console.log(`${fileName} - ${path.extname(file).slice(1)} - ${stats["size"]/1000}kb`);
        }
      });
    });
  });