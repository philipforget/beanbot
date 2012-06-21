express = require 'express'
stylus = require 'stylus'
assets = require 'connect-assets'

app = express()
app.use assets()
app.set 'view engine', 'jade'

app.get '/', (req, resp) -> resp.render 'index'

app.listen 3000, -> console.log 'Listening...'
