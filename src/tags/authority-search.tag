import { debounce} from '../common.js'

<authority-search class="relative" type={ opts.type }>
	<input oninput={ doSearch } type="search"/>
	<div if={ query !== "" } class={ caret: true, open: gotResults }></div>

	<style scoped>
		input { width: 100%; }
		.caret { position: absolute; top: 0.25em; right: 0.25em; }
	</style>

	const debounceMs = 400

	let tag = this
	let dummyRes = [
		{
			"person": {
				"name":  "Healey, Emma",
				"birthYear": "1915",
				"deathYear": "1972",
				"nationality": "Engelsk",
				"work": [
					{
						"mainTitle": "Mitt siste verk",
						"publicationYear": "1946",
					},
					{
						"mainTitle": "Mitt første verk",
						"publicationYear": "1931",
					},
				]
			}
		},
		{
			"person": {
				"name":  "Healey, Emmanuel",
				"birthYear": "1832",
				"deathYear": "1893",
				"nationality": "Engelsk",
				"work": [
					{
						"mainTitle": "My only book",
						"publicationYear": "1845",
					}
				]
			}
		},
		{
			"person": {
				"name":  "Healey, Ernest",
				"birthYear": "1942",
				"deathYear": "2004",
				"nationality": "Skotsk"
			}
		}

	]

	tag.query = ""
	tag.gotResults = false

	let debouncedSearch = debounce(
		function(query) {
			setTimeout(function() {
				tag.gotResults = true
				tag.opts.events.trigger('searchResults', dummyRes)
			}, 500) }, debounceMs)

	doSearch(event) {
		tag.gotResults = false
		tag.query = event.target.value.trim()
		if (tag.query === "") {
			tag.opts.events.trigger('searchResults',[])
			return
		}
		tag.opts.events.trigger('searching')
		debouncedSearch(tag.query)
	}

</authority-search>