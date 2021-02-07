var parser = require('./parser.js');
var fs = require('fs');
var f = process.argv[2];

binary = fs.readFileSync(f).buffer;
var res = parser.parseWatchface(binary);
console.log('----');
console.log(res)

var enc = parser.encodeWatchface(res);
fs.writeFileSync('tmp.bin', enc);
// console.log(enc)