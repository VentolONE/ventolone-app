function(doc) {
  emit(doc.anemometerId, {
    speed: {
      max: parseFloat(doc.speed),
      min: parseFloat(doc.speed),
      sum: parseFloat(doc.speed),
      count: 1
    },
    time: {
      max: parseFloat(doc.time),
      min: parseFloat(doc.time),
      sum: parseFloat(doc.time),
      count: 1
    },
    battery: {
      max: parseFloat(doc.battery),
      min: parseFloat(doc.battery),
      sum: parseFloat(doc.battery),
      count: 1
    }
  });
}
