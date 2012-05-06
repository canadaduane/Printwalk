class OnlineControl extends Backbone.View
    template: _.template($('#online-control-template').html())

    initialize: (args) ->
        @command = args.command
        @model.bind('change:ports', @updatePorts, this)
        @model.bind('change:ports', @updatePluggedInStatus, this)
        @model.bind('change:plugged_in', @updatePluggedInStatus, this)
        @model.bind('change:online', @updateOnlineStatus, this)
        @model.bind('change:contact', @updateOnlineStatus, this)

        @command.bind('change:error', @updateError, this)
        # @model.bind('change', @update, this)
        # @command.bind('change', @update, this)
        
        @ports = new kendo.data.DataSource data: []

    render: ->
        html = @template(@model.toJSON())
        $(@el).html(html)

        @$('.connect .button').
            mousedown(=> @setButtonState(if @model.get('online') then 'on-press' else 'press')).
            mouseup(=> @setButtonState('glow')).
            mouseenter(=> @setButtonState('glow')).
            mouseleave(=> @setButtonState(if @command.get('online') then 'glow' else 'off')).
            click (event) =>
                console.log('click connect', @model, 'command online', @command.get('online'))
                if @model.get('online')
                    @command.set online: false
                    console.log('command online (f)', @command.get('online'))
                else
                    @command.set online: true
                    console.log('command online (t)', @command.get('online'))
            # @update()
        
        @$('.more').click (event) ->
            $(this).parent().find('.drawer').toggle().trigger('open')
        
        @ports = new kendo.data.DataSource(data: [
            text: 'No printer ports found'
            value: null
        ])
        @combobox = @$('.plugged .combobox').
            kendoComboBox(dataSource: @ports).
            data('kendoComboBox')
    
    setButtonState: (state) ->
        button = @$('.connect .button')
        if @model.get('online') and state != 'on-press' # override when we're online
            state = 'on'
        button.removeClass(r) for r in ['off', 'glow', 'press', 'on', 'on-press']
        button.addClass(state)
    
    setIndicatorColor: (selector, color) ->
        indicator = @$(selector)
        indicator.removeClass(r) for r in ['red', 'yellow', 'green']
        indicator.addClass(color)
    
    updateError: ->
        @$('.main-message').html(@command.get('error'))
    
    updatePorts: ->
        data = ({text: dev.replace('/dev/', ''), value: dev} for dev in @model.get('ports'))
        @ports.data(data)
        @combobox.select(0) if @combobox and @combobox.value() == ''
        
    updatePluggedInStatus: ->
        if @model.get('plugged_in')
            if @model.get('ports').length == 1
                @setIndicatorColor('.plugged .indicator', 'green')
                @$('.plugged .message').html('Plugged in')
            else
                @setIndicatorColor('.plugged .indicator', 'yellow')
                @$('.plugged .message').html('Choose serial port')
                @$('.plugged .drawer').show()
        else
            @setIndicatorColor('.plugged .indicator', 'red')
            @$('.plugged .message').html('Not plugged in')

    updateOnlineStatus: ->
        if @model.get('online')
            @setButtonState('on')
            @setIndicatorColor('.online .indicator', 'green')
            @$('.online .message').html('Online')
            @$('.main-message').html('Ready')
        else
            @setButtonState('off')
            if @model.get('contact')
                @setIndicatorColor('.online .indicator', 'yellow')
                @$('.online .message').html('In Contact')
            else
                @setIndicatorColor('.online .indicator', 'red')
                @$('.online .message').html('Offline')
                @$('.main-message').html('&nbsp;')


window.OnlineControl = OnlineControl