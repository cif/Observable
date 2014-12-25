Observable
==========

Allows Backbone.Model attributes to easily become ko.observable() functions making two way binding with the DOM super easy in Backbone apps.

Why?
==========

If you want to use Knockout's super convenient bindings but also want to leverage Backbone functionality, this super simple library has your back. [View the demo page](http://cif.github.io/Observable/).

How?
==========

**Observable.Model** wraps each Backbone.Model attribute in an `Observable.Attribute` which contains a `ko.observable()` function property and subscribes to it. `Observable.Attribute` also maintains a reference to the model and listens for changes to its attribute that come from within the application, in turn passing that value on to the observable function which updates the DOM automatially.

Observable.Model supports complex attribute structures recursively. By default, all attributes are observed however the `observe:` property allows you to specify which fields you want to observe which can avoid excess overhead when observing large models.

Usage
=========

Javascript:

    var Contact = Observable.Model.extend({
      observe:'name,email,phone'
    }); 

    var ContactViewModel = function(){
      
       this.contact = new Contact({
         name:'Ben Ipsen',
         phone:'555-555-5555',
         email:'email@benipsen.com',
         company:{
           name:'Creative Informations',
           location:'Bend, Oregon'
         }
       });
      
       // add observations programatically
       // make sure to add any additional observeers 
       // before calling ko.applyBindings
       this.contact.makeObservation('company');
      
       // apply bindings
       ko.applyBindings(this);
       
       this.updatePhone = function(phone){
         this.model.set('phone', phone); // automatically updates!
         // NO LONGER NEEDED: $('.phone').text(phone);
       };
       
    };
   

Markup:

Apply bindings as you normally would with Knockout. Note that observable properties of models are stored as string references accessible with dot syntax instead of a deep copy (for now). Eventually, a more "legit" method of access might be nice. See `Observable.propertyFromString` for details.

     <h2 data-bind="text: contact.observable['phone']"></h2>
     <h4 data-bind="text: contact.observable['company.name']"></h4>
     <input type="text" data-bind="textInput: contact.observable['phone']">
   
   
Gulp Options
=========

Optional gulp build tools can be installed with npm
  
    npm install

Watch:

    gulp

Deploy
    
    gulp dist    