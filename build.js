const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, 'dist');
const publicPath = path.join(__dirname, 'public');
const srcPath = path.join(__dirname, 'src');

// Create dist directory if it doesn't exist
if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath);
}

// Read the files
const html = fs.readFileSync(path.join(publicPath, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(publicPath, 'style.css'), 'utf8');
const js = fs.readFileSync(path.join(publicPath, 'script.js'), 'utf8');
const talks = fs.readFileSync(path.join(srcPath, 'talks.json'), 'utf8');

// Replace the script.js fetch call with the actual data
const modifiedJs = js.replace(
  "fetch('/api/talks')",
  "new Promise(resolve => resolve({ json: () => JSON.parse(talksData) }))"
);

// Inject the data and the modified script into the HTML
const finalHtml = html
  .replace('<link rel="stylesheet" href="style.css">', `<style>${css}</style>`)
  .replace('<script src="script.js"></script>', `<script>const talksData = ${talks};</script><script>${modifiedJs}</script>`);

// Write the final HTML file
fs.writeFileSync(path.join(distPath, 'index.html'), finalHtml);

console.log('Build complete! Your serverless website is ready in the dist directory.');
