var dragDrop = require('drag-drop')
var WebTorrent = require('webtorrent')

var client = new WebTorrent()
var seedOptions = {
  private: true,
  announceList: [ [ 'wss://ml.emanaev.tech' ] ]
//  announceList: [ [ 'ws://localhost:9081' ] ]
}

// When user drops files on the browser, create a new torrent and start seeding it!
dragDrop('body', function (files, pos, fileList, directories) {
  console.log('Here are the dropped files', files) // Array of File objects
  console.log('Here is the raw FileList object if you need it:', fileList)
  console.log('Here is the list of directories:', directories)
  
  client.seed(files, seedOptions, function (torrent) {
    console.log('Client is seeding ' + torrent.magnetURI)
//    encoded = torrent.torrentFile.toString('base64')
    
    document.getElementById("torrent").innerHTML = torrent.magnetURI
  })
})

function chunkate(s, delim="\n", len=80) {
  res = '';
  for(var i=0; i<encoded.length; i+=len) {
    res = res + s.substr(i,len)+delim;
  }
  return res;
}