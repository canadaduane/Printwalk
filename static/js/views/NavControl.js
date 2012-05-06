(function() {
  var NavControl;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  NavControl = (function() {

    __extends(NavControl, Backbone.View);

    function NavControl() {
      NavControl.__super__.constructor.apply(this, arguments);
    }

    NavControl.prototype.template = _.template($('#nav-control-template').html());

    NavControl.prototype.initialize = function(args) {
      return this.render();
    };

    NavControl.prototype.render = function() {
      var html;
      html = this.template(this.model.toJSON());
      return $(this.el).html(html);
    };

    NavControl.prototype.update = function() {};

    return NavControl;

  })();

  window.NavControl = NavControl;

}).call(this);
