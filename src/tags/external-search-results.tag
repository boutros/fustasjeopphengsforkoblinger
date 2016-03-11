import './marc-preview.tag'

<external-search-results>
	<table class="relative" each={ name, base in opts.results }>
		<thead if={ base.records || base.searching }>
			<tr><th colspan="3">{ labelFor(name) }</th></tr>
			<tr if={ base.searching }>
				<th colspan="3">
					<div class="loading"><span>.</span><span>.</span><span>.</span></div>
				</th>
			</tr>
		</thead>
		<tbody>
			<tr if={ base.records && base.records.length == 0}>
				<td colspan="3"><em>Ingen treff</em></td>
			</tr>
			<tr each={ preview, i in base.previews } >
				<td onclick={ select(parent.name) } class="narrow">
					<input class={ parent.name } onclick={ select(parent.name) } type="radio" name="searchResult" />
				</td>
				<td onclick={ select(parent.name) }>{ preview }</td>
				<td class="narrow" onclick={ viewMarc(parent.name) }>
					<div class={ caret: true, open: i == previewingMarc.i && previewingMarc.base === parent.name }></div>
					<div class={ support-panel: true, hidden: i != previewingMarc.i || previewingMarc.base !== parent.name }>
						<marc-preview record={ parent.base.records[i] }></marc-preview>
					</div>
				</td>
			</tr>
		<tbody>
	</table>

	<style scoped>
		table { width: 100%; font-size: 90%; margin-bottom: 1em;}
		tbody tr { border-bottom: 1px solid #ddd; cursor: pointer;}
		td { vertical-align: top; }
		tbody tr:hover { background: #eee; }
		.narrow { width: 1em; }
		input[type="radio"] { cursor: pointer; }
	</style>

	let tag = this

	tag.anySelected = false
	tag.selected = {
		base: undefined,
		i: undefined
	}
	tag.previewingMarc = {
		base: undefined,
		i: undefined
	}
	let parent = tag.parent

	tag.labelFor = function(name) {
		switch (name) {
			case 'bibbi':
				return "Biblioteksentralen"
			case 'loc':
				return "Library Of Congress"
			default:
				return "BUG: ukjent kilde"
		}
	}

	parent.events.on('got-results', function() {
		// clear any selected item or marc preview
		tag.selected = {
			base: undefined,
			i: undefined
		}
		tag.previewingMarc = {
			base: undefined,
			i: undefined
		}
	})

	viewMarc(base) {
		return function(event) {
			tag.previewingMarc.base = base
			if (tag.previewingMarc.i == event.item.i) {
				// toggle view off
				tag.previewingMarc.i = undefined
				tag.previewingMarc.base = undefined
			} else {
				tag.previewingMarc.i = event.item.i
			}
		}
	}

	select(base) {
		return function(event) {
			if ( (tag.selected.base === base) && (tag.selected.i == event.item.i) ) {
				// toggle selection off
				tag.root.getElementsByClassName(base)[tag.selected.i].checked = false
				tag.selected.base = undefined
				tag.selected.i = undefined
				parent.events.trigger('unselected')
			} else {
				if (tag.selected.i) {
					tag.root.getElementsByClassName(base)[tag.selected.i].checked = false
				}
				tag.selected.base = base
				tag.selected.i = event.item.i
				tag.root.getElementsByClassName(base)[tag.selected.i].checked = true
				parent.events.trigger('selected', tag.opts.results[base].records[tag.selected.i])
			}

			// e.preventDefault(), since we manually checked/unchecked the radio buttons
			return false
		}
	}

</external-search-results>