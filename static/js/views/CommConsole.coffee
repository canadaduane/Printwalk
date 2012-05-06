class CommConsole extends Backbone.View
    template: _.template($('#comm-console-template').html())

    events:
        "open": "update"

    initialize: (args) ->
        @model.bind('change:console_lines', @update, this)
    
    render: ->
        html = @template(@model.toJSON())
        $(@el).html(html)

    update: ->
        div_console = @$('.comm-console-view')
        if @model.get('console_lines').length > 0
            text = '<pre>' + @model.get('console_lines').join("<br/>") + '</pre>'
            div_console.append(text)

        div_console.get(0).scrollTop = div_console.get(0).scrollHeight

window.CommConsole = CommConsole