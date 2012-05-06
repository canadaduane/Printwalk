(function() {
  var CommConsole;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  CommConsole = (function() {

    __extends(CommConsole, Backbone.View);

    function CommConsole() {
      CommConsole.__super__.constructor.apply(this, arguments);
    }

    CommConsole.prototype.template = _.template($('#comm-console-template').html());

    CommConsole.prototype.events = {
      "open": "update"
    };

    CommConsole.prototype.initialize = function(args) {
      return this.model.bind('change:console_lines', this.update, this);
    };

    CommConsole.prototype.render = function() {
      var html;
      html = this.template(this.model.toJSON());
      return $(this.el).html(html);
    };

    CommConsole.prototype.update = function() {
      var div_console, text;
      div_console = this.$('.comm-console-view');
      if (this.model.get('console_lines').length > 0) {
        text = '<pre>' + this.model.get('console_lines').join("<br/>") + '</pre>';
        div_console.append(text);
      }
      return div_console.get(0).scrollTop = div_console.get(0).scrollHeight;
    };

    return CommConsole;

  })();

  window.CommConsole = CommConsole;

}).call(this);
