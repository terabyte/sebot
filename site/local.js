

log = function(s) { console.log(s); }

db = {
	seq: 0,
	topics: {
		"karma": { first_sq: "q1" }
	},
	questions: {
		"q1": {
			sq_id: "q1",
			text: "Do you have 5 minutes for a quick interview?",
			responses: [
				{ ir_id: "r2", active: true, text: "Yeah, sure!", next_sq_id: null  },
				{ ir_id: "r4", active: true, text: "No, sorry.", next_sq_id: null  },
			]
		}
	},
	responses: {},
}

db_save = function() { localStorage.setItem("db", o2j(db)) }

////////////////////////////////

cur_qst = null		// the currently displayed question
cur_rsp = null		// the current choice or null

api = function(act, data, cb) {
	window[ "act_" + act ](data, cb)
}

act_getSQ = function(data, cb) {
	cb({ error: null, data: db.questions[data.sq_id] });
}

clk_new_topic = function(evt) {
	log("new topic");
}

clk_continue = function(evt) {
	if(cur_rsp) {
		log("continue")

		if(cur_rsp === "other") {
			// new response
			var text = $("#other").val().trim()
			if(text) {
				api("createIR", {sq_id: cur_qst.sq_id, text:text}, function(r) {
					if(r.error) { alert(r.error) }
					document.location.reload()
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
				document.location = "/"
			}
		}
	}
}


$(document).ready(function() {

	log("doc ready");

	var json = localStorage.getItem("db");
	if(json) {
		db = j2o(json);
	}

	$("input[type=button]").click(function(evt) {
		window[ "clk_" + this.value.toId() ](evt);
	});
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
				$(e).find("input").change(function() {
					$("#other").hide();
					cur_rsp = d;
				});
			})
		}
	});
}



