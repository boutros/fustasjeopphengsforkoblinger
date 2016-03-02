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
		<button disabled={ resultSelected } onclick={ search }>Biblioteksentralen</button>
		<button disabled='true'>Library of Congress</button>
		<br/>
	</div>

	<external-search-results
		previews={ this.previews }
		records={ this.records }>
	</external-search-results>

	<style scoped>
		table { width: 100%; }
		input[type="search"] { width: 7.5em; }
		button { margin: 1em 1em 1em 0; padding: 0.5em; }
	</style>

	const debounceMs = 400

	let tag = this

	tag.previews = []
	tag.records = []

	// true if any of the search results have been selected
	tag.resultSelected = false

	// keep track of last executed search to ensure we don't execute
	// the same query twice.
	tag.lastSearch = ""
	
	tag.events = riot.observable()
	tag.events.on('selected', function() {
		tag.update({resultSelected: true})
	})
	tag.events.on('unselected', function() {
		tag.update({resultSelected: false})
	})

	var debounceSearch = debounce(function(isbn, author, title) {
		if (isbn === "" && author === "" && title === "") {
			return
		}
		let params = {
			base: 'bibbi'
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
		let nextSearch = isbn+author+title
		if (nextSearch === tag.lastSearch) {
			return
		}
		tag.lastSearch = nextSearch
		axios.get('/search/z3950', {params: params})
		.then(function (response) {
			tag.events.trigger('got-results')
			tag.update({
				previews: response.data.previews,
				records: response.data.marc
			})
		})
		.catch(function (response) {
			console.log(response)
		})
	}, debounceMs)

	search(event) {
		debounceSearch(tag.isbn.value, tag.author.value, tag.title.value)
		
		return true
	}

</external-search>