import sqlite3
import json
import sys
import os


def getTopics(input, output):
    global conn
    output['data'] = []
    for row in conn.execute("select * from topics"):
        print(row)
        obj = {}
        obj['topic'] = row[0]
        obj['description'] = row[1]
        obj['first_sq_id'] = row[2]
        output['data'] += obj
    pass


def getSQ(input, output):
    pass


def otherResponse(input, output):
    pass


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
