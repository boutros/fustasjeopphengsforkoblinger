export function status(response) {
	if (response.status >= 200 && response.status < 300) {
		return Promise.resolve(response)
	} else {
		return Promise.reject(new Error(response.statusText))
	}
}

export function json(response) {
	return response.json()
}

export function queryParams(params) {
	let res = []
	for (let k of Object.keys(params)) {
		res.push(`${k}=${encodeURIComponent(params[k])}`)
	}
	return "?"+res.join("&")
}

export function idFromUri(uri) {
	return uri.substring(uri.lastIndexOf('/') + 1)
}

export function syncToServices(...txs) {
	let patches = []
	for (let tx of txs) {
		let patch = {
			op: "add",
			s: tx.triple.s.value(),
			p: tx.triple.p.value(),
			o: {
				value: tx.triple.o.value()
			}
		}
		if (tx.triple.o.termType() === "namedNode") {
			patch.o.type = "http://www.w3.org/2001/XMLSchema#anyURI"
		}
		if (tx.op === "deleted") {
			patch.op = "del"
		}
		patches.push(patch)
	}

	let a = patches[0].s.split("/")
	let type = a[a.length-2]
	let id = a[a.length-1]

	fetch(`/services/${type}/${id}`, {
			method: 'PATCH',
			headers: {
				 "Content-Type": "application/ldpatch+json",
				 Accept: "application/ld+json"
			},
			body: JSON.stringify(patches)
		})
		.then(status)
		.catch(function (error) {
			console.log('request failed', error)
			throw new Error(error)
		})
}