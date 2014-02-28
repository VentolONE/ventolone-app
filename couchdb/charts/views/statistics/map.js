function(doc) {
  var batteryMaxLevel = require('views/lib/params').batteryMaxLevel
  emit(require('views/lib/utils').generateKeys(doc.a, doc), {
    speed: {
      max: parseFloat(doc.s),
      min: parseFloat(doc.s),
      sum: parseFloat(doc.s),
      cubicSum: Math.pow(parseFloat(doc.s),3)
    },
    time: {
      max: parseFloat(doc.t),
      min: parseFloat(doc.t),
      sum: parseFloat(doc.t)
    },
    battery: {
      max: parseFloat(doc.b / batteryMaxLevel),
      min: parseFloat(doc.b / batteryMaxLevel),
      sum: parseFloat(doc.b / batteryMaxLevel)
    },
    count: 1
  });
}
