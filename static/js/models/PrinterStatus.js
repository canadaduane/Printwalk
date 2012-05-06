(function() {
  var PrinterStatus;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  PrinterStatus = (function() {

    __extends(PrinterStatus, Backbone.Model);

    function PrinterStatus() {
      PrinterStatus.__super__.constructor.apply(this, arguments);
    }

    PrinterStatus.prototype.defaults = {
      plugged_in: false,
      online: false,
      contact: false,
      ports: [],
      hotend_temp: -1.0,
      bed_temp: -1.0,
      console_lines: [],
      console_cursor: 0
    };

    PrinterStatus.prototype.url = url('/status');

    PrinterStatus.prototype.initialize = function(spec) {
      return this.console = [];
    };

    PrinterStatus.prototype.appendConsole = function() {
      this.console = this.console.concat(this.get('console_lines'));
      return this.set({
        console_lines: []
      }, {
        silent: true
      });
    };

    PrinterStatus.prototype.tick = function() {
      var set;
      set = {
        timestamp: new Date().getTime()
      };
      return this.set(set, {
        silent: true
      });
    };

    return PrinterStatus;

  })();

  window.PrinterStatus = PrinterStatus;

}).call(this);
