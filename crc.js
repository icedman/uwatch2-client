var fs = require('fs');
var f = process.argv[2];

binary = fs.readFileSync(f);

function toHexString(byteArray) {
  return Array.from(byteArray, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
}

const crc16 = (bytes) => {
  let result = 65258;
  
  for (const b of bytes) {
    console.log(b)
    return ""
    let b2 = (((result & 0xff) << 8) | ((0xFF00 & result) >> 8)) ^ (b & 0xff);
    let b3 = b2 ^ ((b2 & 0xff) >> 4);
    let b4 = b3 ^ (((b3 & 0xff) << 8) << 4);
    result = b4 ^ (((b4 & 0xff) << 4) << 1);
  }
  
  return (result&0xffff).toString(16).padStart(4, '0');
}

const dump = (data) => {
    str = 'fe ';
    str += crc16(data);
    str += ' ';
    str += toHexString([data.length]);
    str += ' ';
    for (const b of data) {
        str += toHexString([b]) + ' ';
    }
    // console.log(str);
}

idx = 0;
bb = [];
for (const b of binary) {
    bb.push(b);
    if (idx++ == 255) {
        // dump(bb)
        // idx = 0;
        // bb = [];
    }    
}
// dump(bb)

console.log(JSON.stringify(bb))
