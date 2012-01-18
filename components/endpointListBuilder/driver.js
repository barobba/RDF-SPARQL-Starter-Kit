YUI().use( 'escape', 'node-load', 'node-base', 'event-focus', 'json', 'model', 'model-list', 'view', function (Y) {

  // -------------------------------------------------------------------------
  // LOAD REMOTE COMPONENT CODE
  
  // Load component code
  var componentHtml = Y.Node.create('<div id="loaded-content">');
  componentHtml.load('components/endpointListBuilder/yui-component.html', function(key, result){

    var EndpointComponentView;
    var EndpointList;
    var EndpointItemModel;
    var EndpointItemView;
    
    // -------------------------------------------------------------------------
    // LOAD COMPONENTS
    
    var componentNode = Y.Node.create(result.responseText);  
    Y.all('div.sparql-endpoints-app').each( function(component, index, nodeList){
      component.append(componentNode.get('children'));
    });
      
    // -------------------------------------------------------------------------
    // ITEM MODEL
    
    EndpointItemModel = Y.EndpointItemModel =
    Y.Base.create( 'endpointItemModel', Y.Model, [], {
      sync: LocalStorageSync('endpoints')
    }, {
      ATTRS: {
        uri: {value: ''}
      }
    });

    // -------------------------------------------------------------------------
    // LIST OF ITEM MODELS 
    
    EndpointListOfModels = Y.EndpointListOfModels =
    Y.Base.create('endpointListOfModels', Y.ModelList, [], {
      model: EndpointItemModel,
      sync: LocalStorageSync('endpoints')
    });
    
    // -------------------------------------------------------------------------
    // COMPONENT
    
    EndpointComponentView = Y.EndpointComponentView =
    Y.Base.create( 'endpointComponentView', Y.View, [], {
      container: Y.one('#epCID1'),
      inputUri: Y.one('.endpoint-uri'),
      events: {
        // Registering event handlers for this view
        'div.item-create div.widget input.endpoint-uri': {
          keypress: 'appendUri'
        },
      },
      initializer: function(){
        // Registering observer callbacks with the model
        this.endpointList = new EndpointListOfModels();
        this.endpointList.after('add', this.add, this);
        this.endpointList.after('reset', this.reset, this);
        this.endpointList.load();
      },
      // Event handlers
      render: function(){
        return this;
      },
      add: function(event){
        var newEndpointItem = new EndpointItemView({model: event.model});
        this.container.one('div.items-list').append(newEndpointItem.render().container);
      },
      appendUri: function(event) {
        var uri;
        var KEY_ENTER = 13;
        if (event.keyCode == KEY_ENTER) {
          uri = Y.Lang.trim(this.inputUri.get('value'));
          if (!uri) {
            return;
          }
          // Add URI to list
          this.endpointList.create({uri: uri});
          // Reset textbox
          this.inputUri.set('value', '');
        }
      },
      reset: function(event) {
        var fragment = Y.one(Y.config.doc.createDocumentFragment());
        Y.Array.each(event.models, function (model) {
          var view = new EndpointItemView({model: model});
          fragment.append(view.render().container);
        });
        this.container.one('div.items-list').setContent(fragment);    }
    });
    
    // -------------------------------------------------------------------------
    // ITEM
    
    EndpointItemView = Y.EndpointItemView = 
    Y.Base.create( 'endpointItemView', Y.View, [], {
      container: '<li class="list-item"><div class="item-display"></div></li>',
      template: Y.one('#epCID1 .items-item-template').getContent(),
      events: {
        // Registering event handlers for this view
        'div.formatter .endpoint-uri': {
          click: 'edit',
          focus: 'edit'
        },
        'div.widget .endpoint-uri': {
          blur: 'save',
          keypress: 'enter'
        },
        'div.item-remove-command .command': {
          click: 'remove'
        }
      },
      initializer: function(){
        // Registering observer callbacks with the model
        var model = this.model;
        model.after('change', this.render, this);
        model.after('destroy', this.destroy, this);
      },
      // Event handlers
      render: function(){
          var container = this.container;
          var model = this.model;
          container.setContent( 
            Y.Lang.sub( this.template, {
              'endpoint-uri-update': model.getAsHTML('uri'),
              'endpoint-uri-display': model.getAsHTML('uri')
            })
          );
          this.uri = container.one('div.widget .endpoint-uri');
          return this;      
      },
      edit: function(){
        this.container.addClass('editing');
        this.uri.focus();
      },
      enter: function(event){
        var KEY_ENTER = 13;
        if (event.keyCode === KEY_ENTER) {
          Y.one('#epCID1 div.item-create .endpoint-uri').focus();
        }
      },
      remove: function(event){
        event.preventDefault();
        this.constructor.superclass.remove.call(this);
        this.model.destroy({'delete': true});
      },
      save: function(){
        this.container.removeClass('editing');
        this.model.set('uri', this.inputNode.get('value')).save();
      }
    });
    
    function LocalStorageSync(key) {

      var localStorage;
      if (!key) {
        Y.error('No storage key specified.');
      }
      if (Y.config.win.localStorage) {
        localStorage = Y.config.win.localStorage;
      }
      
      // Try to retrieve existing data from localStorage, if there is any.
      // Otherwise, initialize `data` to an empty object.
      var data = Y.JSON.parse((localStorage && localStorage.getItem(key)) || '{}');

      // Delete a model with the specified id.
      function destroy(id) {
        var modelHash;
        if ((modelHash = data[id])) {
          delete data[id];
          save();
        }
        return modelHash;
      }

      // Generate a unique id to assign to a newly-created model.
      function generateId() {
        var id = '';
        var  i = 4;
        while (i--) {
          id += (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return id;
      }

      // Loads a model with the specified id.
      function get(id) {
        return id ? data[id] : Y.Object.values(data);
      }

      // Saves the entire `data` object to localStorage.
      function save() {
        localStorage && localStorage.setItem(key, Y.JSON.stringify(data));
      }

      // Sets the id attribute of the specified model (generating a new id if
      // necessary), then saves it to localStorage.
      function set(model) {
        var hash        = model.toJSON();
        var idAttribute = model.idAttribute;
        if (!Y.Lang.isValue(hash[idAttribute])) {
          hash[idAttribute] = generateId();
        }
        data[hash[idAttribute]] = hash;
        save();
        return hash;
      }

      // Returns a `sync()` function that can be used with either a Model or a
      // ModelList instance.
      return function (action, options, callback) {
        // `this` refers to the Model or ModelList instance to which this sync
        // method is attached.
        var isModel = Y.Model && this instanceof Y.Model;
        switch (action) {
        case 'create': // intentional fallthru
        case 'update':
          callback(null, set(this));
          return;
        case 'read':
          callback(null, get(isModel && this.get('id')));
          return;
        case 'delete':
          callback(null, destroy(isModel && this.get('id')));
          return;
        }
      };
    }  

    new EndpointComponentView();
  
  });
  
});
