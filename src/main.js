import riot from 'riot'
import { status, json, idFromUri } from './http-helpers.js'
import { DB } from './db.js'

import './pages/app-home.tag.html'
import './pages/app-book.tag.html'

let mounted     // currently active page
let db = new DB // the state of the resource we are editing (with linked resources)

riot.route.base('/')
riot.route.start(true)

riot.route(function(page) {
	if (Array.isArray(mounted)) {
		mounted[0].unmount(true)
	}

	switch (page) {
		case 'book':
			let publication = riot.route.query().publication
			if (publication) {
				// load resource from services
				fetch('/services/publication/'+idFromUri(publication), {method: 'get'})
					.then(status)
					.then(json)
					.then(function(data) {
						console.log(data)
						// TODO mount app-book here?
					})
					.catch(function (error) {
						console.log('request failed', error)
					})
			} else {
				// request a new URI for a publication from services
				fetch('/services/publication', {method: 'post'})
					.then(status)
					.then(function(response) {
						let resource = response.headers.get('location')
						if (!resource) {
							throw new Error("publication resource URI not found in location headers")
						}
						// TODO mount app-book here?
						riot.route("/book?publication="+resource)
					})
					.catch(function (error) {
						console.log('request failed', error)
					})
			}
			mounted = riot.mount('app-book')
			break
		default:
			mounted = riot.mount('app-home')
	}
})
