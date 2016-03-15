import riot from 'riot'

// import pages
import './pages/app-home.tag.html'
import './pages/app-book.tag.html'

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
			mounted = riot.mount('app-book')
			break
		default:
			mounted = riot.mount('app-home')
	}
})
