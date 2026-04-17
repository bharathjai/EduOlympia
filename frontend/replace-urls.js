const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const frontendSrcDir = path.join(__dirname, 'src');

walkDir(frontendSrcDir, (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.js')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Replace 'http://localhost:5000/api...' with `${process.env.NEXT_PUBLIC_API_URL}/api...`
    // Handle single quotes
    content = content.replace(/'http:\/\/localhost:5000(.*?)'/g, '`${process.env.NEXT_PUBLIC_API_URL}$1`');
    // Handle double quotes
    content = content.replace(/"http:\/\/localhost:5000(.*?)"/g, '`${process.env.NEXT_PUBLIC_API_URL}$1`');
    // Handle backticks (template literals that already use variables)
    content = content.replace(/`http:\/\/localhost:5000(.*?)`/g, '`${process.env.NEXT_PUBLIC_API_URL}$1`');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});
