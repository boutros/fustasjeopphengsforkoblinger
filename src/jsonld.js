import { NamedNode, Triple, Literal } from './rdf.js'

function parseNode(context, node) {
	let i = node.indexOf(":")
	if (i != -1) {
		let prefix = node.substr(0, i)
		if (context[prefix]) {
			return new NamedNode(context[prefix] + node.substr(i + 1))
		}
	}

	// not in context:

	if (node.startsWith("http")) {
		return new NamedNode(node)
	}

	// must be literal
	return new Literal(node)
}


export function* parser(jsonld) {
	if (jsonld["@graph"]) {
		throw new Error("TODO @graph")
	}

	let ctx = jsonld["@context"]
	let subject = parseNode(ctx, jsonld["@id"])
	let rdfsType = new NamedNode("http://www.w3.org/2000/01/rdf-schema#type")

	for (let k of Object.keys(jsonld)) {
		switch (k) {
			case "@context":
			case "@id":
				break
			case "@type":
				yield new Triple(subject, rdfsType, parseNode(ctx, jsonld[k]))
				break
			default:
				yield new Triple(subject, parseNode(ctx, k), parseNode(ctx, jsonld[k]))
		}
	}
	return
}