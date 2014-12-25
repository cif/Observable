/*
    Observable 
    Allows Backbone.js Model attributes to easily become ko.observable() functions.
    Instead of extending Backbone.Model, simply extend Observable.Model.
    
*/


var Observable = {

    // Observable object holds the ko.observer and reference to the model
    // so attributes can be updated via dom bindings
    // Model takes care of observing the attributes
    Model: Backbone.Model.extend({

        // holds the observable targets for bindings, accessed with dot or string notation
        observable: {},

        // initialize, if there are any observable items automatically call initObservations
      // initialize, if there are any observable items automatically call initObservations
      initialize: function(options) {
          if (this.observe){ 
            if(typeof this.observe === 'string'){
              this.makeObservation(this.observe);
            } else {
              this.observeAttributes(this.attributes);
            }
          }
      },
      
      // allows observations to be made, no argument observes all attributes
      // strings observe specific properties split on , or as arguments
      makeObservation: function () {
          var obs;
          var attrs = {};
          if (arguments.length === 1 && typeof arguments[0] === 'string') {
              obs = arguments[0].indexOf(',') > -1 ? arguments[0].split(',') : [arguments[0]];  
          } else {
              obs = arguments;
          }
          for(var prop in obs){
            if(this.attributes[obs[prop]]){
              attrs[obs[prop]] = this.attributes[obs[prop]];
            }
          }
          this.observeAttributes(attrs);
      },
      // recursive function capable of watching deep models
      observeAttributes: function (obj, dpath, silent) {
          for (var key in obj) {
              var path = typeof dpath === 'undefined' ? key : dpath + '.' + key;
              if (typeof obj[key] === 'object') {
                  this.observeAttributes(obj[key], path);
              } else {
                  this.observable[path] = new Observable.Attribute(obj[key], path, this);
              }
          }
      }
    }),

    Attribute: function(value, key, model){

        var self = this;
        // handy reference stores
        this.key = key;
        this.value = value;
        this.silent = true;
        this.model = model;
        this.observed = ko.observable(value);

        // knockout binding, updates Backbone.Model attributes
        // if you plan additional validation beyond ko binding
        this.observed.subscribe(function(updated){

            var ref = Observable.propertyFromString(self.model.attributes, self.key, true);
            var prop = self.key.substr(self.key.lastIndexOf('.')+1, self.key.length);
            ref[prop] = updated;

            // fire a change manually since we updated the attribute directly
            self.model.trigger('change', self.model, self, true);
            self.value = updated;

            // call validate if the model cares
            if(self.model.validKnockout || self.model.valid_ko){
                self.model.validate(this.model.attributes);
            }

        });

        // backbone binding:
        // updates ko observable if changed via
        // backbone Model.set()
        this.model.on('change', function(model, origin, ignore){
            if(ignore) return false; // this tells us the update came from this observable
            //  if the change affected our attribute then update knockout observable
            var changed = Observable.propertyFromString(model.changed, self.key);
            if(changed) self.observed(changed);

        });

        return this.observed;

    },
    // helper method allows strings to serve as accessors
    propertyFromString: function(obj, str, propNotValue){
        var to = propNotValue ? 1 : 0;
        var arr = str.split(".");
        while(arr.length > to){
            str = arr.shift();
            obj = obj[str];
            if(!obj) return false;
        }
        return obj;
    }
};


