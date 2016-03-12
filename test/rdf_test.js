import { Graph, NamedNode, Literal, Triple, Variable } from '../src/rdf.js'
import test from 'ava'

let uri = (u) => new NamedNode(u)
let vari = (v) => new Variable()
let lit = (v) => new Literal(v)

test("triple matching", t => {
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


test("subscribing to graph patterns", t => {
	let g = new Graph
	let recievedCalls = []
	let cb = function(change) {
		recievedCalls.push(change)
	}

	let t1 = new Triple(uri("s1"), uri("title"), vari("title"))
	let t2 = new Triple(uri("s1"), uri("author"), lit("Knut Hamsun"))
	let t3 = new Triple(uri("s1"), uri("title"), lit("Sult"))
	let t4 = new Triple(uri("s1"), uri("title"), lit("Sulten"))
	let t5 = new Triple(uri("s1"), vari("pred"), vari("val"))
	let t6 = new Triple(uri("s1"), uri("year"), lit("1890"))

	g.subscribe(t1, cb)
	g.insert(t2)
	g.insert(t3)
	g.delete(t3)
	g.unsubscribe(t1, cb)
	g.insert(t4)
	g.insert(t6)
	g.delete(t6)
	g.subscribe(t5, cb)
	g.subscribe(t5, cb)
	g.delete(t2)
	g.insert(t6)

	let want = [
		{"inserted": t3},
		{"deleted": t3},
		{"deleted": t2},
		{"inserted": t6}
	]

	t.same(recievedCalls, want)
})