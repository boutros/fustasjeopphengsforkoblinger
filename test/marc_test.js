import { marc2rdf } from '../src/marc.js'
import { Graph, NamedNode, Literal, Triple } from '../src/rdf.js'
import xml2js from 'xml2js'
import test from 'ava'

const xmlSample = `
<record>
	<leader>00450 am a2200157 4500</leader>
	<controlfield tag="001">60067</controlfield>
	<controlfield tag="008">a 10nob 2</controlfield>
	<datafield tag="015" ind1=" " ind2=" ">
		<subfield code="a">0017496</subfield>
		<subfield code="b">BIBBI</subfield>
	</datafield>
	<datafield tag="020" ind1=" " ind2=" ">
		<subfield code="a">82-05-17560-8</subfield>
		<subfield code="b">ib.</subfield>
	</datafield>
	<datafield tag="035" ind1=" " ind2=" ">
		<subfield code="a">0017496</subfield>
	</datafield>
	<datafield tag="100" ind1=" " ind2="0">
		<subfield code="a">Vonnegut, Kurt</subfield>
		<subfield code="d">1922-2007</subfield>
		<subfield code="j">am.</subfield>
	</datafield>
	<datafield tag="240" ind1="1" ind2="0">
		<subfield code="a">Bluebeard</subfield>
	</datafield>
	<datafield tag="245" ind1="1" ind2="0">
		<subfield code="a">Blåskjegg</subfield>
		<subfield code="b">roman</subfield>
		<subfield code="c">
			Kurt Vonnegut ; oversatt av Torstein Bugge Høverstad
		</subfield>
	</datafield>
	<datafield tag="260" ind1=" " ind2=" ">
		<subfield code="a">Oslo</subfield>
		<subfield code="b">Gyldendal</subfield>
		<subfield code="c">1990</subfield>
	</datafield>
	<datafield tag="300" ind1=" " ind2=" ">
		<subfield code="a">271 s.</subfield>
	</datafield>
	<datafield tag="500" ind1=" " ind2=" ">
		<subfield code="a">Originaltittel: Bluebeard</subfield>
	</datafield>
</record>`



test("marc2rdf", t =>  {
	let ns = 'http://test/ontology/'
	let pred = function(pred) { return new NamedNode(ns+pred) }
	let uri = function(uri)   { return new NamedNode(uri) }
	let lit = function(val)   { return new Literal(val) }

	let want = new Graph()
	let subj = uri('http://test/p/1')
	want.insert(
		new Triple(subj, pred('mainTitle'), lit('Blåskjegg')),
		new Triple(subj, pred('subtitle'), lit('roman')),
		new Triple(subj, pred('publishYear'), lit('1990')),
		new Triple(subj, pred('numPages'), lit('271')))

	let xml
	xml2js.parseString(xmlSample, function (err, data) {
		if (err) {
			throw err
		} else {
			xml = data
		}
	})

	let got = marc2rdf(xml.record, 'http://test/p/1', ns)

	t.true(want.equals(got))
})