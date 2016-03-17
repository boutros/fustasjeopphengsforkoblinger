import { NamedNode, Literal, Triple, Variable } from '../src/rdf.js'

import test from 'ava'

let uri = (u) => new NamedNode(u)
let vari = (v) => new Variable(v)
let lit = (v) => new Literal(v)
let bnode = (v) => new BlankNode(v)

test("simple triple pattern matching", t => {
	let tests = [
		[
			new Triple(uri("s"), uri("p"), uri("o")),
			new Triple(uri("s"), uri("p"), uri("o")),
			true
		],
		[
			new Triple(uri("s"), uri("p"), uri("o")),
			new Triple(uri("s"), uri("p"), uri("oO")),
			false
		],
		[
			new Triple(vari("subj"), uri("p"), uri("o")),
			new Triple(uri("s"), uri("p"), uri("o")),
			true
		],
		[
			new Triple(vari("subj"), vari("p"), uri("o")),
			new Triple(uri("s"), uri("p"), uri("o")),
			true
		],
		[
			new Triple(vari("subj"), vari("p"), vari("o")),
			new Triple(uri("s"), uri("p"), uri("o")),
			true
		],
		[
			new Triple(vari("subj"), uri("p2"), uri("o")),
			new Triple(uri("s"), uri("p"), uri("o")),
			false
		]
	]

	for (let tt of tests) {
		t.is(tt[0].matches(tt[1]), tt[2])
	}
})