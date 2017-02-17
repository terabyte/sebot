# sebot


request.py
-----------
	
The script that is run on every request to "/api/".
It takes a JSON object as input and produces a JSON object as output

The input should look like:

	{
		action: "action_string", /* The action that is requested */
		/* any other values that the action requires.  arguments, data, etc. */
	}

The output should look like:
	
	{
		error: "text explaining what went wrong, or null if no error",
		data: { /* the response on a normal exit, or optional extra data on error */ }
	}


Examples
--------

Request the first question and array of answers for an SE dialogue about karma:

Input:

	{
		action: "start",
		topic: "karma"
	}

Output:
	{
		eror: null,
		data: {
			id: "KARMA_1",
			question: "How do you define karma?",
			answers: [
				"What goes around, comes around.",
				"If you good things, you will be rewarded, but if you do bad things ...",
			]
		}
	}

