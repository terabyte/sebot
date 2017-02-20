

log = function(s) { console.log(s); }

cur_qst = null		// the currently displayed question
//cur_rsp = null		// the current choice or null

api = function(act, data, cb) {

	log("api >>--> "+act+" "+o2j(data));
	var url = "/api/?action="+act+"&data="+encodeURIComponent(o2j(data))
	$.get(url, function(r) {
		log("ajax <--<< "+o2j(r));
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
clk_toggle_admin_controls = function() {
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

clk_submit = function() {
	//if(cur_rsp) {
		//if(cur_rsp === "other") {
			// new response
			var text = $("#other").val().trim()
			if(text) {
				api("createRsp", {qid: cur_qst.qid, text:text}, function(r) {
					reload()
				})
			}
		//}
		/*else {
			var qid = cur_rsp.next_qid
			if(qid) {
				jmp("/?qid="+qid);
			}
			else {
				// end the conversation
				//alert("End of conversation")
				$(".page").hide();
				$(".page.finish").show();
			}
		}*/
	//}
}



/*clk_add_response = function() {
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
}*/

clk_delete_response = function(evt) {
	var rsp = evt.target.parentElement.rsp;
	if(confirm("Are you sure you want to delete response "+rsp.rid)) {
		if(rsp && rsp !== "other") {
			api("deleteRsp", { rid: rsp.rid }, function(r) {
				reload()
			})
		}
	}
}


clk_edit_response = function(evt) {
	var rsp = evt.target.parentElement.rsp;
	if(rsp && rsp !== "other") {
		var txt = prompt("Edit the text of this response", rsp.text);
		if(txt) {
			api("updateRsp", { rid: rsp.rid, text: txt }, function(r) {
				reload()
			})
		}
	}
}

clk_toggle_active = function(evt) {
	var rsp = evt.target.parentElement.rsp;
	if(rsp && rsp !== "other") {
		api("updateRsp", { rid: rsp.rid, text: rsp.text, active: (!rsp.active) }, function(r) {
			reload()
		})
	}
}

clk_link = function(evt) {
	var rsp = evt.target.parentElement.rsp;
	if(rsp) {

		var nqid = rsp.next_qid;
		if(nqid) {
			if(!confirm("This response is already linked to question "+nqid+".  Sure you want to continue?")) {
				return;
			}
		}
		var text = prompt("Enter the text of the next question.", "");
		if(!text) {
			return;
		}

		api("createQst", { text: text }, function(r) {
			var nquid = r.qid;
			api("updateRsp", { rid: rsp.rid, next_qid: nquid }, function(r) {
				jmp("/?qid="+nquid)
			})
		})
	}
	
}

clk_edit_question = function() {
	var qst = cur_qst
	//if(qst) {
		var txt = prompt("Edit the text of this question", qst.text);
		if(txt) {
			api("updateQst", { qid: qst.qid, text: txt }, function(r) {
				reload()
			})
		}
	//}
}

clk_yes = function() {
	jmp("/?qid=q1");
}

clk = function(evt) {
	var k = "clk_" + evt.target.value.toId()
	log(k+"()")
	evt.preventDefault();
	var f = window[ k ]
	f.apply(this, arguments)
	return false;
}

load_qst = function(qid) {
	log("load qst "+qid)
	cur_qst = null;
	//cur_rsp = null;
	api("getQst", {qid: qid}, function(r) {
		var qst = r.data
		cur_qst = qst

		replicate("tpl_qst", [qst], function(e, d, i) {
			$(e).find("input[type=button]").click(clk)
		});

		var rsps = qst.responses
		var a = []
		for(var k in rsps) {
			a.push(rsps[k])
		}
		replicate("tpl_rsp", a, function(e, d, i) {
			//$(e).find("input[type=button]").each(function(el) { el.rsp = d });
			e.rsp = d;
			/*
			$(e).find("input[type=radio]").change(function() {
				$("#other").hide();
				cur_rsp = d;
			});
			*/
			$(e).click(function() {
				var qid = d.next_qid
				if(qid) {
					jmp("/?qid="+qid);
				}
				else {
					// end the conversation
					//alert("End of conversation")
					$(".page").hide();
					$(".page.finish").show();
				}
			})
			$(e).find("input[type=button]").click(clk)
		})
		update_admin();
		$(".page.talk").show();
	});
}


$(document).ready(function() {

	log("doc ready");

	var json = localStorage.getItem("db");
	if(json) {
		db = j2o(json);
	}

	$("input[type=button]").click(clk)
	//$("input[data=other]").change(function(evt) {
	//	$("#other").show();
		//cur_rsp = "other"
	//});

	replicate("tpl_qst", []);
	replicate("tpl_rsp", []);

	var qd = getQueryData()

	var qid = qd.qid
	if(qid) {
		load_qst(qid)
	}
	else {
		$(".page.welcome").show();
		update_admin();
	}

	//$(".other_choice").click(function() {
		//$("#other").hide();
	//});
	
});



