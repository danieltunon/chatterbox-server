/*eslint no-unused-vars: 0*/
/*global Backbone*/
/////////////////////////////////////////////////////////////////////////////
// Backbone-based Implementation of (minimal) chatterbox client
/////////////////////////////////////////////////////////////////////////////

var Message = Backbone.Model.extend({
  url: 'http://127.0.0.1:3000/classes/messages',
  defaults: {
    username: '',
    message: '',
    roomname: ''
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
  url: 'http://127.0.0.1:3000/classes/rooms',

  loadRooms: function() {
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

var RoomView = Backbone.View.extend({
  template: _.template('<option value=<%- roomname %>><%- roomname %></option>'),
  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this.$el;
  }
});

var RoomsView = Backbone.View.extend({
  initialize: function() {
    this.collection.on('sync', this.render, this);
  },

  render: function() {
    this.$el.html('<option value="__newRoom">New room...</option>');
    this.collection.forEach(this.renderRoom, this);
  },

  renderRoom: function(message) {
    var roomView = new RoomView({model: room});
    this.$el.append(roomView.render());
  }
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

    this.collection.create({
      username: window.location.search.substr(10),
      message: $text.val(),
      roomname: /*get current roomname*/0
    });

    $text.val('');
  },

  handleRoomChange: function(e) {

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
