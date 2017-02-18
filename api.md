
# API

This defines the API.
It describes the various inputs that request.py will accept and what the responses
will be.

* SQ = Socratic question
* IR = Interlocutor response
* sq_id = Socratic question ID
* ir_id = Interlocuter response ID
* ID = Some sort of unique identifier



## Regular API calls

Regular API calls.
These are the functions that are used when the system is actually engaging in a
socratic dialogue.


### getTopics

Get a list of the available topics.  [ Just return "karma" for the foreseeable future ]

Input:

	{
		"action": "getTopics"
	}

Output:

	{
		error: null,
		data: [
			{
				topic: "karma",	
				description: "Let's talk about karma!",
				first_sq_id: <ID>
			}
		}
	}


### getSQ

Get a question and it's associated responses.

Input:

	{
		action: "getSQ",
		sq_id: <ID>,
	}

Output:

	{
		error: null,
		data: {
			sq_id: <ID>,		// universally unique tag for this question
			text: "Do you think karma is real?",	// the text of the socratic question to ask
			responses: [	
				// ordered list of responses.
				// each has the text to display and an ID for the next question to load if chosen.
				{ ir_id: <ID>, active: true, text: "Yes.", next_sq_id: <ID> },
				{ ir_id: <ID>, active: true, text: "No.", next_sq_id: <ID> },
				{ ir_id: <ID>, active: true, text: "I'm not sure.", next_sq_id: <ID> },
			]
		}
	}


## Admin API calls

These calls are for doing things to the data, like linking responses to questions, 
creating and deleting questions, adding responses, etc.


### createSQ

Create a new SQ.
The text field is required.

Input:

	{
		action: "createSQ",
		text: "[ text of the SQ ]"		// text of the SQ
	}

Output:

	{
		error: null,
		sq_id: <ID>			// the id of the newly created question
	}


### updateSQ

Modify an existing SQ.

Input:

	{
		action: "updateSQ",
		sq_id: <ID>,				// ID of the SQ to update
		text: "[text of the SQ]",	// new text for the SQ
	}

Output:

	{
		error: null,
	}


### deleteSQ

Input:

	{
		action: "deleteSQ",
		sq_id: <ID>,			// ID of the SQ to delete
	}

Output:

	{
		error: null,
	}


### createIR

Create a new IR.
The text field is required.
If active field is optional; if absent, active will default to false.

Input:

	{
		action: "createIR",
		sq_id: <ID>,				// ID of SQ to add this IR to
		text: "[ text of IR ]",		// of new IR
		active: true | false		// new state of the active flag
	}

Output:

	{
		error: null,
		ir_id: <ID>			// ID of the newly created IR
	}


### updateIR

Modify an existing IR.
If the text field is present, the text of the IR is changed.
If the active field is present, the active flag is changed.

Input:

	{
		action: "updateIR",
		ir_id: <ID>,				// ID of the IR to change
		text: "[text of the IR]",	// new text
		active: true | false		// new state of the active flag
	}

Output:

	{
		error: null,
	}


### deleteIR

Input:

	{
		action: "deleteIR",
		iq_id: <ID>,			// ID of the IR to delete
	}

Output:

	{
		error: null,
	}


