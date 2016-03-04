<person-search-results >
	<div class="outer">
		<div each={ res, i in opts.results } class="box">
			<div class="radio">
				<input type="radio" name="person"/>
			</div>
			<div class="result relative">
				<div class="clickable" onclick={ toggleWorks }><strong>{ res.person.name }</strong></div>
				<div>
					<span if={ res.person.birthYear}>{ res.person.birthYear } - </span>
					{ res.person.deathYear}
					<span if={ res.person.nationality }>, { res.person.nationality }</span>
				</div>

				<div if={ res.person.work } onclick={ toggleWorks }
					class={ caret: true, openup: parent.visibleWorks[i] }>
				</div>
				<ul if={ res.person.work && parent.visibleWorks[i] }>
					<li each={ res.person.work} class="relative">
						{ mainTitle }
						<span if={ publicationYear}>({publicationYear})</span>
						<input class="choose-work" name={ res.person.name } type="radio"/>
					</li>
				</ul>
			</div>
		</div>
		<p if={ opts.results.length == 0 }><em>Ingen treff</em></p>
	</div>

	let tag = this

	tag.visibleWorks = {}

	toggleWorks(event) {
		let i = event.item.i
		if (tag.visibleWorks[i]) {
			tag.visibleWorks[i] = undefined
		} else {
			tag.visibleWorks[i] = true
		}
	}

	<style scoped>
		.outer { box-sizing: border-box; border: 4px solid #ded; background: #ded;
	             position: absolute; top:0; right: -30rem; width: 28rem;
	             max-height: 20rem; overflow-y: auto; font-size: 90%;}
		.radio { display: inline-block; width: 10%; padding: 0.5em; box-sizing: border-box; float: left;}
		.box { border-bottom: 2px solid #fff; clear:both; }
		.result { display: inline-block; float: left; width: 90%; }
		.caret { position: absolute; top: 1em; right: 1em;}
		.choose-work { position: absolute; top: 0.5em; right: 1em; }
		li { border-bottom: 2px solid #444; cursor: pointer;}
	</style>
</person-search-results>