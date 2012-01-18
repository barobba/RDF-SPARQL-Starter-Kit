//requires('debug', 'SparqlResults');

// Convert the results to a table format
// Render the results in a grid

// The results are turned into 

/**
 * Class: Sparql Results Painter
 */
function SparqlResultsFormatter(results) {

  /**
   * Member variables
   */
   
  if (typeof results === 'SparqlResult') {
    this.results = results;
  }
  else {
    // Leave results undefined
    alert('SparqlResultsPainter: Parameter type mistmatch.');
    console.log('SparqlResultsPainter: Parameter type mistmatch.');
  }
  
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
