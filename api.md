
# API

This defines the API.
It describes the various inputs that request.py will accept and what the responses
will be.

* sq_id = Socratic question ID
* ir_id = Interlocuter response ID
* ID = some sort of unique identifier



## Regular API calls

Regular API calls.
These are the functions that are used when the system is actually engaging in a
socratic dialogue.


### getTopics

Get a list of the available topics.  [ Just return "karma" for the foreseeable future ]

Input:

	{
		action: "getTopics",
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


### getQuestion

Get a question and it's associated responses.

Input:

	{
		action: "getQuestion",
		sq_id: <ID>,
	}

Output:

	{
		error: null,
		data: {
			sq_id: <ID>,		// universally unique tag for this question
			text: "Do you think karma is real?",	// the text of the socratic question to ask
			responses: [	
				// ordered list of responses that the user can choose from.
				// each object has text to display & id for the question to load if chosen.
				{ ir_id: <ID>, text: "Yes.", next_sq_id: <ID> },
				{ ir_id: <ID>, text: "No.", next_sq_id: <ID> },
				{ ir_id: <ID>text: "I'm not sure.", next_sq_id: <ID> },
			]
		}
	}

or:

	{
		error: null,
		data: {
			id: <ID>,
			question: "What is a good example of how karma has worked in your life?",
			responses: [
				{ text: "I once littered, and then my face broke out.", next_sq_id: <ID> },
				{ text: "One time I opened the door for someone and then I found a $20 bill", next_sq_id: <ID> }
			]
		}
	}


### otherResponse

Submit a new, proposed response to a question.
When a user doesn't like any of the responses, they can enter their own for
manual analysis and possible incorporation into the data.

Input:

	{
		action: "otherResponse",
		sq_id: <ID>,
		text: "When I have negative thoughts, bad things happen to me",
	}

Output:

	{
		error: null,
	}


## Admin API calls

These calls are for doing things to the data, like linking responses to questions, 
creating and deleting questions, adding responses, etc.


### createQuestion

Create a new socratic question.

Input:

	{
		action: "createQuestion",
		text: "Are there any other possible explanations besides karma that could account ...",
	}

Output:

	{
		error: null,
		sq_id: <ID>			// the id of the newly created question
	}


### updateQuestion

Modify an existing socratic question.

Input:

	{
		action: "updateQuestion",
		sq_id: <ID>,
		text: "Is there anything else that could explain ..."
	}

Output:

	{
		error: null,
	}


### deleteQuestion

Remove an existing socratic question.
[ Note: links are going to break here ... server should cope somehow ]

Input:

	{
		action: "deleteQuestion",
		sq_id: <ID>,
	}

Output:

	{
		error: null,
	}







