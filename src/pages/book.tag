import '../tags/external-search.tag'
import '../tags/tabs.tag'

<book>
	<div class="row">
		<div class="col">
			<h3>Katalogisering av bok</h3>
			<tabs targets={ tabs }></tabs>
		</div>
		<div class="col half panel">
			<external-search /></external-search>
		</div>
	</div>
	<div class="row">
		<div class="col half panel">
			<h4>Person (hovedinnførsel)</h4>
		</div>
	</div>

	let tag = this

	tag.tabs = ["Hovedinnførsel", "Beskriv utgivelse", "Beskriv verk", "Emner og sjangrer", "Deler", "Biinførsler"]
</book>