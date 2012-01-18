function requires() {
  //console.log(this.window);
  for (argIndex in arguments) {
    var arg = arguments[argIndex];
    if (typeof arg === 'string') {
      argToken = this.window[arg];
      if (typeof argToken === 'undefined') {
        alert('The item "'+ arg +'" is required, but does not exist.');
      }
    }
  }
}
