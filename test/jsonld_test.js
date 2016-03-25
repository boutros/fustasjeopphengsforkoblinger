import { Graph, Triple, NamedNode, Literal } from '../src/rdf.js'
import { parser } from '../src/jsonld.js'

import test from 'ava'

function parseGraph(jsonld) {
	let g = new Graph()
	for (let triple of parser(jsonld)) {
		g.insert(triple)
	}
	return g
}

let uri = (u) => new NamedNode(u)
let lit = (v) => new Literal(v)

test("parsing jsonld without @graph", t => {
	let jsonld = {
		"@id": "http://192.168.50.12:8005/publication/p090363766981",
		"@type": "deichman:Publication",
		"deichman:recordID": "1174",
		"@context": {
			deichman: "http://192.168.50.12:8005/ontology#"
		}
	}

	let want = new Graph()
	let s = uri("http://192.168.50.12:8005/publication/p090363766981")
	want.insert(
		new Triple(
			s,
			uri("http://www.w3.org/2000/01/rdf-schema#type"),
			uri("http://192.168.50.12:8005/ontology#Publication")),
		new Triple(
			s,
			uri("http://192.168.50.12:8005/ontology#recordID"),
			lit("1174"))
	)

	t.true(parseGraph(jsonld).equals(want))
})