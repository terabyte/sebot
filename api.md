
# API

This defines the API.
It describes the various inputs that request.py will accept and what the responses
will be.

* qst = question
* rsp = response
* qid = question ID
* rid = response ID
* ID = Some sort of unique identifier



## Regular API calls

Regular API calls.
These are the functions that are used when the system is actually engaging in a
dialogue.


### getTopics

Get a list of the available topics.  [ Just return "karma" for the foreseeable future ]

Input:

	{
		"action": "getTopics"
	}

Output:

	{
		"error": null,
		"data": [
			{
				topic: "karma",	
				description: "Let's talk about karma!",
				first_qid: <ID>
			}]
		}
	}


### getQst

Get a question by ID and it's associated responses.

Input:

	{
		"action": "getSQ",
		"qid": <ID>
	}

Output:

	{
		"error": null,
		"data": {
			"qid": <ID>,		                    // universally unique tag for this question
			"text": "Do you think karma is real?",	// the text of the socratic question to ask
			"responses": [	
				// ordered list of responses.
				// each has the text to display and an ID for the next question to load if chosen.
				{ rid: <ID>, active: true, text: "Yes.", next_qid: <ID> },
				{ rid: <ID>, active: true, text: "No.", next_qid: <ID> },
				{ rid: <ID>, active: true, text: "I'm not sure.", next_qid: <ID> },
			]
		}
	}


## Admin API calls

These admin/editor calls for doing things to the data, like linking responses to questions, 
creating and deleting questions, adding responses, etc.


### createQst

Create a new question.
The question will be created with no responses.
The responses have to be added with createRsp.
The text field is required.

Input:

	{
		"action": "createQst",
		"text": "Which god do you believe in?"		// text of the question
	}

Output:

	{
		error: null,
		qid: <ID>			// the ID of the newly created question
	}


### updateQst

Modify an existing question.

Input:

	{
		"action": "updateQst",
		"qid": <ID>,						                    // ID of the question to update
		"text": "Which of the many gods do you believe in?",	// new text for the question
	}

Output:

	{
		error: null,
	}


### deleteQst

Input:

	{
		"action": "deleteQst",
		"qid": <ID>,			// ID of the question to delete
	}

Output:

	{
		error: null,
	}


### createRsp

Create a new response.
The text field is required.
If active field is optional; if absent, active will default to false.

Input:

	{
		"action": "createRsp",
		"qid": <ID>,				// ID of question to add this response to
		"text": "Jesus",			// Text of the new response
		"active": true | false	// New state of the active flag
	}

Output:

	{
		error: null,
		rid: <ID>				// ID of the newly created response
	}


### updateRsp

Modify an existing response.
If the text field is present, the text of the response is updated.
If the active field is present, the active flag is updated.
If the next_qid field is present, the next_qid ID is updated.

Input:

	{
		"action": "updateRsp",
		"rid": <ID>,				// ID of the response to change
		"text": "Vishnu",			// new text
		"active": true | false	// new state of the active flag
		"next_qid": <ID>			// ID of question that this response links to, or null to unlink
	}

Output:

	{
		error: null,
	}


### deleteRsp

Input:

	{
		"action": "deleteRsp",
		"rid": <ID>,			// ID of the response to delete
	}

Output:

	{
		error: null,
	}


