const fs = require('fs');
const log = fs.readFileSync('build_output.txt', 'utf8');
console.log(log.substring(log.lastIndexOf('Error:')));
console.log("----");
console.log(log.substring(log.lastIndexOf('Failed to compile.')));
