import { NamedNode, BlankNode, Literal, Triple, Variable, Graph } from '../src/rdf.js'

import test from 'ava'

let uri = (u) => new NamedNode(u)
let vari = (v) => new Variable(v)
let lit = (v) => new Literal(v)
let bnode = (v) => new BlankNode(v)
let tr = (s, p, o) => new Triple(s, p, o)
let graph = () => new Graph()

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


test("graph querying", t => {
	let triples = [
		tr(uri("person/1"), uri("name"), lit("Tor Åge Bringsværd")),
		tr(uri("person/2"), uri("name"), lit("Jon Bing")),
		tr(uri("person/3"), uri("name"), lit("Peter Haars")),
		tr(uri("person/4"), uri("name"), lit("Thore Hansen")),
		tr(uri("book/1"), uri("mainTitle"), lit("Å miste et romskip - et sjansespill")),
		tr(uri("book/1"), uri("publishYear"), lit("1969")),
		tr(uri("book/1"), uri("contributor"), bnode("b1")),
		tr(bnode("b1"), uri("agent"), uri("person/1")),
		tr(bnode("b1"), uri("role"), uri("author")),
		tr(uri("book/1"), uri("contributor"), bnode("b2")),
		tr(bnode("b2"), uri("agent"), uri("person/2")),
		tr(bnode("b2"), uri("role"), uri("author")),
		tr(bnode("b2"), uri("a"), uri("MainEntry")),
		tr(uri("book/1"), uri("contributor"), bnode("b3")),
		tr(bnode("b3"), uri("agent"), uri("person/3")),
		tr(bnode("b3"), uri("role"), uri("coverIllustrator")),
		tr(uri("book/2"), uri("mainTitle"), lit("Ruffen")),
		tr(uri("book/2"), uri("subTitle"), lit("sjøormen som ikke kunne svømme")),
		tr(uri("book/2"), uri("publishYear"), lit("1981")),
		tr(uri("book/2"), uri("contributor"), bnode("b4")),
		tr(bnode("b4"), uri("agent"), uri("person/1")),
		tr(bnode("b4"), uri("role"), uri("author")),
		tr(bnode("b4"), uri("a"), uri("MainEntry")),
		tr(uri("book/2"), uri("contributor"), bnode("b5")),
		tr(bnode("b5"), uri("agent"), uri("person/4")),
		tr(bnode("b5"), uri("role"), uri("illustrator"))
	]
	let g = graph()
	g.insert(...triples)
	let q

	/*
	CONSTRUCT WHERE {
		<person/1> <name> "Tor Åge Bringsværd"
	}
	=>
	<person/1> <name> "Tor Åge Bringsværd"
	*/
	let want = graph()
	want.insert(triples[0])
	t.true(g.construct(triples[0]).equals(want))

	/*
	CONSTRUCT WHERE {
		<person/1> <name> ?name
	}
	=>
	<person/1> <name> "Tor Åge Bringsværd" .
	*/
	want = graph()
	want.insert(triples[0])
	q = tr(
		uri("person/1"),
		uri("name"),
		vari("name"))
	t.true(g.construct(q).equals(want))

	/*
	CONSTRUCT WHERE {
		?person <name> ?name
	}
	=>
	<person/1> <name> "Tor Åge Bringsværd" .
	<person/2> <name> "Jon Bing" .
	<person/3> <name> "Peter Haars" .
	<person/4> <name> "Thore Hansen" .
	*/
	want = graph()
	want.insert(triples[0], triples[1], triples[2], triples[3])
	q = tr(
		vari("person"),
		uri("name"),
		vari("name"))
	t.true(g.construct(q).equals(want))


	/*
	CONSTRUCT WHERE {
		?s ?p ?o
	}
	=> the whole graph
	*/
	q = tr(
		vari("s"),
		vari("p"),
		vari("o"))
	t.true(g.construct(q).equals(g))
})