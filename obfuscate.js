import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Because you are using "type": "module" in package.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// The exact version Wappalyzer is finding
const versionToHide = '16.1.6';
const fakeVersion = '0.0.0';

const chunksDir = path.join(__dirname, '.next', 'static', 'chunks');

function scrubVersion(dir) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      scrubVersion(filePath);
    } else if (filePath.endsWith('.js')) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // If the file contains the version string, replace it
      if (content.includes(versionToHide)) {
        // Regex to replace exactly the version string
        const regex = new RegExp(versionToHide, 'g');
        content = content.replace(regex, fakeVersion);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Scrubbed version from: ${file}`);
      }
    }
  });
}

console.log('Starting version obfuscation...');
scrubVersion(chunksDir);
console.log('✅ Version strings successfully hidden from Wappalyzer!');