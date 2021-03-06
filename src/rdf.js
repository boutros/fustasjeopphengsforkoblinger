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

	// insert one or more triples into the graph. Returns the number
	// of triples insterted, that where not allready part of the graph.
	insert(...triples) {
		let c = 0
		for (let t of triples) {
			if (!this.has(t)) {
				this._triples.push(t)
				c++
			}
		}
		return c
	}

	// delete one or more triples from the graph. Returns the number
	// of triples deleted, not counting those that where not part of the graph.
	delete(...triples) {
		let c = 0
		for (let t of triples) {
			this._triples.forEach(function(hasTr, i, ownTriples) {
				if (hasTr.equals(t)) {
					ownTriples.splice(i,1)
					c++
					return
				}
			})
		}
		return c
	}

	// construct a graph matching the given triple patterns. Corresponds to
	// CONSTRUCT WHERE queries in SPARQL (where template and pattern are the same)
	construct(...triples) {
		let g = new Graph
		let matcher
		switch (triples.length) {
			case 1:
				matcher = this._matches(triples[0])
				for (let match of matcher) {
					g.insert(match)
				}
				return g
			case 2:
				let group1 = []
				let group2 = []

				matcher = this._matches(triples[0])
				for (let match of matcher) {
					group1.push(match)
				}
				matcher = this._matches(triples[1])
				for (let match of matcher) {
					group2.push(match)
				}

				for (let a of group1) {
					for (let b of group2) {
						if (a.s.equals(b.o) || a.o.equals(b.s)) {
							g.insert(a)
							g.insert(b)
						}
					}
				}

				return g
			default:
				throw new Error("only 1 or 2 triple patterns are currently supported")
		}

	}

	triples() {
		return this._triples
	}

	toString() {
		return this._triples.join("\n")
	}

	* _matches (triple) {
		for (let t of this._triples) {
			if (triple.matches(t)) {
				yield t
			}
		}
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
	constructor(id) {
		// TODO check if id is allready used in graph; if so, asign a new one
		this._id = id
	}

	termType() {
		return "blankNode"
	}

	toString() {
		return `_:${this._id}`
	}

	value() {
		return this._id
	}

	equals(other) {
		return (
			other.termType() === "blankNode" &&
			other._id === this._id
		)
	}
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
		return `${this.s} ${this.p} ${this.o} .`
	}
}
