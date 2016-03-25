import { Graph, Triple, NamedNode, Literal } from './rdf.js'

function subfieldVal(marcField, subfield) {
	for (let s of marcField.subfield) {
		if (s.$.code === subfield) {
			return s._
		}
	}
}


export function marc2rdf(marc, subject, ns) {
	let g = new Graph

	// TODO move out
	let pred = function(pred) { return new NamedNode(ns+pred) }
	let uri = function(uri)   { return new NamedNode(uri) }
	let lit = function(val)   { return new Literal(val) }

	let subj = uri(subject)

	for (let f of marc.datafield) {
		switch (f.$.tag) {
			case '245':
				let mainTitle = subfieldVal(f, "a")
				if (mainTitle) {
					g.insert(new Triple(subj, pred('mainTitle'), lit(mainTitle)))
				}
				let subtitle = subfieldVal(f, "b")
				if (subtitle) {
					g.insert(new Triple(subj, pred('subtitle'), lit(subtitle)))
				}
				break
			case '260':
				let publishYear = subfieldVal(f, "c")
				if (publishYear) {
					g.insert(new Triple(subj, pred('publishYear'), lit(publishYear)))
				}
				break
			case '300':
				let numPages = subfieldVal(f, "a")
				if (numPages) {
					g.insert(new Triple(subj, pred('numPages'), lit(numPages.replace(/\D/g,''))))
				}
				break
		}
	}
	return g
}
