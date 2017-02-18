

log = function(s) { console.log(s); }

///////////////////////////////

db = {
	seq: 10,
	topics: {
		"karma": { first_sq: "q1" }
	},
	questions: {
		"q1": {
			sq_id: "q1",
			text: "Do you have 5 minutes for a quick interview?",
			responses: [
				{ ir_id: "r2", active: true, text: "Yeah, sure!", next_sq_id: null  },
				{ ir_id: "r3", active: true, text: "No, sorry.", next_sq_id: null  },
			]
		}
	},
	responses: {},
}

db_save = function() {
	var json = o2j(db)
	log("db_save: "+json)
	localStorage.setItem("db", json)
}

next_seq = function() {
	return db.seq += 1;
}

fetch_qst = function(qid) {
	return db.questions[qid] || null
}

fetch_rsp = function(rid) {
	var qo = db.questions
	for(var qid in qo) {
		var ro = qo[qid].responses
		for(var i = 0; i < ro.length; i++) {
			var rsp = ro[i];
			if(rsp.ir_id == rid) {
				return rsp
			}
		}
	}
	return null
}

// stub calls that simulate the backend api calls
api_getSQ = function(data, cb) {
	cb({ error: null, data: db.questions[data.sq_id] });
}

api_createIR = function(data, cb) {
	var qst = fetch_qst(data.sq_id);
	if(!qst) {
		cb( { error:"error" } )
	}
	else {
		var rid = "r"+next_seq()
		var rsp = {
			ir_id: rid,
			active: false,
			next_sq_id: null,
			text: data.text,
		}
		qst.responses.push(rsp)
		db_save()
		cb({ir_id:rid})
	}
}

api_deleteIR = function(data, cb) {
	var qo = db.questions
	for(var qid in qo) {
		var ro = qo[qid].responses
		for(var i = 0; i < ro.length; i++) {
			var rsp = ro[i];
			if(rsp.ir_id == data.ir_id) {
				ro = ro.splice(i, 1);
				db_save()
				log("found and removed rsp "+rsp.ir_id+" at index "+i)
				break;
			}
		}
	}
	cb({})
}

api_updateIR = function(data, cb) {
	var rsp = fetch_rsp(data.ir_id);
	if(!rsp) {
		cb( { error:"error" } )
	}
	else {
		if(data.text !== undefined) {
			rsp.text = data.text
		}
		if(data.active !== undefined) {
			rsp.active = data.active
		}
		db_save()
		log("found and updated rsp")
		cb({})
	}
}

////////////////////////////////////////////

cur_qst = null		// the currently displayed question
cur_rsp = null		// the current choice or null

api = function(act, data, cb) {

	// $.ajax(....)
	// XXX call stub functions until real API is in place
	var k = "api_" + act
	log(k+"()")
	var f = window[ k ]
	f(data, function(r) {
		if(r.error) {
			alert("API Error: "+r.error)
		}
		else {
			cb(r)
		}
	})

}

clk_new_topic = function(evt) {
	log("new topic");
}

clk_continue = function(evt) {
	if(cur_rsp) {
		if(cur_rsp === "other") {
			// new response
			var text = $("#other").val().trim()
			if(text) {
				api("createIR", {sq_id: cur_qst.sq_id, text:text}, function(r) {
					reload()
				})
			}
		}
		else {
			var qid = cur_rsp.next_sq_id
			if(qid) {
				load_qst(qid)
			}
			else {
				// end the conversation
				alert("End of conversation")
				jmp("/")
			}
		}
	}
}

clk_delete_response = function(evt) {
	var rsp = cur_rsp
	if(rsp && rsp !== "other") {
		api("deleteIR", { ir_id: rsp.ir_id }, function(r) {
			reload()
		})
	}
}


clk_toggle_active = function(evt) {
	var rsp = cur_rsp
	if(rsp && rsp !== "other") {
		api("updateIR", { ir_id: rsp.ir_id, text: rsp.text, active: (!rsp.active) }, function(r) {
			reload()
		})
	}
}

clk_edit_response = function(evt) {
	var rsp = cur_rsp
	if(rsp && rsp !== "other") {
		var txt = prompt("Edit the text of this response", rsp.text);
		api("updateIR", { ir_id: rsp.ir_id, text: txt }, function(r) {
			reload()
		})
	}
}


clk = function(evt) {
	var k = "clk_" + evt.target.value.toId()
	log(k+"()")
	var f = window[ k ]
	f.apply(this, arguments)
}

$(document).ready(function() {

	log("doc ready");

	var json = localStorage.getItem("db");
	if(json) {
		db = j2o(json);
	}

	$("input[type=button]").click(clk)
	$("input[data=other]").change(function(evt) {
		$("#other").show();
		cur_rsp = "other"
	});

	replicate("tpl_qst", []);
	replicate("tpl_rsp", []);

	load_qst("q1");

});


load_qst = function(qid) {
	log("load qst "+qid)
	cur_qst = null;
	cur_rsp = null;
	api("getSQ", {sq_id: qid}, function(r) {
		if(r.error) {
			alert(r.error)
		}
		else {
			var qst = r.data
			cur_qst = qst

			replicate("tpl_qst", [qst]);

			var rsps = qst.responses
			var a = []
			for(var k in rsps) {
				a.push(rsps[k])
			}
			replicate("tpl_rsp", a, function(e, d, i) {
				//e.rsp = d
				$(e).find("input[type=radio]").change(function() {
					$("#other").hide();
					cur_rsp = d;
				});
				//$(e).find("input[type=button]").click(clk, d)
			})
		}
	});
}



