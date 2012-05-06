(function() {
  var OnlineControl;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  OnlineControl = (function() {

    __extends(OnlineControl, Backbone.View);

    function OnlineControl() {
      OnlineControl.__super__.constructor.apply(this, arguments);
    }

    OnlineControl.prototype.template = _.template($('#online-control-template').html());

    OnlineControl.prototype.initialize = function(args) {
      this.command = args.command;
      this.model.bind('change:ports', this.updatePorts, this);
      this.model.bind('change:ports', this.updatePluggedInStatus, this);
      this.model.bind('change:plugged_in', this.updatePluggedInStatus, this);
      this.model.bind('change:online', this.updateOnlineStatus, this);
      this.model.bind('change:contact', this.updateOnlineStatus, this);
      this.command.bind('change:error', this.updateError, this);
      return this.ports = new kendo.data.DataSource({
        data: []
      });
    };

    OnlineControl.prototype.render = function() {
      var html;
      var _this = this;
      html = this.template(this.model.toJSON());
      $(this.el).html(html);
      this.$('.connect .button').mousedown(function() {
        return _this.setButtonState(_this.model.get('online') ? 'on-press' : 'press');
      }).mouseup(function() {
        return _this.setButtonState('glow');
      }).mouseenter(function() {
        return _this.setButtonState('glow');
      }).mouseleave(function() {
        return _this.setButtonState(_this.command.get('online') ? 'glow' : 'off');
      }).click(function(event) {
        console.log('click connect', _this.model, 'command online', _this.command.get('online'));
        if (_this.model.get('online')) {
          _this.command.set({
            online: false
          });
          return console.log('command online (f)', _this.command.get('online'));
        } else {
          _this.command.set({
            online: true
          });
          return console.log('command online (t)', _this.command.get('online'));
        }
      });
      this.$('.more').click(function(event) {
        return $(this).parent().find('.drawer').toggle().trigger('open');
      });
      this.ports = new kendo.data.DataSource({
        data: [
          {
            text: 'No printer ports found',
            value: null
          }
        ]
      });
      return this.combobox = this.$('.plugged .combobox').kendoComboBox({
        dataSource: this.ports
      }).data('kendoComboBox');
    };

    OnlineControl.prototype.setButtonState = function(state) {
      var button, r, _i, _len, _ref;
      button = this.$('.connect .button');
      if (this.model.get('online') && state !== 'on-press') state = 'on';
      _ref = ['off', 'glow', 'press', 'on', 'on-press'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        r = _ref[_i];
        button.removeClass(r);
      }
      return button.addClass(state);
    };

    OnlineControl.prototype.setIndicatorColor = function(selector, color) {
      var indicator, r, _i, _len, _ref;
      indicator = this.$(selector);
      _ref = ['red', 'yellow', 'green'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        r = _ref[_i];
        indicator.removeClass(r);
      }
      return indicator.addClass(color);
    };

    OnlineControl.prototype.updateError = function() {
      return this.$('.main-message').html(this.command.get('error'));
    };

    OnlineControl.prototype.updatePorts = function() {
      var data, dev;
      data = (function() {
        var _i, _len, _ref, _results;
        _ref = this.model.get('ports');
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          dev = _ref[_i];
          _results.push({
            text: dev.replace('/dev/', ''),
            value: dev
          });
        }
        return _results;
      }).call(this);
      this.ports.data(data);
      if (this.combobox && this.combobox.value() === '') {
        return this.combobox.select(0);
      }
    };

    OnlineControl.prototype.updatePluggedInStatus = function() {
      if (this.model.get('plugged_in')) {
        if (this.model.get('ports').length === 1) {
          this.setIndicatorColor('.plugged .indicator', 'green');
          return this.$('.plugged .message').html('Plugged in');
        } else {
          this.setIndicatorColor('.plugged .indicator', 'yellow');
          this.$('.plugged .message').html('Choose serial port');
          return this.$('.plugged .drawer').show();
        }
      } else {
        this.setIndicatorColor('.plugged .indicator', 'red');
        return this.$('.plugged .message').html('Not plugged in');
      }
    };

    OnlineControl.prototype.updateOnlineStatus = function() {
      if (this.model.get('online')) {
        this.setButtonState('on');
        this.setIndicatorColor('.online .indicator', 'green');
        this.$('.online .message').html('Online');
        return this.$('.main-message').html('Ready');
      } else {
        this.setButtonState('off');
        if (this.model.get('contact')) {
          this.setIndicatorColor('.online .indicator', 'yellow');
          return this.$('.online .message').html('In Contact');
        } else {
          this.setIndicatorColor('.online .indicator', 'red');
          this.$('.online .message').html('Offline');
          return this.$('.main-message').html('&nbsp;');
        }
      }
    };

    return OnlineControl;

  })();

  window.OnlineControl = OnlineControl;

}).call(this);
