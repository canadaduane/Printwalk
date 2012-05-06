class PrinterStatus extends Backbone.Model
    defaults:
        plugged_in: false
        online: false
        contact: false
        ports: []
        hotend_temp: -1.0
        bed_temp: -1.0
        console_lines: []
        console_cursor: 0
        
    url: url('/status')

    initialize: (spec) ->
        @console = []
        # @bind('change:console_lines', @appendConsole, this)
    
    appendConsole: ->
        @console = @console.concat(@get('console_lines'))
        # if @console.length - 100 >= 0
            # @console = @console.slice(@console.length-100, @console.length)
        @set({console_lines: []}, {silent: true})
    
    tick: ->
        set = timestamp: new Date().getTime()
        @set set, silent: true

window.PrinterStatus = PrinterStatus