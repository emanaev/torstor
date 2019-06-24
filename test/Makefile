IMAGE=webtorrent
MAGNET="magnet:?xt=urn:btih:41109ddaee2ef41d473c8b85b6556f6ab2037a69&tr=wss%3A%2F%2Fml.emanaev.tech"

build:
	docker build -t $(IMAGE) .

run:
#	docker run -it --rm --network=host -v $(PWD):/mnt:ro $(IMAGE) download /mnt/1.torrent
	docker run -it --rm --network=host $(IMAGE) download $(MAGNET)

