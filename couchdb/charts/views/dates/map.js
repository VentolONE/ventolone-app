function(doc) {
  if(parseFloat(doc.time)){
    emit([doc.anemometerId], parseFloat(doc.time));
  }
}