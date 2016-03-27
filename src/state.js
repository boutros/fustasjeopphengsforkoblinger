import { DB } from './db.js'

// The resource currently beeing edited; the "center" node of the graph.
let centerNode = ""

// All transactions are handled by db object.
let db = new DB

// Ontology namespace
let ns = "http://192.168.50.12:8005/ontology#"

// The state object with global variables:
export default {
	db,
	centerNode,
	ns
}