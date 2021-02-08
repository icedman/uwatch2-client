const parser = require('./parser.js');
const fs = require('fs');
const bmp = require('bmp-js');
const p = require('path');

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

const saveBMP = (image, name) => {
    if (!image.data || !image.width || !image.height) {
        return;
    }
    console.log(name);
    let rawData = bmp.encode(image); //defaults to no compression
    fs.writeFileSync(name, rawData.data);
}

const loadBMP = (path) => {
    let buffer = fs.readFileSync(path);
    return bmp.decode(buffer);
}

const renderBitmaps = (res, outputDir) => {
  let preview
  let { flag, entities, sprites } = res
  if (flag === 0) {
    let bg = { data:[], width: 240, height: 240 }
    for (let i = 0; i < 10; i++) {
      const sprite = sprites[i];
      const spr = parser.dataViewToImage(sprite.data, 240, 24);
      const filePath = './' + outputDir + '/bg' + i + '.bmp';
      saveBMP(spr, filePath);
      sprite.path = filePath;
      bg.data = [ ...bg.data, ...spr.data ]

      // test
      // let dd = parser.imageToDataView(spr, 240, 24);
      // let rle = parser.encodeRle(dd);
      // let dle = parser.decodeRle(rle, 0, rle.byteLength);
      // let img = parser.dataViewToImage(dle, 240, 24);
      // saveBMP(img, './' + outputDir + '/bgX.bmp');
    }
    saveBMP(bg, './' + outputDir + '/bg.bmp');
    preview = bg
  }

  if (!preview) {
    const img = new Uint16Array(1e6);
    img.fill(0,0,240*240)
    preview = { data: img, width: 240, height: 240 };
  }

  let dumped = {}
  res.spriteUse = {}

  for (const entity of entities) {
    const count = parser.EntitySpriteCounts[entity.type];
    for (let idx = 0; idx < count; idx++) {
        const offset = idx % count || 1;
        const sprite = sprites[entity.sprite + offset];
        sprite.bitmaps = sprite.bitmaps || [];
        res.spriteUse[entity.sprite] = (res.spriteUse[entity.sprite] || 1)
        if (dumped[sprite.index]) {
            if (idx === 0) {
              res.spriteUse[entity.sprite] += 1;
            }
            continue;
        }
        dumped[sprite.index] = 1;
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

        const filePath = './' + outputDir + '/' + sprite.index + '.bmp';
        let bitmap = parser.dataViewToImage(sprite.data, entity.width, entity.height);
        saveBMP(bitmap, filePath);
        sprite.path = filePath;
    }

    // console.log('----');
    // console.log(JSON.stringify(res, null, 2))
    fs.writeFileSync(outputDir + '/data.json', JSON.stringify(res, null, 2))

  }

  return preview;
};

const cleanDir = (path) => {
  try {
      deleteFolderRecursive(path);
  } catch(err) {
      console.log(err.code);
  }
  try {
      fs.mkdirSync(path);
  } catch(err) {
      console.log(err.code);
  }
}

//------------------------
// decompile
//------------------------
const decompile = (path) => {
  console.log('decompile:' + path);
  let baseName = (p.parse(path).base.replace('.bin', ''));
  let outputDir = 'output/' + baseName + '_extract';
  cleanDir(outputDir);
  
  let binary = fs.readFileSync(path).buffer;
  console.log(outputDir);
  console.log(path);
  // console.log(binary);
  let res = parser.decodeWatchface(binary);
  
  let preview = renderBitmaps(res, outputDir);
  if (preview) {
    saveBMP(preview, `./output/${baseName}.bmp`);
  }
}

const compile = (path) => {
  console.log('compile:' + path);
  let file = JSON.parse(fs.readFileSync(p.join(path, 'data.json'), 'utf-8'));
  console.log(JSON.stringify(file, null, 4))


  /*
  let enc = parser.encodeWatchface(res);
  fs.writeFileSync('tmp.bin', enc);
  */
  // console.log(enc)

}

let opt = process.argv[2];
let f = process.argv[process.argv.length-1] || '';
if (!/\.bin/.exec(f) && opt[0] != '-') {
  opt = '-d';
}

// compile
if (opt === '-c') {
  try {
    compile(p.join(f));
  } catch(err) {
    console.log(err);
  }
// decompile directory
} else if (opt === '-d') {
  fs.readdirSync(f).forEach(file => {
    try {
      decompile(p.join(f, file));
    } catch(err) {
      console.log(err);
    }
  });
// decompile file
} else {
  decompile(opt);
}

