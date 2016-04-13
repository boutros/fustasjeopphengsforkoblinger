import { Graph, Triple, NamedNode, Literal } from './rdf.js'

function subfieldVal(marcField, subfield) {
	for (let s of marcField.subfield) {
		if (s.$.code === subfield) {
			return s._
		}
	}
}


export function marc2rdf(marc, subject, ns) {
	let graph = new Graph
	let suggestions = []

	// TODO move out
	let pred = function(pred) { return new NamedNode(ns+pred) }
	let uri = function(uri)   { return new NamedNode(uri) }
	let lit = function(val)   { return new Literal(val) }

	let subj = uri(subject)

	for (let f of marc.datafield) {
		switch (f.$.tag) {
			case '100':
				let creator = {
					name: subfieldVal(f, "a")
				}
				let lifespan  = subfieldVal(f, "d")
				if (lifespan) {
					creator.lifespan = lifespan
				}
				let nationality = subfieldVal(f, "j")
				if (nationality) {
					creator.nationality = nationality
				}
				suggestions.push({
					type: "MainEntry",
					label: creator.name,
					source: "?",
					value: creator
				})
				break
			case '245':
				let mainTitle = subfieldVal(f, "a")
				if (mainTitle) {
					graph.insert(new Triple(subj, pred('mainTitle'), lit(mainTitle)))
				}
				let subtitle = subfieldVal(f, "b")
				if (subtitle) {
					graph.insert(new Triple(subj, pred('subtitle'), lit(subtitle)))
				}
				break
			case '260':
				let publishYear = subfieldVal(f, "c")
				if (publishYear) {
					graph.insert(new Triple(subj, pred('publishYear'), lit(publishYear)))
				}
				break
			case '300':
				let numPages = subfieldVal(f, "a")
				if (numPages) {
					graph.insert(new Triple(subj, pred('numPages'), lit(numPages.replace(/\D/g,''))))
				}
				break
		}
	}
	return {graph, suggestions}
}
