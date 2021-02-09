const fs = require('fs')
const path = require('path')

let source = './amazfit/5bf55eb8305da_21112018'
let amazfitData = JSON.parse(fs.readFileSync(path.join(source, '5bf55eb8305da_21112018.json'), 'utf-8'))
let data = JSON.parse(fs.readFileSync(path.join(source, 'template.json'), 'utf-8'))

/* entity
{
  "index": 19,
  "_type": 0,
  "type": "Unknown00",
  "x": 0,
  "y": 0,
  "width": 0,
  "height": 0,
  "sprite": 0
}
*/

/* sprite
{
  "index": 0,
  "data": {},
  "debug": {
    "spriteOffset": 1700,
    "length": 356
  },
  "type": "0821",
  "path": "./output/15_extract/0.bmp"
},
*/

if (amazfitData.Time) {
    data.entities.push({
      "_type": 0x40,
      "type": "HoursDigit1",
      "x": amazfitData.Time.Hours.Tens.X,
      "y": amazfitData.Time.Hours.Tens.Y,
      "width": 38,
      "height": 65,
      "sprite": 10
    })
    data.entities.push({
      "_type": 0x41,
      "type": "HoursDigit2",
      "x": amazfitData.Time.Hours.Ones.X,
      "y": amazfitData.Time.Hours.Ones.Y,
      "width": 38,
      "height": 65,
      "sprite": 10
    })

    data.entities.push({
      "_type": 0xf0,
      "type": "Icon",
      "x": amazfitData.Time.Minutes.Tens.X - 17,
      "y": amazfitData.Time.Minutes.Tens.Y + 10,
      "width": 18,
      "height": 34,
      "sprite": 43
    })

    data.entities.push({
      "_type": 0x43,
      "type": "MinutesDigit1",
      "x": amazfitData.Time.Minutes.Tens.X,
      "y": amazfitData.Time.Minutes.Tens.Y,
      "width": 38,
      "height": 65,
      "sprite": 10
    })
    data.entities.push({
      "_type": 0x44,
      "type": "MinutesDigit2",
      "x": amazfitData.Time.Minutes.Ones.X,
      "y": amazfitData.Time.Minutes.Ones.Y,
      "width": 38,
      "height": 65,
      "sprite": 10
    })
}


if (amazfitData.Date && amazfitData.Date.WeekDay) {
    data.entities.push({
      "_type": 0x40,
      "type": "DayOfWeekCZ",
      "x": amazfitData.Date.WeekDay.X,
      "y": amazfitData.Date.WeekDay.Y,
      "width": 70,
      "height": 29,
      "sprite": 20
    })
}

if (amazfitData.Activity && amazfitData.Activity.Pulse) {
    data.entities.push({
      "_type": 0x82,
      "type": "HeartRateLeft",
      "x": amazfitData.Activity.Pulse.TopLeftX + 16,
      "y": amazfitData.Activity.Pulse.TopLeftY,
      "width": 20,
      "height": 35,
      "sprite": 31
    })
}

if (amazfitData.Activity && amazfitData.Activity.Steps) {
    data.entities.push({
      "_type": 0x74,
      "type": "StepsRight",
      // "x": amazfitData.Activity.Steps.TopLeftX,
      "x": 176-5,
      "y": amazfitData.Activity.Steps.TopLeftY,
      "width": 20,
      "height": 35,
      "sprite": 31
    })
}

if (amazfitData.Battery && amazfitData.Battery.Text) {
    data.entities.push({
      "_type": 0xd4,
      "type": "BatteryPercentageRight",
      // "x": amazfitData.Battery.Text.TopLeftX,
      "x": 174-17,
      "y": amazfitData.Battery.Text.TopLeftY,
      "width": 20,
      "height": 35,
      "sprite": 31
    })
}

if (amazfitData.Date && amazfitData.Date.MonthAndDay && amazfitData.Date.MonthAndDay.Separate) {
    data.entities.push({
      "_type": 0x11,
      "type": "Month",
      "x": amazfitData.Date.MonthAndDay.Separate.Month.TopLeftX,
      "y": amazfitData.Date.MonthAndDay.Separate.Month.TopLeftY,
      "width": 20,
      "height": 35,
      "sprite": 31
    })
    data.entities.push({
      "_type": 0x30,
      "type": "Day",
      "x": amazfitData.Date.MonthAndDay.Separate.Day.TopLeftX,
      "y": amazfitData.Date.MonthAndDay.Separate.Day.TopLeftY,
      "width": 20,
      "height": 35,
      "sprite": 31
    })
}

if (amazfitData.Activity && amazfitData.Activity.Pulse) {
    data.entities.push({
      "_type": 0xf0,
      "type": "Icon",
      "x": amazfitData.Activity.Pulse.TopLeftX - 20,
      "y": amazfitData.Activity.Pulse.TopLeftY,
      "width": 35,
      "height": 36,
      "sprite": 41
    })
}

if (amazfitData.Battery && amazfitData.Battery.Text) {
    data.entities.push({
      "_type": 0xf0,
      "type": "Icon",
      "x": 174-17+5, // amazfitData.Activity.Pulse.TopLeftX - 20,
      "y": amazfitData.Battery.Text.TopLeftY,
      "width": 20,
      "height": 26,
      "sprite": 42
    })
}

// disconnected
data.entities.push({
      "_type": 0xf0,
      "type": "Icon",
      "x": 10,
      "y": 10,
      "width": 22,
      "height": 22,
      "sprite": 45
    })

// connected
data.entities.push(
    {
      "_type": 192,
      "type": "ConnectionStatusIcon",
      "x": 10,
      "y": 10,
      "width": 22,
      "height": 22,
      "sprite": 44
    })

{
    // digits
    let nmap = [1,2,3,7,8,9,10,11,12,13]
    nmap.forEach(n => {
        np = (`${n}`).padStart(4,'0')
        data.sprites.push({
          "index": data.sprites.length,
          "data": {},
          "type": "0821",
          "path": `./amazfit/5bf55eb8305da_21112018/${np}.bmp`
        })
    })

    nmap = [34,35,36,37,38,39,40,40,40,40,40]
    nmap.forEach(n => {
        np = (`${n}`).padStart(4,'0')
        data.sprites.push({
          "index": data.sprites.length,
          "data": {},
          "type": "0821",
          "path": `./amazfit/5bf55eb8305da_21112018/${np}.bmp`
        })
    })

    nmap = [24,25,26,27,28,29,30,31,32,33]
    nmap.forEach(n => {
        np = (`${n}`).padStart(4,'0')
        data.sprites.push({
          "index": data.sprites.length,
          "data": {},
          "type": "0821",
          "path": `./amazfit/5bf55eb8305da_21112018/${np}.bmp`
        })
    })

    icons = ['heart','percent','dots','connected','disconnected']
    icons.forEach(n => {
        data.sprites.push({
          "index": data.sprites.length,
          "data": {},
          "type": "0821",
          "path": `./amazfit/5bf55eb8305da_21112018/${n}.bmp`
        })
    })
}

// --- sprites ---
data.entities.push({
      "_type": 0,
      "type": "Unknown00",
      "x": 0,
      "y": 0,
      "width": 0,
      "height": 0,
      "sprite": 0
    })

/*
offset = { x: (240-176)/2, y: (240-176)/2 }
data.entities.forEach(e => {
    e.x += offset.x
    e.y += offset.y
})
*/

scale = { x: 1.3, y: 1.3 }
data.entities.forEach(e => {
    e.x *= scale.x
    e.y *= scale.y
})


console.log(JSON.stringify(data, null, 4))