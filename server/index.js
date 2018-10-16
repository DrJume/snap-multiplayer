const fs = require('fs')
const https = require('https')
const WebSocket = require('ws')
const express = require('express')

const app = express()
const server = new https.createServer({
  cert: fs.readFileSync('/etc/letsencrypt/live/snap.coffee-mill.net/fullchain.pem'),
  key: fs.readFileSync('/etc/letsencrypt/live/snap.coffee-mill.net/privkey.pem')
}, app)
const wss = new WebSocket.Server({ server })

wss.on('connection', function connection(ws, req) {
  const ip = req.connection.remoteAddress
  console.log(`CONNECTED: ${ip}`)

  ws.on('message', function incoming(data) {
    console.log(`${ip}: ${data}`)

    // Broadcast to everyone else.
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data)
      }
    })
  })
})

app.get('', (req, res) => {
  res.download(__dirname + '/../SNAP_Multiplayer_Blocks.xml')
})

server.listen({
  host: 'snap.coffee-mill.net',
  port: 443
})
