class NavControl extends Backbone.View
    template: _.template($('#nav-control-template').html())

    initialize: (args) ->
        # @model.bind('change:console_lines', @update, this)
        @render()
    
    render: ->
        html = @template(@model.toJSON())
        $(@el).html(html)

    update: ->

window.NavControl = NavControl