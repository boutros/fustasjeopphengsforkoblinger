import './marc-preview.tag'

<external-search-results>
	<table class="relative">
		<thead>
			<tr><th colspan="3">Biblioteksentralen</th></tr>
		</thead>
		<tbody>
			<tr each={ preview,i in opts.previews } >
				<td onclick={ set } class="narrow">
					<input onclick={ set } checked={ i == selected } type="radio" name="searchResult" value={i}/>
				</td>
				<td onclick={ set }>{ preview }</td>
				<td class="narrow" onclick={ viewMarc }>
					<div class={ caret: true, open: i == marc }></div>
					<div class={ support-panel: true, hidden: i != marc }>
						<marc-preview record={ parent.opts.records[i] }></marc-preview>
					</div>
				</td>
			</tr>
		<tbody>
	</table>

	<style scoped>
		table { width: 100%; font-size: 90%; }
		tbody tr { border-bottom: 1px solid #ddd; cursor: pointer;}
		td { vertical-align: top; }
		tbody tr:hover { background: #eee; }
		.narrow { width: 1em; }
		input[type="radio"] { cursor: pointer; }
	</style>

	let tag = this

	tag.anySelected = false
	tag.selected = undefined
	tag.marc = undefined
	let parent = tag.parent

	parent.events.on('got-results', function() {
		// clear any selected item or marc preview
		tag.selected = undefined
		tag.marc = undefined
	})

	viewMarc(event) {
		if (tag.marc == event.item.i) {
			// toggle view off
			tag.marc = undefined
		} else {
			tag.marc = event.item.i
		}
	}

	set(event) {
		if (tag.selected == event.item.i) {
			// toggle selection off
			tag.root.querySelectorAll('input')[tag.selected].checked = false
			tag.selected = undefined
			parent.events.trigger('unselected')
		} else {
			if (tag.selected) {
				tag.root.querySelectorAll('input')[tag.selected].checked = false
			}
			tag.selected = event.item.i
			tag.root.querySelectorAll('input')[tag.selected].checked = true
			parent.events.trigger('selected')
		}

		// e.preventDefault(), since we manually checked/unchecked the radio buttons
		return false
	}

</external-search-results>