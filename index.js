const polka = require('polka')
const { json } = require('body-parser')
const WebTorrent = require('webtorrent-hybrid')
const serveStatic = require('serve-static')

const {
  PORT=3000,
  TRACKER='wss://ml.emanaev.tech'
} = process.env

function props(obj, properties) {
  var res = {}
  properties.forEach(prop => {
    res[prop] = obj[prop]
  });
  return res
}

const short_properties = ['infoHash', 'timeRemaining', 'received', 'downloaded', 'uploaded', 'downloadSpeed', 'uploadSpeed', 'progress', 'ratio', 'numPeers']

client = new WebTorrent({tracker: {announce: [TRACKER]}})
/*
function mon() {
  console.log("Torrents: ", client.torrents.length)
  setTimeout(mon, 1000)
}

mon()
*/
polka()
  .use(json())
  .use(serveStatic('./client/dist/', { 'index': ['index.html' ]}))
  .get('/torrents', (req, res) => {
    result = client.torrents.map(t => {
      return props(t, short_properties)
    });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
  })
  .post('/torrents/:hash', (req, res) => {
    return new Promise( (resolve, reject) => {
      var flag = {}
      hash = req.params.hash
      if (!hash || hash.length != 40) {
        reject("Invalid hash")
      }
      magnet = "magnet:?xt=urn:btih:" + hash + "&tr=" + encodeURIComponent(TRACKER)
      torrent = client.add(magnet, torrent => {
        flag.done = true
        resolve(torrent)
      })
      torrent.on('error', err => {
        reject(err.message);
      })
      setTimeout(function() {
        if (flag.done) return;
        torrent.destroy();
        reject('Torrent not found')
      }, 10000)
    }).then(torrent => {
      result = props(torrent, short_properties)
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(result))
    }, error => {
      res.writeHead(500, { 'Content-Type': 'text/text' })
      res.end(error)
    })
  })
  .get('/torrents/:hash', (req, res) => {
    hash = req.params.hash
    torrent = client.get(hash)
    if (!torrent) {
      res.writeHead(500, { 'Content-Type': 'text/text' })
      res.end("Torrent not found")
      return
    }
    result = props(torrent, short_properties)
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
  })
  .listen(PORT, err => {
		if (err) throw err
		console.log(`> Running on localhost:${PORT}`)
  })
