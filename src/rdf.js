export class Graph {
	constructor() {
		this._triples = []
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

	has(triple) {
		for (let t of this._triples) {
			if ( triple.equals(t) ) {
				return true
			}
		}
		return false
	}

	replaceObj(triple, obj) {
		// TODO
	}

	insert(triple) { // TODO insert(triple...)
		if (this.has(triple)) {
			return false
		}
		this._triples.push(triple)
		return true
	}

	delete(triple) { // TODO delete(triple...)
		let ok = false
		this._triples.forEach(function(hasTr, i, triples) {
			if (hasTr.equals(triple)) {
				triples.splice(i,1)
				ok = true
			}
		})
		return ok
	}

	triples()      {
		return this._triples
	}

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

