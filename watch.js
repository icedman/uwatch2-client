const parser = require('./parser.js');
const fs = require('fs');
const bmp = require('bmp-js');
const p = require('path');

const f = process.argv[2];

binary = fs.readFileSync(f).buffer;
let res = parser.parseWatchface(binary);
let outputDir = 'output/' + (p.parse(f.replace('.bin', '_extract')).base);

const deleteFolderRecursive = function(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

try {
    deleteFolderRecursive(outputDir);
} catch(err) {
    console.log(err.code);
}
try {
    fs.mkdirSync(outputDir);
} catch(err) {
    console.log(err.code);
}

const saveBMP = (image, name) => {
    if (!image.data || !image.width || !image.height) {
        return;
    }

    console.log(name)

    let rawData = bmp.encode(image); //defaults to no compression
    fs.writeFileSync('./' + outputDir + '/' + name, rawData.data);
}

const renderWatchface = (flag, entities, sprites) => {

  if (flag === 0) {
    let bg = { data:[], width: 240, height: 240 }
    for (let i = 0; i < 10; i++) {
      const sprite = sprites[i];
      const spr = parser.makeImage(sprite.data, 240, 24);
      saveBMP(spr, 'bg' + i + '.bmp'); //, 0, 24 * i);
      bg.data = [ ...bg.data, ...spr.data ]
    }
    saveBMP(bg, 'bg.bmp'); //, 0, 24 * i);
  }

  let dumped = {}

  for (const entity of entities) {
    const count = parser.EntitySpriteCounts[entity.type];
    for (let idx = 0; idx < count; idx++) {
        const offset = idx % count || 1;
        const sprite = sprites[entity.sprite + offset];
        if (dumped[sprite.index]) {
            continue;
        }
        dumped[sprite.index] = true;
        let x = entity.x;
        if (entity.type.endsWith('Right')) {
          x -= entity.width + 2;
        }
        if (entity.type.endsWith('Centered')) {
          x -= entity.width / 2 + 1;
        }
        if (!sprite) {
          continue;
        }
        saveBMP(
          parser.makeImage(sprite.data, entity.width, entity.height),
          sprite.index + '.bmp'
        );
    }

    // console.log('----');
    // console.log(JSON.stringify(res, null, 2))
    fs.writeFileSync(outputDir + '/data.json', JSON.stringify(res, null, 2))

  }
};

renderWatchface(res.flag, res.entities, res.sprites);


/*
let enc = parser.encodeWatchface(res);
fs.writeFileSync('tmp.bin', enc);
*/
// console.log(enc)