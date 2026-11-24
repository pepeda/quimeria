// Which game file the tests load: a path given as the first argument that ends in .html,
// else $QUIMERIA_HTML, else the built dist/index.html.
// html = the whole page; js = the text inside its <script> (the old check.js).
const fs = require('fs');
const path = require('path');
const arg = process.argv.slice(2).find(a => /\.html$/.test(a));
const file = path.resolve(arg || process.env.QUIMERIA_HTML || path.join(__dirname, '..', 'dist', 'index.html'));
const html = fs.readFileSync(file, 'utf8');
const js = html.slice(html.indexOf('<script>') + 8, html.lastIndexOf('</script>'));
module.exports = { file, html, js };
