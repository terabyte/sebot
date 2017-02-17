
import json, sys

# just echo the JSON object back out
print json.dumps(json.load(sys.stdin))
sys.exit(0);

