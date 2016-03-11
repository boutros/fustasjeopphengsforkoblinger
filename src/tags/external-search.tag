import { debounce } from '../common.js'
import axios from 'axios'

import './external-search-results.tag'

<external-search>
	<h4>Søk i eksterne kilder</h4>

	<table>
		<tbody>
			<tr>
				<td><strong>ISBN</strong></td>
				<td><strong>Forfatter</strong></td>
				<td><strong>Tittel</strong></td>
			</tr>
			<tr>
				<td><input type="search" name="isbn"/></td>
				<td><input type="search" name="author" /></td>
				<td><input type="search" name="title"/></td>
			</tr>
	</table>

	<div>
		<button name="bibbi" disabled={ resultSelected || results.bibbi.searching } onclick={ search }>Biblioteksentralen</button>
		<button name="loc" disabled={ resultSelected || results.loc.searching } onclick={ search }>Library Of Congress</button>
		<br/>
	</div>

	<external-search-results results={ this.results }></external-search-results>

	<style scoped>
		table { width: 100%; }
		input[type="search"] { width: 7.5em; }
		button { margin: 1em 1em 1em 0; padding: 0.5em; }
	</style>

	const debounceMs = 400

	let tag = this
	let initialResults = {
		bibbi: {
			searching: false,
			preview: undefined,
			records: undefined
		},
		loc: {
			searching: false,
			preview: undefined,
			records: undefined
		}
	}

	tag.results = initialResults

	// true if any of the search results have been selected
	tag.resultSelected = false


	tag.events = riot.observable()
	tag.events.on('selected', function(marc) {
		console.log(marc)
		tag.update({resultSelected: true})
	})
	tag.events.on('unselected', function() {
		tag.update({resultSelected: false})
	})

	var debounceSearch = debounce(function(base, isbn, author, title) {
		if (isbn === "" && author === "" && title === "") {
			return
		}
		let params = {
			base: base
		}
		if (author !== "") {
			params.author = author
		}
		if (title !== "") {
			params.title = title
		}
		if (isbn !== "") {
			params.isbn = isbn
		}

		tag.results[base].searching = true
		tag.results[base].previews = undefined
		tag.results[base].records = undefined
		tag.update()

		axios.get('/search/z3950', {params: params})
		.then(function (response) {
			tag.events.trigger('got-results')
			tag.results[base].previews = response.data.previews
			tag.results[base].records = response.data.marc
			tag.results[base].searching = false
			tag.update()
		})
		.catch(function (response) {
			console.log(response)
		})
	}, debounceMs)

	search(event) {
		debounceSearch(event.target.name, tag.isbn.value, tag.author.value, tag.title.value)
		
		return true
	}

</external-search>