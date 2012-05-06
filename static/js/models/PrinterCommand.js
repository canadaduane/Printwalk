(function() {
  var PrinterCommand;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  PrinterCommand = (function() {

    __extends(PrinterCommand, PrinterStatus);

    function PrinterCommand() {
      PrinterCommand.__super__.constructor.apply(this, arguments);
    }

    PrinterCommand.prototype.url = url('/command');

    PrinterCommand.prototype.set = function(attrs, options) {
      options || (options = {});
      console.log('PrinterCommand', attrs, options);
      Backbone.Model.prototype.set.call(this, attrs, options);
      if (!options.silent) {
        return $.ajax({
          url: this.url,
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(attrs)
        });
      }
    };

    return PrinterCommand;

  })();

  window.PrinterCommand = PrinterCommand;

}).call(this);
