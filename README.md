# sebot


## request.py
	
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


### Examples

#### Request the first question and array of answers for an SE dialogue about karma:

Input:

	{
		action: "start",
		topic: "karma"
	}

Output:

	{
		error: null,
		data: {
			id: "KARMA_1",
			question: "How do you define karma?",
			answers: [
				"What goes around, comes around.",
				"If you good things, you will be rewarded, but if you do bad things ...",
			]
		}
	}

#### Report the response chosen by the user and get the data for the next question to ask:

Input:

	{
		action: "chosen",
		question_id: "KARMA_1",
		answer: 2,
	}

Output:

	{
		error: null,
		data: {
			id: "KARMA_1_1",
			question: "What is a good example of how karma has worked in your life?",
			answers: [
				"I once littered, and then my face broke out."
				"One time I opened the door for someone and then I found a $20 bill",
			]
		}
	}


## api.md

This defines the API.
It describes the various inputs that request.py will accept and what the responses
will be.


## sebotd.js

This is the webserver.
It handles http requests and delivers files from the html root in "site" directory.
If any requests for "/api/....." are made, python is executed in a separate process to
run request.py, passing a JSON object as input built from the query args of the request.
The response JSON from from request.py is returned directly as the body of the HTTP response.

