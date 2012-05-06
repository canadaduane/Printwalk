


status = new PrinterStatus()
command = new PrinterCommand()

checkStatus = ->
    status.save
        success: ->
            status.tick()

    # # console.log('command', command.toJSON())
    # command.save null,
    #     success: (resp, status, xhr) ->
    #         command.tick()

    #         status.tick()
    #         status.set(command.parse(resp, xhr).get('status'))
    #         status.change()
    #         # console.log('status', status.toJSON())
    #     error: (resp) ->
    #         console.log('error saving command', resp)

jQuery ->
    setInterval checkStatus, 1000

    # Hotend Graph
    new TemperatureGraph
        title: 'Hotend Temperature:'
        field: 'hotend_temp'
        color: [255,50,50]
        model: status
        command: command
        el: $('#hotend-temp').get(0)
        comboOptions: [
            { text: "0 (Off)", value: "0" }
            { text: "185 (PLA)", value: "185" }
            { text: "230 (ABS)", value: "230" }
        ]

    
    # Bed Graph
    new TemperatureGraph
        title: 'Bed Temperature:'
        field: 'bed_temp'
        color: [50,50,255]
        model: status
        command: command
        el: $('#bed-temp').get(0)
        comboOptions: [
            { text: "0 (Off)", value: "0" }
            { text: "60 (PLA)", value: "60" }
            { text: "110 (ABS)", value: "110" }
        ]
    
    # On Button, Status Lights
    ctrl = new OnlineControl
        model: status
        command: command
        el: $('#online-control').get(0)
    ctrl.render()

    # Communication Console
    console = new CommConsole
        model: status
        el: ctrl.$('.online .drawer').get(0)
    console.render()

    # Navigation Control
    nav = new NavControl
        model: status
        el: $('#nav-control').get(0)
    # nav.render()


