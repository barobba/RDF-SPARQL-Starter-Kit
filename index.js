
$(document).ready(function(){
  
  //
  // INITIALIZATION
  //

  // Make sure resultLimit is set
  if (!resultLimit) {
    resultLimit = 1000;
  }
  
  // Initialize SPARQL query engine
  sparql = new SPARQL.Service(currentEndpoint);
  
  // Initialize "nsObjects" variable
  nsObjects = [];
  for (nsIndex in namespaces) {
    var nsArr = namespaces[nsIndex];
    var ns = new SparqlNamespace();
    ns.prefix = nsArr['prefix'];
    ns.uri = nsArr['uri'];
    nsObjects.push(ns);
  }  
  
  // Prepare basic query
  var query = new SparqlQuery(currentGraph, resultLimit);
  query.command = 'insert';
  for (nsIndex in nsObjects) {
    var namespace = nsObjects[nsIndex];
    query.addNamespace(namespace);
  }
  
  //
  // PAGE MODIFICATIONS
  //
  
  // Update query form
  prefixesHtml = $('<pre />').text(query.namespacesToString()).html();
  $('.prefixes').html(prefixesHtml);
  $('.query-command a.insert').click(function(event){
    
    event.preventDefault();
    
    // Get variables
    var subject = $('#sparql-insert-form input[name=subject]').attr('value');
    var predicate = $('#sparql-insert-form input[name=predicate]').attr('value');
    var object = $('#sparql-insert-form input[name=object]').attr('value');
    if (subject && predicate && object) {
      
      query.addTriple(subject, predicate, object);
      var sq = sparql.createQuery();
      sq.query( query.toString(), {
        success: function(resultsJson) {
          // Refresh the page
          // TODO: Instead of refresh, this should re-load the jqGrid data.
          window.location.reload();
        },
        failure: function() { 
          alert('Insert failed'); 
        }
      });
      
    }
    else {
      alert('Triple needs to be filled in');
    }
    
  });
  
  // Show current endpoint
  $('div.current-endpoint').html($('<a />').attr('href', currentEndpoint).html(currentEndpoint));
  
  // Show current graph
  $('div.current-graph').html('&lt;'+currentGraph+'&gt;');

  // Namespaces  
  showNamespaces(namespaces);
  
  // Data
  showGraphsInUse(sparql);
  showAllTriples(sparql);
  
});

function showNamespaces() {
  $('#namespaces').jqGrid({
    datatype: 'local',
    data: namespaces,
    caption: 'Namespaces',
    colNames: ['prefix', 'uri'],
    colModel: [
      {name:'prefix', index:'prefix', sortable: true},
      {name:'uri', index:'uri', sortable: true}
    ],
    rowNum:10,
    rowList:[10,20,30],
    pager: '#pager',
    sortname: 'subject',
    hiddengrid: true,
    viewrecords: true
  }); 
}

function showGraphsInUse(sparql) {
  var query = sparql.createQuery();
  var queryString = "\
    SELECT DISTINCT\
      ?graph\
    WHERE {\
      GRAPH ?graph {\
        ?subject ?predicate ?object\
      }\
    }\
    LIMIT " + resultLimit + "\
  ";
  query.query( queryString, {
    failure: function() { 
      alert('Query failed'); 
    },
    success: function(resultsJson) {
      var results = new SparqlResultSet(resultsJson);
      for (nsIndex in namespaces) {
        results.addNamespace(namespaces[nsIndex]['prefix'], namespaces[nsIndex]['uri']);
      }
      var grid = results.toGrid();
      $('#graphs-in-use').jqGrid({
        datatype: 'local',
        data: grid,
        caption: 'Graphs In The RDF Store',
        colNames: ['graph'],
        colModel: [
          {name:'graph', index:'graph', sortable: true}
        ],
        rowNum:10,
        rowList:[10,20,30],
        pager: '#pager',
        sortname: 'subject',
        hiddengrid: true,
        viewrecords: true
      }); 
      
    } // end success:
  }); // end query
}

function showAllTriples(sparql) {
  var query = sparql.createQuery();
  var queryString = "\
    SELECT\
      *\
    WHERE {\
      GRAPH ?graph {\
        ?subject ?predicate ?object\
      }\
    }\
    LIMIT " + resultLimit + "\
  ";
  query.query( queryString, {
    failure: function() { 
      alert('Query failed'); 
    },
    success: function(resultsJson) {
      var results = new SparqlResultSet(resultsJson);
      for (nsIndex in namespaces) {
        results.addNamespace(namespaces[nsIndex]['prefix'], namespaces[nsIndex]['uri']);
      }
      var grid = results.toGrid();
      $('#all-triples').jqGrid({
        datatype: 'local',
        data: grid,
        caption: 'RDF Store (All Graphs)',
        colNames: ['graph', 'subject', 'predicate', 'object'],
        colModel: [
          {name:'graph', index:'graph', sortable: true, hidden: true}, 
          {name:'subject', index:'subject', sortable: true}, 
          {name:'predicate', index:'predicate', sortable: true}, 
          {name:'object', index:'object', sortable: true}, 
        ],
        /*
        grouping: true,
        groupingView: {
          groupField: ['subject'],
          groupDataSorted: true,
        },
        */
        rowNum:10,
        rowList:[10,20,30],
        pager: '#pager',
        sortname: 'subject',
        viewrecords: true
      }); 
      
    } // end success:
  }); // end query
}