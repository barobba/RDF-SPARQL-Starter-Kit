
$(document).ready(function(){
  
  checkboxShowHideControl('#sparql-insert-form-checkbox', '#sparql-insert-form-container');
  insertFormControl();
  clearAllGraphTriplesControl();
  
  // Show current endpoint
  $('div.current-endpoint').html($('<a />').attr('href', currentEndpoint).html(currentEndpoint));
  
  // Show current graph
  $('div.current-graph').html('&lt;'+currentGraph+'&gt;');

  // Namespaces  
  showNamespaces(namespaces);
  
  // Data
  showGraphsInUse(sparqlForReading);
  showAllTriples(sparqlForReading);
  
    
});


function clearAllGraphTriplesControl() {
  $('#clear-all-graph-triples').button();
  $('#clear-all-graph-triples').click(function(event){
    event.preventDefault();
    if (confirm('This will remove all the triples for the current graph. Press OK to proceed.')) {
      query = "DELETE FROM <" + currentGraph + ">";
      sparqlForWriting.createQuery().query( query, {
        success: function(resultsJson) {
          // TODO: Instead of refresh, this should re-load the jqGrid data.
          window.location.reload();
        },
        failure: function() { 
          alert('Clear failed'); 
        }
      });
    }
  });
}

function insertFormControl() {
  
  // Query
  var query = new SparqlQuery(currentGraph, resultLimit);
  query.command = 'insert';
  for (nsIndex in nsObjects) {
    var namespace = nsObjects[nsIndex];
    query.addNamespace(namespace);
  }
  prefixesHtml = $('<pre />').text(query.namespacesToString()).html();
  $('.prefixes').html(prefixesHtml);
  
  // Insert event
  $('.query-command a.insert').click(function(event){
    event.preventDefault();
    // Get variables
    var subject = $('#sparql-insert-form input[name=subject]').attr('value');
    var predicate = $('#sparql-insert-form input[name=predicate]').attr('value');
    var object = $('#sparql-insert-form input[name=object]').attr('value');
    if (subject && predicate && object) {
      query.addTriple(subject, predicate, object);
      //alert(query.toString());
      var sq = sparqlForWriting.createQuery();
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
  
  $('#sparql-insert-form-container a.insert').button();

}



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
    rowNum:100,
    rowList:[10,20,30],
    pager: '#pager',
    sortname: 'subject',
    //hiddengrid: true,
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
    FROM \
      <" + currentGraph + ">\
    WHERE {\
      GRAPH ?graph {\
        ?subject ?predicate ?object\
      }\
    }\
    ORDER BY ASC(?subject) ASC(?predicate) ASC(?object)\
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
        caption: 'RDF Store &lt;'+ currentGraph +'&gt;',
        colNames: ['graph', 'subject', 'predicate', 'object'],
        colModel: [
          {name:'graph', index:'graph', sortable: true, hidden: true}, 
          {name:'subject', index:'subject', sortable: true, width: 75}, 
          {name:'predicate', index:'predicate', sortable: true, width: 50}, 
          {name:'object', index:'object', sortable: true}, 
        ],
        width: 750,
        height: 500,
        /*
        grouping: true,
        groupingView: {
          groupField: ['subject'],
          groupDataSorted: true,
        },
        */
        rowNum:resultLimit,
        rowList:[10,20,30],
        pager: '#pager',
        //sortname: 'subject',
        viewrecords: true
      }); 
      
    } // end success:
  }); // end query
}

function checkboxShowHideControl(checkboxSelector, toggleSelector) {
  $(toggleSelector).hide();
  $(checkboxSelector).click(function(event){
    if (this.checked) {
      $(toggleSelector).show('fast');
    }
    else {
      $(toggleSelector).hide('fast');
    }
  });
}
