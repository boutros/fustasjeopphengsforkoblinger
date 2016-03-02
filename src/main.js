import riot from 'riot'

// import pages
import './pages/start.tag'
import './pages/book.tag'

// currently active page:
let mounted

riot.route.base('/')
riot.route.start(true)

riot.route(function(page) {
	if (Array.isArray(mounted)) {
		mounted[0].unmount(true)
	}

	switch (page) {
		case 'bok':
			mounted = riot.mount('book')
			break
		default:
			mounted = riot.mount('start')
	}
})
