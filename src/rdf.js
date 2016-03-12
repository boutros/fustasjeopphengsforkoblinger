export class Graph {
	constructor() {
		this._triples = []     // Triple...
		this._subscribers = [] // {triple: pattern, cb: callback}...
	}

	equals(other) {
		if (this._triples.length != other._triples.length) {
			return false
		}
		for (let t of this._triples) {
			if ( !other.has(t) ) {
				return false
			}
		}
		return true
	}

	subscribe(triple, cb) {
		for (let i=0; i < this._subscribers.length; i++) {
			let sub = this._subscribers[i]
			if (sub.triple.equals(triple) && sub.cb == cb) {
				// allready subscribed
				return
			}
		}
		this._subscribers.push({triple, cb})
	}

	unsubscribe(triple, cb) {
		this._subscribers.forEach(function(sub, i, subs) {
			if (sub.triple.equals(triple) && sub.cb == cb){
				subs.splice(i, 1)
			}
		})
	}

	has(triple) {
		for (let t of this._triples) {
			if ( triple.equals(t) ) {
				return true
			}
		}
		return false
	}

	insert(...triples) {
		for (let triple of triples) {
			this._insert(triple)
		}
	}

	_insert(triple) {
		if (this.has(triple)) {
			return
		}
		this._triples.push(triple)
		this._broadcast("inserted", triple)
	}

	_broadcast(op, triple) {
		for (let s of this._subscribers) {
			if (s.triple.matches(triple)) {
				s.cb({[op]: triple})
			}
		}
	}

	delete(triple) { // TODO delete(triple...)
		let self = this
		this._triples.forEach(function(hasTr, i, triples) {
			if (hasTr.equals(triple)) {
				triples.splice(i,1)
				self._broadcast("deleted", triple)
				return
			}
		})
	}

	triples()      { return this._triples }
	toString()     {
		let s = ""
		for (let t of this._triples) {
			s += t.toString()
		}
		return s
	}
}


export class NamedNode {
	constructor(iri) {
		this._iri = iri
	}
	termType()       { return "namedNode" }
	toString()       { return `<${this._iri}>` }
	value()          { return this._iri }
	equals(other) {
		return (
			other.termType() === "namedNode" &&
			other._iri === this._iri
		)
	}
}

export class BlankNode {

}

export class Literal {
	constructor(value) {
		this._value = value
	}

	termType() {
		return "literal"
	}

	toString() {
		return `"${this._value}"`
	}

	value() {
		return this._value
	}

	equals(other) {
		return (
			other.termType() === "literal" &&
			other._value === this._value // TODO + datatype or langtag
		)
	}

}
export class Variable {
	constructor(id) {
		this._id = id
	}

	termType() {
		return "variable"
	}

	toString() {
		return `"_:${this._id}"`
	}

	equals(other) {
		return (
			other.termType() === "variable" &&
			other.id === this.id
		)
	}
}

export class Triple {
	constructor(s, p, o) {
		this.s = s
		this.p = p
		this.o = o
	}

	equals(other) {
		return (
			this.s.equals(other.s) &&
			this.p.equals(other.p) &&
			this.o.equals(other.o)
		)
	}

	matches(other) {
		for (let term of ["s", "p", "o"]) {
			if (this[term].termType() === "variable") {
				continue
			}
			if (!this[term].equals(other[term])) {
				return false
			}
		}

		return true
	}

	toString() {
		return `${this.s} ${this.p} ${this.o} .\n`
	}
}

/*

DB.subscribe(new Triple(subj, pred('mainTitle'), new Variable(?mainTitle)))

*/