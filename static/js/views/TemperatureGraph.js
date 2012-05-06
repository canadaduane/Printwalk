(function() {
  var TemperatureGraph;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  TemperatureGraph = (function() {

    __extends(TemperatureGraph, Backbone.View);

    function TemperatureGraph() {
      TemperatureGraph.__super__.constructor.apply(this, arguments);
    }

    TemperatureGraph.prototype.template = _.template($('#temperature-graph-template').html());

    TemperatureGraph.prototype.rgb = function() {
      return 'rgb(' + Array.prototype.join.call(arguments, ",") + ')';
    };

    TemperatureGraph.prototype.rgba = function() {
      return 'rgba(' + Array.prototype.join.call(arguments, ",") + ')';
    };

    TemperatureGraph.prototype.initialize = function(args) {
      var _ref, _ref2, _ref3;
      this.command = args.command;
      this.title = args.title;
      this.field = (_ref = args.field) != null ? _ref : 'hotend_temp';
      this.comboOptions = (_ref2 = args.comboOptions) != null ? _ref2 : [
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
      ];
      this.model.bind('change:' + this.field, this.modelUpdate, this);
      this.command.bind('change:' + this.field, this.commandUpdate, this);
      this.color = (_ref3 = args.color) != null ? _ref3 : [255, 0, 0];
      if (args.width != null) $(this.el).width(args.width);
      if (args.height != null) $(this.el).height(args.height);
      this.graph = this.createSmoothieChart();
      this.graph.addTimeSeries((this.currentSeries = new TimeSeries()), {
        strokeStyle: this.rgba(this.color[0], this.color[1], this.color[2], 1.0),
        fillStyle: this.rgba(this.color[0], this.color[1], this.color[2], 0.25),
        lineWidth: 3
      });
      this.graph.addTimeSeries((this.targetSeries = new TimeSeries()), {
        strokeStyle: this.rgba(0, 0, 0, 1.0),
        fillStyle: this.rgba(0, 0, 0, 0),
        lineWidth: 1
      });
      return this.render();
    };

    TemperatureGraph.prototype.createSmoothieChart = function() {
      return new SmoothieChart({
        grid: {
          strokeStyle: this.rgba(220, 220, 220, 1.0),
          fillStyle: this.rgba(255, 255, 255, 1.0),
          lineWidth: 1,
          millisPerLine: 30000,
          verticalSections: 6,
          fps: 30
        },
        minValue: 0,
        maxValue: 300,
        millisPerPixel: 1000,
        labels: {
          fillStyle: 'rgb(0, 0, 0)'
        }
      });
    };

    TemperatureGraph.prototype.modelUpdate = function() {
      var current, ts;
      current = this.model.get(this.field);
      ts = new Date().getTime();
      this.currentSeries.append(ts, current);
      return this.$('.actual').html(parseInt(current).toString());
    };

    TemperatureGraph.prototype.commandUpdate = function() {
      var prev, target, ts;
      target = this.command.get(this.field);
      ts = new Date().getTime();
      if (this.targetSeries.data.length > 0) {
        prev = this.targetSeries.data[this.targetSeries.data.length - 1][1];
        this.targetSeries.append(ts - 1, prev);
      }
      this.targetSeries.append(ts, target);
      this.slider.value(target);
      return this.combobox.value(target);
    };

    TemperatureGraph.prototype.render = function() {
      var canvas, html, setTemperature;
      var _this = this;
      html = this.template({
        title: this.title
      });
      $(this.el).html(html);
      this.$('.actual').parent().css('color', this.rgb.apply(this, this.color));
      canvas = this.$('canvas.graph').get(0);
      this.graph.streamTo(canvas, 1000);
      setTemperature = function(value) {
        var set;
        set = {};
        set[_this.field] = value;
        return _this.command.set(set);
      };
      this.slider = this.$(".slider").kendoSlider({
        orientation: 'vertical',
        min: 0,
        max: 300,
        tickPlacement: 'both',
        smallStep: 10,
        largeStep: 50,
        slide: function(e) {
          return setTemperature(e.value);
        },
        change: function(e) {
          return setTemperature(e.value);
        }
      }).data('kendoSlider');
      return this.combobox = this.$(".combobox").kendoComboBox({
        dataSource: this.comboOptions,
        index: 0,
        change: function(e) {
          return setTemperature(this.value());
        }
      }).data('kendoComboBox');
    };

    return TemperatureGraph;

  })();

  window.TemperatureGraph = TemperatureGraph;

}).call(this);
