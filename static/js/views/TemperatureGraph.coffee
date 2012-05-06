class TemperatureGraph extends Backbone.View
    template: _.template($('#temperature-graph-template').html())

    rgb: -> 'rgb(' + Array.prototype.join.call(arguments, ",") + ')'
    rgba: -> 'rgba(' + Array.prototype.join.call(arguments, ",") + ')'
    
    initialize: (args) ->
        @command = args.command
        @title = args.title
        @field = args.field ? 'hotend_temp'
        @comboOptions = args.comboOptions ? [
            { text: "0 (Off)", value: "0" },
            { text: "185 (PLA)", value: "185" },
            { text: "230 (ABS)", value: "230" }
        ]

        @model.bind   'change:' + @field, this.modelUpdate, this
        @command.bind 'change:' + @field, this.commandUpdate, this

        @color = args.color ? [255, 0, 0]

        $(@el).width(args.width) if args.width?
        $(@el).height(args.height) if args.height?

        @graph = @createSmoothieChart()
        # console.log('create color', @color)
        @graph.addTimeSeries (@currentSeries = new TimeSeries()),
            strokeStyle: @rgba(@color[0], @color[1], @color[2], 1.0)
            fillStyle:   @rgba(@color[0], @color[1], @color[2], 0.25)
            lineWidth:   3
        
        @graph.addTimeSeries (@targetSeries = new TimeSeries()),
            strokeStyle: @rgba(0, 0, 0, 1.0)
            fillStyle:   @rgba(0, 0, 0, 0)
            lineWidth:   1
        
        @render()

    createSmoothieChart: ->
        new SmoothieChart
            grid:
                strokeStyle: @rgba(220, 220, 220, 1.0)
                fillStyle: @rgba(255, 255, 255, 1.0)
                lineWidth: 1
                millisPerLine: 30000
                verticalSections: 6
                fps: 30
            minValue: 0
            maxValue: 300
            millisPerPixel: 1000
            labels:
                fillStyle: 'rgb(0, 0, 0)'
    
    modelUpdate: ->
        current = @model.get(@field)
        ts = new Date().getTime()
        @currentSeries.append ts, current
        @$('.actual').html(parseInt(current).toString())
    
    commandUpdate: ->
        target = @command.get(@field)
        ts = new Date().getTime()
        # Add a control point to the graph for the current time, at the previous
        # position, so that the graph line doesn't bend strangely on user input
        if @targetSeries.data.length > 0
            prev = @targetSeries.data[@targetSeries.data.length-1][1]
            @targetSeries.append ts-1, prev
        @targetSeries.append ts, target

        @slider.value(target)
        @combobox.value(target)

    render: ->
        html = @template title: @title
        $(@el).html(html)
        @$('.actual').parent().css 'color', @rgb.apply(this, @color)

        canvas = @$('canvas.graph').get(0)
        @graph.streamTo canvas, 1000

        # Closure for kendo ui event handlers
        setTemperature = (value) =>
            set = {}
            set[@field] = value
            @command.set(set)
        
        @slider = @$(".slider").kendoSlider(
            orientation: 'vertical'
            min:0, max:300
            tickPlacement: 'both'
            smallStep: 10, largeStep: 50
            slide:  (e) ->
                setTemperature(e.value)
            change: (e) ->
                setTemperature(e.value)
            ).data('kendoSlider')
        @combobox = @$(".combobox").kendoComboBox(
            dataSource: @comboOptions
            index: 0
            change: (e) ->
                setTemperature(this.value())
            ).data('kendoComboBox')


window.TemperatureGraph = TemperatureGraph