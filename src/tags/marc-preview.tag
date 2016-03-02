<marc-preview>
	<table>
		<tr><td colspan="2">{opts.record.leader}</td></tr>
		<tr each={opts.record.controlfield}>
			<td><strong>{$.tag}</strong></td>
			<td>{_}</td
		</tr>
		<tr each={opts.record.datafield}>
			<td><strong>{$.tag}</strong>{$.ind1}{$.ind2}</td>
			<td><span each={subfield}><strong>{$.code}</strong> {_} </span></td>
		</tr>
	</table>

	<style scoped>
		* { font-family: monospace; }
		ul { list-style-type: none; padding:0; margin: 0; }
		li { margin: 0; padding: 0; line-height: 1.1em  }
		tbody tr { border-bottom: 0 !important; }
	</style>

</marc-preview>