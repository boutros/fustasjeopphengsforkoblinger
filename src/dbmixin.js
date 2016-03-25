import state from './state.js'
import riot from 'riot'

export default function(graphPattern) {
	return {
		init: function() {
			let tag = this
			tag.dbEvents = riot.observable()
			state.db.subscribe(graphPattern, function(data) {
				tag.dbEvents.trigger('dbupdate', data)
			})
		}
	}
}