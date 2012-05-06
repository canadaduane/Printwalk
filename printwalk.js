(function() {
  var PortNegotiator, Printer, app, command, express, pn, printer, status, util, _;

  util = require('util');

  express = require('express');

  _ = require('underscore');

  Printer = require('printer').Printer;

  PortNegotiator = require('portnegotiator').PortNegotiator;

  printer = null;

  status = {
    ports: [],
    chosen_port: null,
    plugged_in: false,
    contact: false,
    online: false,
    hotend_temp: 0.0,
    bed_temp: 0.0
  };

  pn = new PortNegotiator();

  pn.on('attach', function(port) {
    status.ports = [port];
    status.chosen_port = port;
    status.plugged_in = true;
    printer = new Printer('/dev/' + port).start_monitor();
    printer.on('online', function() {
      return status.online = true;
    });
    printer.on('contact', function() {
      return status.contact = true;
    });
    printer.on('offline', function() {
      status.online = false;
      return status.contact = false;
    });
    printer.on('hotend_temp_change', function(temp) {
      return status.hotend_temp = temp;
    });
    printer.on('bed_temp_change', function(temp) {
      return status.bed_temp = temp;
    });
    printer.on('position_change', function(pos) {
      return status.position = pos;
    });
    return printer.on('extruder_change', function(pos) {
      return status.extruder = pos;
    });
  });

  pn.on('detach', function(port) {
    if (status.chosen_port === port) {
      status.ports = [];
      status.chosen_port = null;
      return status.plugged_in = false;
    }
  });

  pn.on('choice', function(ports) {
    return status.ports = ports;
  });

  command = {
    online: function(affirmative) {
      if (affirmative) {
        if (!pn.attached) {
          util.log('Reconnect');
          return pn.reconnect();
        } else {
          return util.log('Already online');
        }
      } else {
        if (pn.attached) {
          status.plugged_in = false;
          status.contact = false;
          status.online = false;
          util.log('Close serial port');
          printer.serial.end();
          return pn.disconnect();
        } else {
          return util.log('Already offline');
        }
      }
    },
    hotend_temp: function(temp) {
      return printer.command('settemp', {
        s: temp
      });
    },
    bed_temp: function(temp) {
      return printer.command('setbedtemp', {
        s: temp
      });
    }
  };

  app = express.createServer();

  app.set('views', __dirname + '/views');

  app.set('view engine', 'ejs');

  app.set('view options', {
    layout: false
  });

  app.configure(function() {
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.static(__dirname + '/static'));
    return app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
  });

  app.get('/', function(req, res) {
    return res.render('index.ejs', {
      url: function(path) {
        return path != null ? path : '';
      }
    });
  });

  app.post('/command', function(req, res) {
    var attr, info, k, params, v, value;
    params = _.clone(req.body);
    util.log("Params: " + (JSON.stringify(params)));
    for (attr in params) {
      value = params[attr];
      if (attr in command && (printer != null)) {
        util.log("Command: " + attr + " " + value);
        if (info = command[attr](value)) {
          for (k in info) {
            v = info[k];
            params[k] = v;
          }
        }
      } else {
        util.log("Command not implemented: " + attr);
      }
    }
    return res.json(params);
  });

  app.post('/status', function(req, res) {
    var lines, params;
    status = _.clone(status);
    params = req.body;
    util.log("Params: " + (JSON.stringify(params)));
    if (printer && 'console_cursor' in params) {
      lines = printer.responses_since(params['console_cursor']);
      status['console_cursor'] = params['console_cursor'] + lines.length;
      status['console_lines'] = lines;
    }
    return res.json(status);
  });

  app.listen(3000);

}).call(this);
