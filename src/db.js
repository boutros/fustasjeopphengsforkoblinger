import { Graph, Triple } from './rdf.js'

let noop = function(...transactions) { }

export class DB {

	// Pubic API:

	constructor(remoteSync=noop) {
		this._graph = new Graph
		this._subscribers = [] // {triple: pattern, cb: callback}...
		// remoteSync will be called on each transaction, intended to sync
		// DB (eg. with server-side). If remoteSync throws an error, the
		// transaction will fail.
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
	// If remoteSync throws an error, the transaction will be rolled back and
	// the function returns false.
	insert(triple) {
		if ( this._graph.insert(triple) !== 1 ) {
			return false
		}
		let op = "inserted"
		let error
		let ok = true
		try {
			this._remoteSync({op, triple})
		} catch(err) {
			// Remote sync failed; rollback transaction:
			this._graph.delete(triple)
			error = err
			ok = false
		} finally {
			this._broadcast(op, triple, error)
			return ok
		}
	}

	// delete removes a triple from the database.
	// It returns false if the triple was not stored, otherwise true.
	// If remoteSync throws an error, the transaction will be rolled back and
	// the function returns false.
	delete(triple) {
		if ( this._graph.delete(triple) !== 1 ) {
			return false
		}
		let op = "deleted"
		let error
		let ok = true
		try {
			this._remoteSync({op, triple})
		} catch(err) {
			// Remote sync failed; rollback transaction:
			this._graph.insert(triple)
			error = err
			ok = false
		} finally {
			this._broadcast(op, triple, error)
			return ok
		}
	}

	// replaceObject translates into a insert and delete query,
	// deleting the triple and inserting it again except with
	// the given object.
	// It returns false if the triple was not stored, otherwise true.
	// If remoteSync throws an error, the transaction will be rolled back and
	// the function returns false.
	replaceObject(triple, obj) {
		if ( !this._graph.delete(triple) ) {
			return false
		}

		// we don't want to mutate callers triple
		let newTriple = new Triple(triple.s, triple.p, obj)

		if ( !this._graph.insert(newTriple) ) {
			return false
		}

		let op = "replacedObj"
		let error
		let ok = true
		try {
			this._remoteSync({op: "deleted", triple},
							 {op: "inserted", newTriple})
		} catch(err) {
			// Remote sync failed; rollback transaction:
			this._graph.delete(newTriple)
			this._graph.insert(triple)
			error = err
			ok = false
		} finally {
			this._broadcast(op, newTriple, error)
			return ok
		}
	}


	// Private methods:

	// broadcast wil broadcast the transaction to any subscribers, in the format:
	//   { op: "inserted|deleted|replacedObj", triple: triple }
	//   If the error parameter is defined, it will be part of the message.
	_broadcast(op, triple, error) {
		for (let s of this._subscribers) {
			if (s.triple.matches(triple)) {
				s.cb( Object.assign({[op]: triple}, error) )
			}
		}
	}
}