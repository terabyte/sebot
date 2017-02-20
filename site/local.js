

log = function(s) { console.log(s); }

cur_qst = null		// the currently displayed question
cur_rsp = null		// the current choice or null

api = function(act, data, cb) {

	var url = "/api/?action="+act+"&data="+encodeURIComponent(o2j(data))
	log("ajax >>--> "+url);
	$.get(url, function(r) {
		log("ajax <--<< "+r);
		cb(r)
	});
}


admin = localStorage.getItem("admin") === "true"

update_admin = function() {
	if(admin) {
		$(".admin").show();
		$(".active_false").show();
	}
	else {
		$(".admin").hide();
		$(".active_false").hide();
	}
}
clk_toggle_admin = function() {
	admin = !admin;
	localStorage.setItem("admin", ""+admin)
	update_admin();
}

clk_wipe_data = function() {
	localStorage.clear();
	jmp("/");
}


clk_new_topic = function() {
	log("new topic");
}

clk_continue = function() {
	if(cur_rsp) {
		if(cur_rsp === "other") {
			// new response
			var text = $("#other").val().trim()
			if(text) {
				api("createRsp", {qid: cur_qst.qid, text:text}, function(r) {
					reload()
				})
			}
		}
		else {
			var qid = cur_rsp.next_qid
			if(qid) {
				jmp("/?qid="+qid);
			}
			else {
				// end the conversation
				alert("End of conversation")
				jmp("/")
			}
		}
	}
}



clk_add_response = function() {
	if(!cur_qst) {
		return;
	}
	var text = prompt("Enter the text of the new response.", "");
	if(!text) {
		return;
	}
	api("createRsp", { qid:cur_qst.qid, active: true, text: text }, function(r) {
		reload()
	})
}

clk_delete_response = function() {
	var rsp = cur_rsp
	if(rsp && rsp !== "other") {
		api("deleteRsp", { rid: rsp.rid }, function(r) {
			reload()
		})
	}
}


clk_toggle_active = function() {
	var rsp = cur_rsp
	if(rsp && rsp !== "other") {
		api("updateRsp", { rid: rsp.rid, text: rsp.text, active: (!rsp.active) }, function(r) {
			reload()
		})
	}
}

clk_edit_response = function() {
	var rsp = cur_rsp
	if(rsp && rsp !== "other") {
		var txt = prompt("Edit the text of this response", rsp.text);
		api("updateRsp", { rid: rsp.rid, text: txt }, function(r) {
			reload()
		})
	}
}

clk_link = function() {
	var rsp = cur_rsp
	if(!rsp) {
		return;
	}

	var nqid = rsp.next_qid;
	if(nqid) {
		if(!confirm("This response is already linked to a question.  Do you want to continue?")) {
			return;
		}
	}
	var text = prompt("Enter the text of the next question.", "");
	if(!text) {
		return;
	}

	api("createQst", { text: text }, function(r) {
		var nquid = r.qid;
		api("updateRsp", { rid: cur_rsp.rid, next_qid: nquid }, function(r) {
			jmp("/?qid="+nquid)
		})
	})
	
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

	var qd = getQueryData()
	
	var qid = qd.qid
	if(!qid) {
		jmp("/?qid=q1");
	}
	else {
		load_qst(qid)
	}

});


load_qst = function(qid) {
	log("load qst "+qid)
	cur_qst = null;
	cur_rsp = null;
	api("getQst", {qid: qid}, function(r) {
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
		update_admin();
	});
}


