import './dropdown.tag'
import './authority-search.tag'
import './person-search-results.tag'

<main-entry>
	<div if={ !noMainEntry }>
		<p>
			<strong>Type: </strong>
			<dropdown options={ types } events={ events }></dropdown>
		</p>
		<p class="relative">
			<authority-search type={ type } events={ events }></authority-search>
			<person-search-results if={ type === "Person" && results } results={ results }></person-search-results>
			<corporation-search-results if={ type === "Corporation" && results }></corporation-search-results>
		</p>
	</div>
	<p>
		<input onClick={ toggleMainEntry } type="checkbox" />
		<label>boken har ingen hovedinnførsel</label>
	</p>
	let tag = this

	tag.types = [
		{label: "Person", value: "Person"},
		{label: "Korporasjon", value: "Corporation"}]
	tag.type = tag.types[0].value
	tag.results = undefined
	tag.value // selected main entry (person or corporation URI)
	tag.noMainEntry = false

	toggleMainEntry() {
		tag.noMainEntry = !tag.noMainEntry
		return true // check the box
	}

	tag.events = riot.observable()
	tag.events.on('selected', function(value) {
		tag.update({ type: value })
	})
	tag.events.on('searching', function(res) {
		tag.update({ results: undefined })
	})
	tag.events.on('searchResults', function(res) {
		tag.update({ results: res })
	})
</main-entry>