

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
			text: "Would you like to talk about karma?",
			responses: [ "r2", "r3", ]
		}
	}
	db.responses = {
		"r2": { active: true, text: "Yeah, sure!", next_qid: null  },
		"r3": { active: true, text: "No, sorry.", next_qid: null  },
	}
}
next_seq = function() { return db.seq += 1; }
I("db="+o2j(db))

///////////////////////////

fetch_qst = function(qid) {
	return db.questions[qid] || null
}

fetch_rsp = function(rid) {
	return db.responses[rid] || null
	/*
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
	*/
	return null
}

// stub calls that simulate the backend api calls

api_getQst = function(data, cb) {
	var qid = data.qid
	var qst = j2o(o2j(db.questions[qid]))	// clone it
	if(qst) {
		qst.qid = qid;
		for(var i = 0; i < qst.responses.length; i++) {
			var rid = qst.responses[i]
			var rsp = fetch_rsp(rid)
			rsp.rid = rid
			qst.responses[i] = rsp
		}
		cb({ error: null, data: qst });
	}
	else {
		cb({error:"not found: "+qid});
	}
}

api_createRsp = function(data, cb) {

	var rid = "r"+next_seq()
	var rsp = {
		active: !!data.active,
		next_qid: null,
		text: data.text,
	}
	db.responses[rid] = rsp
	I("created new rsp "+rid)

	// if optional qid provided, append the rsp to it
	var qid = data.qid
	if(qid) {
		var qst = fetch_qst(qid);
		if(qst) {
			qst.responses.push(rid)
			I("appended rsp "+rid+" to qst "+qid)
		}
	}

	db.save();

	cb({rid:rid})
}

api_deleteRsp = function(data, cb) {
	var rid = data.rid
	if(db.responses[rid]) {
		delete db.responses[rid]
		db.save();
		I("found and removed rsp "+rid)
	}
	cb({})

	// remove any references to the response from the questions
	var qo = db.questions
	for(var qid in qo) {
		var ro = qo[qid].responses
		for(var i = 0; i < ro.length; i++) {
			if(ro[i] == rid) {
				ro = ro.splice(i, 1);
			}
		}
	}
	db.save()
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

