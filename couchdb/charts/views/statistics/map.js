function(doc) {
  emit(require('views/lib/utils').generateKeys(doc.anemometerId, doc), {
    speed: {
      max: parseFloat(doc.speed),
      min: parseFloat(doc.speed),
      sum: parseFloat(doc.speed)
    },
    time: {
      max: parseFloat(doc.time),
      min: parseFloat(doc.time),
      sum: parseFloat(doc.time)
    },
    battery: {
      max: parseFloat(doc.battery),
      min: parseFloat(doc.battery),
      sum: parseFloat(doc.battery)
    },
    count: 1
  });
}
