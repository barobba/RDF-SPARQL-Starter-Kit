
function generateRandomId(key) {
  var r = Math.random();
  var id = key + r.toString();
  return id;
}

// From YUI; slightly modified
function generateRandomId2(key) {
  
  // Added key variable
  if (key) {
    var id = key;
  }
  else {
    id = '';
  }
  
  // YUI code
  var  i = 4;
  while (i--) {
    id += (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return id;
  
}
