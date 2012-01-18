
// Check requirements for this script
if (typeof requires === 'function') {
  requires('debug');
}

/**
 * Class: Sparql Results
 */
function SparqlResultsPainter(results) {

  /**
   * Member variables
   */
  this.results = results;
  
}

/**
 * Theme
 */
SparqlResultsPainter.prototype.theme = function(format, prefixes) {
  var themeFunctions = {
    'grid': this.themeGrid,
    'matrix': this.themeMatrix,
    'debug': this.themeDebug
  };
  if (format in themeFunctions) {
    return themeFunctions[format](prefixes);
  }
  else {
    return themeFunctions['grid'](prefixes);
  }
};

/**
 * Theme Grid
 */
SparqlResultsPainter.prototype.themeGrid = function(prefixes) {
  //var content = ConvertJsonToTable(triplesFromSparql, ['key1', 'key2'], 'matrix-'+Math.random()*100, 'generated-table');
  //return $('<div>').html(content);
  return $('<div>').html('GRID');
};

/**
 * Theme Matrix
 */
SparqlResultsPainter.prototype.themeMatrix = function(prefixes) {
  return $('<div>').html('MATRIX');
};

/**
 * Theme Debug
 */
SparqlResultsPainter.prototype.themeDebug = function(prefixes) {
  return $('<div>').html('DEBUG');
};
