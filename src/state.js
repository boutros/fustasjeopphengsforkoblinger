import { DB } from './db.js'

// when numPendingTasks > 0 UI will show that system is performing IO
let numPendingTasks = 0

let syncFn = function(...txs) {
	console.log("simulating sync to services:")
	for (let tx of txs) {
		console.log(tx)
	}
	// TODO:
	// numPendingTasks++
	// send PATCH services
}

// The resource currently beeing edited; the "center" node of the graph.
let centerNode = ""

// All transactions are handled by db object.
let db = new DB(remoteSync=syncFn)

// Ontology namespace
let ns = "http://192.168.50.12:8005/ontology#"

// The state object with global variables:
export default {
	db,
	centerNode,
	ns,
	numPendingTasks
}