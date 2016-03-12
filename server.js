'use strict'

const path = require('path')
const express = require('express')
const axios = require('axios') // TODO replace with isomorphic-fetch
const xml2js = require('xml2js')

const app = express()
const port = process.env.PORT || 8000
const z3950proxy = 'http://localhost:3000/'

function subfield (datafield, code) {
	for (let f of datafield.subfield) {
		if (f.$.code === code) {
			return f._
		}
	}
	return false
}

// TODO: move to src/marc.js
function previewsFromCollection(records) {
	let res = []
	for (let rec of records) {
		let author, title, year
		let preview = ''

		for (let d of rec.datafield) {
			switch (d.$.tag) {
				case '245':
					title = subfield(d, 'a')
					break
				case '100':
					author = subfield(d, 'a')
					break
				case '260':
					year = subfield(d, 'c')
					break
			}
		}
		if (author) {
			preview = `${author} – `
		}
		preview += title
		if (year) {
			preview += ` (${year})`
		}
		res.push(preview)
	}

	return res
}

app.use(express.static(__dirname + '/public'))

app.all('/services/*', (req, res) => {
	console.log(req)
	res.send("simulating services")
})

app.get('/search/z3950', (req, res) => {
	// validate params
	if (!req.query.base) {
		res.status("400").send('missing parameter: "base"')
		return
	}
	if (!req.query.author && !req.query.title && !req.query.isbn) {
		res.status("400").send('missing at least one of parameters: "isbn", "author", "title"')
		return
	}

	// prepare request
	let params = {
		base: req.query.base
	}
	if (req.query.author) {
		params.author = req.query.author
	}
	if (req.query.title) {
		params.title = req.query.title
	}
	if (req.query.isbn) {
		params.isbn = req.query.isbn
	}

	// call z3950 proxy
	// TODO replace axios with isomorphic-fetch
	axios.get(z3950proxy, {
		params: params
	})
	.then(function (response) {
		xml2js.parseString(response.data, function (err, json) {
			if (err) {
				res.status(500).send(err)
				return
			}
			res.send({
				previews: previewsFromCollection(json.collection.record),
				marc: json.collection.record
			})
		})
	})
	.catch(function (response) {
		if (response.status == 404) {
			res.send({
				previews: [],
				marc: []
			})
			return
		}
		res.send(response)
	})
})

app.get('*', (request, response) => {
  response.sendFile(path.resolve(__dirname, 'index.html'))
})

app.listen(port)
console.log('Server started on port ' + port)