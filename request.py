import sqlite3
import json
import sys
import os


def getTopics(input, output):
    global conn
    output['data'] = []
    for row in conn.execute("select topic, description, first_qid from topics"):
        obj = {'topic': row[0], 'description': row[1], 'first_qid': row[2]}
        output['data'] += [json.loads(json.dumps(obj))]


def getQst(input, output):
    global conn
    sq = conn.execute("select text from qst where qid=(?)", (input['qid'],)).fetchone()
    output['text'] = sq[0]
    output['responses'] = []
    for row in conn.execute("select rsp.rid, active, text, next_qid "
                            "from rsp, qst_choices_rsp, choices_next_qst "
                            "where qst_choices_rsp.qid=(?) and rsp.rid=qst_choices_rsp.rid "
                            "and qst_choices_rsp.choice_id = choices_next_qst.choice_id order by count desc",
                            (input['qid'],)):
        obj = {'rid': row[0], 'active': row[1], 'text': row[2], 'next_qid': row[3]}
        output['responses'] += [json.loads(json.dumps(obj))]


def createQst(input, output):
    global conn
    conn.execute("insert into qst(text) values(?)", (input['text'],))
    res = conn.execute("select last_insert_rowid()").fetchone()
    output['qid'] = res[0]


def updateQst(input, output):
    global conn
    conn.execute("update qst set text=(?) where qid=(?)", (input['text'], input['qid'],))


def deleteQst(input, output):
    global conn
    conn.execute("delete from qst where qid=(?)", (input['qid'],))


def createRsp(input, output):
    global conn
    conn.execute("insert into rsp(text) values(?)", (input['text'],))
    irid = conn.execute("select last_insert_rowid()").fetchone()[0]
    output['rid'] = irid
    chid = conn.execute("insert into qst_choices_rsp(qid,rid,active) values(?,?,?)",
                        (input['qid'], irid, 1 if input['active'] is True else 0)).fetchone()[0]


def updateRsp(input, output):
    conn.execute("update rsp set text=(?) where rid=(?)", (input['text'], input['rid']))
    conn.execute("update qst_choices_rsp set active=(?) where rid=(?)",
                 (1 if input['active'] is True else 0, input['rid']))
    conn.execute("update choices_next_qst set next_qid=(?) where choice_id in "
                 "(select choice_id from qst_choices_rsp where rid=(?))",
                 (input['next_qid'], input['rid']))


def deleteRsp(input, output):
    conn.execute("delete from rsp where rid=(?)", (input['rid'],))


input = json.load(sys.stdin)
conn = sqlite3.connect(os.path.join('database', 'qna.db'))
output = {}
output['error'] = None
globals()[input['action']](input, output)
print(json.dumps(output))
conn.commit()
conn.close()
sys.stdout.flush()
sys.exit(0)
