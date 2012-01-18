/**
 * String.startsWith
 *
 * @param str string String to evaluate
 *
 * @see http://stackoverflow.com/questions/646628/javascript-startswith
 */
if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
    return this.slice(0, str.length) == str;
  };
}

/**
 * String.endsWith
 *
 * @param str string String to evaluate
 *
 * @see http://stackoverflow.com/questions/646628/javascript-startswith
 */
if (typeof String.prototype.endsWith != 'function') {
  String.prototype.endsWith = function (str){
    return this.slice(-str.length) == str;
  };
}

/**
 * String.format
 *
 * @author Afshin Mehrabani <afshin dot meh at gmail dot com>
 */
if (typeof String.prototype.format != 'function') {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : '{' + number + '}'
      ;
    });
  };
}
