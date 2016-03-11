import '../tags/external-search.tag'
import '../tags/tabs.tag'
import '../tags/main-entry.tag'
import '../tags/literal-input.tag'

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
			<h4>Hovedinnførsel</h4>
			<main-entry></main-entry>
		</div>
	</div>
	<div class="row">
		<div class="col half panel">
			<h4>Beskriv utgivelse</h4>
			<h5>Tittelopplysninger</h5>
			<p>
				<strong>Hovedtittel</strong>
				<literal-input></literal-input>
			</p>
			<p>
				<strong>Undertittel</strong>
				<literal-input></literal-input>
			</p>
			<p>
				<strong>Deltittel</strong>
				<literal-input></literal-input>
			</p>
			<p>
				<strong>Delnummer</strong>
				<literal-input></literal-input>
			</p>
		</div>
	</div>
	<div class="row">
		<div class="col half panel">
			<h4>Beskriv verk</h4>
		</div>
	</div>
	<div class="row">
		<div class="col half panel">
			<h4>Emner og sjangrer</h4>
		</div>
	</div>
	<div class="row">
		<div class="col half panel">
			<h4>Deler</h4>
		</div>
	</div>
	<div class="row">
		<div class="col half panel">
			<h4>Biinførsler</h4>
		</div>
	</div>

	let tag = this

	tag.tabs = ["Hovedinnførsel", "Beskriv utgivelse", "Beskriv verk", "Emner og sjangrer", "Deler", "Biinførsler"]
</book>