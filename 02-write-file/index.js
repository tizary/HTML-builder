const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = process;

fs.open(path.join(__dirname, 'text.txt'), 'w', (err) => {
  if (err) throw err;
  console.log('Hello! Enter text:');
});


stdin.on('data', data => {
  const str = data.toString().trim();
  writeFile(str);
  if (str === 'exit') {
    exit();
  }
});

process.on('exit', () => stdout.write('Goodbye!'));

function writeFile(text) {
  fs.appendFile(path.join(__dirname, 'text.txt'), `${text}\n`, (err) => {
    if (err) throw err;
  });
}