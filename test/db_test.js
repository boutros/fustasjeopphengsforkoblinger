import { NamedNode, Literal, Triple, Variable } from '../src/rdf.js'
import { DB } from '../src/db.js'

import test from 'ava'

let uri = (u) => new NamedNode(u)
let vari = (v) => new Variable()
let lit = (v) => new Literal(v)

// TODO move to graph_test.js
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
	let recievedCalls = []
	let db = new DB
	let cb = function(transaction) {
		recievedCalls.push(transaction)
	}

	let t1 = new Triple(uri("s1"), uri("title"), vari("title"))
	let t2 = new Triple(uri("s1"), uri("author"), lit("Knut Hamsun"))
	let t3 = new Triple(uri("s1"), uri("title"), lit("Sult"))
	let t4 = new Triple(uri("s1"), uri("title"), lit("Sulten"))
	let t5 = new Triple(uri("s1"), vari("pred"), vari("val"))
	let t6 = new Triple(uri("s1"), uri("year"), lit("1880"))
	let t7 = new Triple(uri("s1"), uri("year"), lit("1890"))


	t.true(db.subscribe(t1, cb))
	t.false(db.has(t2))
	t.true(db.insert(t2))
	t.true(db.has(t2))
	t.false(db.insert(t2))
	t.true(db.insert(t3))
	t.true(db.delete(t3))
	t.false(db.has(t3))
	t.false(db.delete(t3))
	t.true(db.unsubscribe(t1, cb))
	t.true(db.insert(t4))
	t.true(db.insert(t6))
	t.true(db.delete(t6))
	t.true(db.subscribe(t5, cb))
	t.false(db.subscribe(t5, cb))
	t.true(db.delete(t2))
	t.true(db.insert(t6))
	t.true(db.replaceObject(t6, lit("1890")))
	t.false(db.has(t6))
	t.true(db.has(t7))

	let want = [
		{"inserted": t3},
		{"deleted": t3},
		{"deleted": t2},
		{"inserted": t6},
	    {"replacedObj": t7}
	]

	t.same(recievedCalls, want)
})