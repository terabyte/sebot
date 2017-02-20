

// Standard node.js modules
var exec = require("child_process").exec;
var spawn = require("child_process").spawn;
var util = require("util");
var fs = require("fs");
var path = require("path");
var http = require('http')
var url = require("url")
var querystring = require('querystring');

// 3rd partynode.js modules
var send = require("send");

// Sleepless Inc. modules
require("sleepless")
require("g")("log5");
DS = require("ds").DS


/////////////////////

db = new DS("db.json");
if(!db.questions) {
	db.seq = 10
	db.questions = {
		"q1": {
			qid: "q1",
			text: "Would you like to talk about karma?",
			responses: [
				{ rid: "r2", active: true, text: "Yeah, sure!", next_qid: null  },
				{ rid: "r3", active: true, text: "No, sorry.", next_qid: null  },
			]
		}
	}
	db.responses = {}
}
/*
read_file = function(path) { try { return fs.readFileSync("db.json") } catch(e) { return null } }
db_save = function() { fs.writeFileSync("db.json", o2j(db)) }
db = read_file("db.json")
if(!db) {
	db = {
		seq: 10,
		topics: {
			"karma": { first_sq: "q1" }
		},
		questions: {
			"q1": {
				qid: "q1",
				text: "Do you have 5 minutes for a quick interview?",
				responses: [
					{ rid: "r2", active: true, text: "Yeah, sure!", next_qid: null  },
					{ rid: "r3", active: true, text: "No, sorry.", next_qid: null  },
				]
			}
		},
		responses: {},
	}
	db_save();
}
*/
next_seq = function() { return db.seq += 1; }
I("db="+o2j(db))


///////////////////////////

fetch_qst = function(qid) {
	return db.questions[qid] || null
}

fetch_rsp = function(rid) {
	var qo = db.questions
	for(var qid in qo) {
		var ro = qo[qid].responses
		for(var i = 0; i < ro.length; i++) {
			var rsp = ro[i];
			if(rsp.rid == rid) {
				return rsp
			}
		}
	}
	return null
}

// stub calls that simulate the backend api calls
api_getQst = function(data, cb) {
	var qid = data.qid
	var qst = db.questions[qid]
	if(qst) {
		cb({ error: null, data: qst });
	}
	else {
		cb({error:"not found: "+qid});
	}
}

api_createRsp = function(data, cb) {
	var qid = data.qid
	var qst = fetch_qst(qid);
	if(!qst) {
		cb( { error:"not found "+qid } )
	}
	else {
		var rid = "r"+next_seq()
		var rsp = {
			rid: rid,
			active: !!data.active,
			next_qid: null,
			text: data.text,
		}
		qst.responses.push(rsp)
		db.save()
		I("created new rsp "+rid+" for qst "+qid)
		cb({rid:rid})
	}
}

api_deleteRsp = function(data, cb) {
	var qo = db.questions
	for(var qid in qo) {
		var ro = qo[qid].responses
		for(var i = 0; i < ro.length; i++) {
			var rsp = ro[i];
			if(rsp.rid == data.rid) {
				ro = ro.splice(i, 1);
				db.save()
				I("found and removed rsp "+rsp.rid+" at index "+i)
				break;
			}
		}
	}
	cb({})
}

api_updateRsp = function(data, cb) {
	var rid = data.rid
	var rsp = fetch_rsp(rid);
	if(!rsp) {
		cb( { error:"not found: "+rid } )
	}
	else {
		if(data.text !== undefined) {
			rsp.text = data.text
		}
		if(data.active !== undefined) {
			rsp.active = data.active
		}
		if(data.next_qid !== undefined) {
			rsp.next_qid = data.next_qid
		}
		db.save()
		I("found and updated rsp: "+rid)
		cb({})
	}
}

api_createQst = function(data, cb) {
	var text = data.text || "(New question)";
	var qid = "q"+next_seq()
	var qst = {
		qid: qid,
		text: text,
		responses: [],
	}
	db.questions[qid] = qst
	db.save()
	I("created new question "+qid)
	cb({qid: qid})
}

api_updateQst = function(data, cb) {
	var qid = data.qid
	var qst = fetch_qst(qid);
	if(!qst) {
		cb( { error:"not found: "+qid } )
	}
	else {
		if(data.text !== undefined) {
			qst.text = data.text
		}
		db.save()
		I("found and updated qst: "+qst)
		cb({})
	}
}

/////////

api = function(act, data, cb) {
	var k = "api_" + act
	I(k+"()")
	var f = global[ k ]
	f(data, function(r) {
		if(r.error) {
			E("API Error: "+r.error)
		}
		cb(r)
	})

}

/////////////////////////////////


var PORT = toInt(process.argv[2]) || 12345


http.createServer(function(req, res) {
	var u = url.parse(req.url)
	var path = u.pathname

	if(path == "/api/") {
		var qa = querystring.parse(u.query)
		//I("qa.data="+qa.data)
		//I("  json="+decodeURIComponent(qa.data))
		var data = j2o(qa.data)
		I("API: action="+qa.action+" data="+o2j(data))

		res.writeHead(200, {"Content-Type": "application/json" });

		if(true) {
			api(qa.action, data, function(r) {
				res.write(o2j(r))
				res.end()
			});
		}
		else {
			var p = spawn( "/usr/bin/python", [ "request.py" ])

			p.stdin.write(o2j(qa));
			p.stdout.pipe(res);
			p.stdin.end();

			p.on("close", function(code) {
				if(code != 0) {
					E("Python return code: "+code);
				}
				res.end();
			});
		}

		return
	}

	I(req.method+" "+path);
	send(req, "./site"+path).pipe(res)		// send static file

}).listen(PORT, function() {
	I("Listening on "+PORT);
})

