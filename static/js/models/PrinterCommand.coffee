class PrinterCommand extends PrinterStatus
    url: url('/command')

    set: (attrs, options) ->
        options || (options = {});
        console.log('PrinterCommand', attrs, options)
        Backbone.Model.prototype.set.call(this, attrs, options)
        unless options.silent
            $.ajax 
                url: @url
                type: 'POST'
                contentType: 'application/json'
                data: JSON.stringify(attrs)

window.PrinterCommand = PrinterCommand