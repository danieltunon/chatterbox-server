/*eslint no-unused-vars: 0*/
/*global Backbone*/
/////////////////////////////////////////////////////////////////////////////
// Backbone-based Implementation of (minimal) chatterbox client
/////////////////////////////////////////////////////////////////////////////

var Message = Backbone.Model.extend({
  url: 'http://127.0.0.1:3000/classes/messages',
  defaults: {
    username: '',
    message: ''
  }
});

var Messages = Backbone.Collection.extend({

  model: Message,
  url: 'http://127.0.0.1:3000/classes/messages',

  loadMsgs: function() {
    this.fetch();
  },

  parse: function(response, options) {
    var results = [];
    for (var i = response.results.length - 1; i >= 0; i--) {
      results.push(response.results[i]);
    }
    return results;
  }

});

var Room = Backbone.Model.extend({
  url: 'http://127.0.0.1:3000/classes/rooms',
  defaults: {
    roomname: ''
  }

});

var Rooms = Backbone.Collection.extend({
  model: Room,
  url: 'http://127.0.0.1:3000/classes/rooms'

});

var RoomView = Backbone.View.extend({

});

var FormView = Backbone.View.extend({

  initialize: function() {
    this.collection.on('sync', this.stopSpinner, this);
  },

  events: {
    'submit #send': 'handleSubmit'
  },

  handleSubmit: function(e) {
    e.preventDefault();

    this.startSpinner();

    var $text = this.$('#message');

    // original version
    this.collection.create({
      username: window.location.search.substr(10),
      message: $text.val()
    });

    // our version using fetch
    // var newInput = new Message({ username: window.location.search.substr(10), message: $text.val() });
    // console.dir(newInput.attributes.username);
    // this.collection.fetch({
    //   type: 'POST',
    //   data: JSON.stringify({ username: newInput.attributes.username, message: newInput.attributes.message })
    // });
    $text.val('');
  },


  startSpinner: function() {
    this.$('.spinner img').show();
    this.$('form input[type=submit]').attr('disabled', 'true');
  },

  stopSpinner: function() {
    this.$('.spinner img').fadeOut('fast');
    this.$('form input[type=submit]').attr('disabled', null);
  }

});

var MessageView = Backbone.View.extend({

  initialize: function() {
    this.model.on('change', this.render, this);
  },

  template: _.template('<div class="chat"> \
                          <div class="user"><%- username %></div> \
                          <div class="text"><%- message %></div> \
                        </div>'),

  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this.$el;
  }

});

var MessagesView = Backbone.View.extend({

  initialize: function() {
    this.collection.on('sync', this.render, this);
    this.onscreenMessages = {};
  },

  render: function() {
    this.$el.html('');
    this.collection.forEach(this.renderMessage, this);
  },

  renderMessage: function(message) {
    var messageView = new MessageView({model: message});
    this.$el.prepend(messageView.render());
  }

});
