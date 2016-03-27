import riot from 'riot'
import { status, json, idFromUri } from './http-helpers.js'
import { parser } from './jsonld.js'
import state from './state.js'
import { syncToServices } from './http-helpers.js'

import './pages/app-home.tag.html'
import './pages/app-book.tag.html'

let mounted     // currently active page

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
						state.centerNode = publication
						// We will populate UI DB, but without syncing to backend, as the
						// data is just fetched from backend:
						state.db._remoteSync = function() { }

						mounted = riot.mount('app-book')

						let p = parser(data)
						for (let triple of p) {
							state.db.insert(triple)
						}
						// UI DB is no populated, any subsequent inserts or deletes should
						// sync to services backend:
						state.db._remoteSync = syncToServices
					})
					.catch(function (error) {
						console.log('request failed', error)
					})
			} else {
				// request a new URI for a publication from services
				fetch('/services/publication', {method: 'post'})
					.then(status)
					.then(function(response) {
						let publication = response.headers.get('location')
						if (!publication) {
							throw new Error("publication resource URI not found in location headers")
						}
						riot.route("/book?publication="+publication)
					})
					.catch(function (error) {
						console.log('request failed', error)
					})
			}
			break
		default:
			mounted = riot.mount('app-home')
	}
})
