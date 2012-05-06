(function() {
  var checkStatus, command, status;

  status = new PrinterStatus();

  command = new PrinterCommand();

  checkStatus = function() {
    return status.save({
      success: function() {
        return status.tick();
      }
    });
  };

  jQuery(function() {
    var console, ctrl, nav;
    setInterval(checkStatus, 1000);
    new TemperatureGraph({
      title: 'Hotend Temperature:',
      field: 'hotend_temp',
      color: [255, 50, 50],
      model: status,
      command: command,
      el: $('#hotend-temp').get(0),
      comboOptions: [
        {
          text: "0 (Off)",
          value: "0"
        }, {
          text: "185 (PLA)",
          value: "185"
        }, {
          text: "230 (ABS)",
          value: "230"
        }
      ]
    });
    new TemperatureGraph({
      title: 'Bed Temperature:',
      field: 'bed_temp',
      color: [50, 50, 255],
      model: status,
      command: command,
      el: $('#bed-temp').get(0),
      comboOptions: [
        {
          text: "0 (Off)",
          value: "0"
        }, {
          text: "60 (PLA)",
          value: "60"
        }, {
          text: "110 (ABS)",
          value: "110"
        }
      ]
    });
    ctrl = new OnlineControl({
      model: status,
      command: command,
      el: $('#online-control').get(0)
    });
    ctrl.render();
    console = new CommConsole({
      model: status,
      el: ctrl.$('.online .drawer').get(0)
    });
    console.render();
    return nav = new NavControl({
      model: status,
      el: $('#nav-control').get(0)
    });
  });

}).call(this);
