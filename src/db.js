import { Graph } from './rdf.js'

export class DB {

	// Pubic API:

	constructor() {
		this._graph = new Graph
		this._subscribers = [] // {triple: pattern, cb: callback}...
	}

	// subscribe will subscribe to the given triple pattern, and calling the
	// callback whenever a transaction matching the pattern occours.
	// The function returns false if the pattern and callback is allready
	// registered, otherwise true.
	subscribe(triple, cb) {
		for (let i=0; i < this._subscribers.length; i++) {
			let sub = this._subscribers[i]
			if (sub.triple.equals(triple) && sub.cb == cb) {
				return false // allready subscribed
			}
		}
		this._subscribers.push({triple, cb})
		return true
	}

	// unsubscribe will unsubscribe the given triple pattern and callback.
	// The function returns false if the pattern and callback is not
	// registered, otherwise true.
	unsubscribe(triple, cb) {
		let ok = false
		this._subscribers.forEach(function(sub, i, subs) {
			if (sub.triple.equals(triple) && sub.cb == cb){
				subs.splice(i, 1)
				ok = true
			}
		})
		return ok
	}

	// insert persists a triple in the database.
	// It returns false if the triple was allready present, otherwise true.
	insert(triple) {
		if ( this._graph.insert(triple) ) {
			// TODO fetch('/services/type', {method: 'patch'})
			this._broadcast("inserted", triple)
			return true
		}
		return false
	}

	// delete removes a triple from the database.
	// It returns false if the triple was not stored, otherwise true.
	delete(triple) {
		if ( this._graph.delete(triple) ) {
			// TODO fetch('/services/type', {method: 'patch'})
			this._broadcast("deleted", triple)
			return true
		}
		return false
	}

	// replaceObject translates into a insert and delete query,
	// deleting the triple and inserting it again except with
	// the given object.
	// It returns false if the triple was not stored, otherwise true.
	replaceObject(triple, obj) { }


	// Private methods:

	// broadcast wil broadcast the transaction to any subscribers, in the format:
	//   [{ op: "inserted"|"deleted", triple: triple }]
	//   If the obj parameter is defined, the message originates from
	//   replaceObject, and thus two messages will be broadcasted;
	//   one for the delete statement and one for the insert statement.
	_broadcast(op, triple, obj) {
		for (let s of this._subscribers) {
			if (s.triple.matches(triple)) {
				s.cb({[op]: triple})
			}
		}
	}
}