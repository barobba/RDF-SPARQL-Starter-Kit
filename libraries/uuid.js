function getUuid(key) {
  var uuid = undefined;
  if (typeof currentUuidProvider != 'undefined') {
    
    // Try UUID provider
    $.ajax({
      url: currentUuidProvider,
      dataType: 'json',
      async: false,
      success: function(data, success, request){
        uuid = data;
      }
    });
    
  }
  if (uuid == undefined) {
    
    // Try function
    uuid = generateRandomId(key);
    
  }
  return uuid;
}
