util = require('util')
express = require('express')
_ = require('underscore')
Printer = require('printer').Printer
PortNegotiator = require('portnegotiator').PortNegotiator

# We can't connect until we know what port to connect to
printer = null

# Our one and only status object
status =
    ports: []
    chosen_port: null
    plugged_in: false
    contact: false
    online: false
    hotend_temp: 0.0
    bed_temp: 0.0


pn = new PortNegotiator()

pn.on 'attach', (port) ->
    status.ports = [port]
    status.chosen_port = port
    status.plugged_in = true
    printer = new Printer('/dev/' + port).start_monitor()

    printer.on 'online', -> status.online = true
    printer.on 'contact', -> status.contact = true
    printer.on 'offline', -> status.online = false; status.contact = false

    printer.on 'hotend_temp_change', (temp) -> status.hotend_temp = temp
    printer.on 'bed_temp_change', (temp) -> status.bed_temp = temp
    printer.on 'position_change', (pos) -> status.position = pos
    printer.on 'extruder_change', (pos) -> status.extruder = pos

pn.on 'detach', (port) ->
    if status.chosen_port == port
        status.ports = []
        status.chosen_port = null
        status.plugged_in = false

pn.on 'choice', (ports) ->
    status.ports = ports


command =
    online: (affirmative) ->
        if affirmative 
            if not pn.attached
                util.log 'Reconnect'
                pn.reconnect()
            else util.log 'Already online'
        else
            if pn.attached
                status.plugged_in = false
                status.contact = false
                status.online = false
                util.log 'Close serial port'
                printer.serial.end()
                # printer.serial.set_baud_rate(0)
                # printer.serial.set_dtr(true)
                # printer.serial.set_dtr(false)
                pn.disconnect()
            else util.log 'Already offline'
    
    hotend_temp: (temp) ->
        printer.command 'settemp', {s: temp}

    bed_temp: (temp) ->
        printer.command 'setbedtemp', {s: temp}


app = express.createServer()

app.set 'views', __dirname + '/views'
app.set 'view engine', 'ejs'
app.set 'view options', 
    layout: false

app.configure ->
  app.use express.logger('dev')
  app.use express.bodyParser()
  # app.use express.session()
  app.use express.static(__dirname + '/static')
  app.use express.errorHandler({ dumpExceptions: true, showStack: true })

app.get '/', (req, res) ->
   res.render 'index.ejs', url: (path) -> path ? ''

app.post '/command', (req, res) ->
    params = _.clone(req.body)
    util.log "Params: #{JSON.stringify(params)}"
    for attr, value of params
        if attr of command and printer?
            util.log "Command: #{attr} #{value}"
            if info = command[attr](value)
                params[k] = v for k, v of info
        else
            util.log "Command not implemented: #{attr}"
    
    res.json params

app.post '/status', (req, res) ->
    status = _.clone(status)
    params = req.body
    util.log "Params: #{JSON.stringify(params)}"
    if printer and 'console_cursor' of params
        lines = printer.responses_since(params['console_cursor'])
        status['console_cursor'] = params['console_cursor'] + lines.length
        status['console_lines'] = lines
    
    res.json status



app.listen(3000)