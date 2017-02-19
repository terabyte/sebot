import sqlite3
import json
import sys
import os


def getTopics(input, output):
    global conn
    output['data'] = []
    for row in conn.execute("select topic, description, first_sq_id from topics"):
        obj = {'topic': row[0], 'description': row[1], 'first_sq_id': row[2]}
        output['data'] += [json.loads(json.dumps(obj))]


def getSQ(input, output):
    global conn
    sq = conn.execute("select text from sq where sq_id=(?)", (input['sq_id'],)).fetchone()
    output['text'] = sq[0]
    output['responses'] = []
    for row in conn.execute("select ir.ir_id, active, text, next_sq_id "
                            "from ir, sq_choices_ir, choices_next_sq "
                            "where sq_choices_ir.sq_id=(?) and ir.ir_id=sq_choices_ir.ir_id "
                            "and sq_choices_ir.choice_id = choices_next_sq.choice_id order by count desc",
                            (input['sq_id'],)):
        obj = {'ir_id': row[0], 'active': row[1], 'text': row[2], 'next_sq_id': row[3]}
        output['responses'] += [json.loads(json.dumps(obj))]


def createSQ(input, output):
    
    pass


def updateSQ(input, output):
    pass


def deleteSQ(input, output):
    pass


def createIR(input, output):
    pass


def updateIR(input, output):
    pass


def deleteIR(input, output):
    pass


input = json.load(sys.stdin)
conn = sqlite3.connect(os.path.join('database', 'qna.db'))
output = {}
output['error'] = None
globals()[input['action']](input, output)
print(json.dumps(output))
sys.stdout.flush()
sys.exit(0)
