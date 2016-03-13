import { Graph, Triple } from './rdf.js'

let alwaysOK = function(op, triple) {
	return true
}

export class DB {

	// Pubic API:

	constructor(remoteSync=alwaysOK) {
		this._graph = new Graph
		this._subscribers = [] // {triple: pattern, cb: callback}...
		this._remoteSync = remoteSync
	}

	// has checks if the given triple is stored or not. Returns true or false.
	has(triple) {
		return this._graph.has(triple)
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
			 this._broadcast("inserted", triple)
              return true

			/*
			let op = "inserted"
			let error
			try {
				this._remoteSync(op, triple)
			} catch(err) {
				error = err
			} finally {
				this._broadcast(op, triple, undefined, error)
				return true
			}*/
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
	replaceObject(triple, obj) {
		if ( !this._graph.delete(triple) ) {
			return false
		}

		// we don't want to mutate callers triple
		let newTriple = new Triple(triple.s, triple.p, obj)

		if ( !this._graph.insert(newTriple) ) {
			return false
		}

		// TODO fetch('/services/type', {method: 'patch'})
		this._broadcast("replacedObj", newTriple)
		return true
	}


	// Private methods:

	// broadcast wil broadcast the transaction to any subscribers, in the format:
	//   { op: "inserted|deleted|replacedObj", triple: triple }
	//   If the obj parameter is defined, the message originates from
	//   replaceObject, and thus two messages will be broadcasted;
	//   one for the delete statement and one for the insert statement.
	_broadcast(op, triple, obj, error) {
		for (let s of this._subscribers) {
			if (s.triple.matches(triple)) {
				s.cb({[op]: triple})
			}
		}
	}
}