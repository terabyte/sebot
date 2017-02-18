
# API

This defines the API.
It describes the various inputs that request.py will accept and what the responses
will be.

* sq_id = Socratic question ID
* ir_id = Interlocuter response ID

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
				first_sq_id: "KARMA_1"
			}
		}
	}


### getQuestion

Get a question and it's associated responses.

Input:

	{
		action: "getQuestion",
		question_id: "KARMA_1_1",
	}

Output:

	{
		error: null,
		data: {
			id: "KARMA_1",		// universally unique tag for this question
			question: "Do you think karma is real?",	// the text of the socratic question to ask
			answers: [	
				// ordered list of answers that the user can choose from.
				// each object has text to display & id for the question to load if chosen.
				{ text: "Yes.", next_question_id: "KARMA_1_1" },
				{ text: "No.", next_question_id: "KARMA_1_2" },
				{ text: "I'm not sure.", next_question_id: "KARMA_1_3" },
			]
		}
	}

or:

	{
		error: null,
		data: {
			id: "KARMA_1_1",
			question: "What is a good example of how karma has worked in your life?",
			answers: [
				{ text: "I once littered, and then my face broke out.", next_question_id: "KARMA_1_1_1" },
				{ text: "One time I opened the door for someone and then I found a $20 bill", next_question_id: "KARMA_1_1_2" }
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
		question_id: "KARMA_1_1",
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
		question_id: "KARMA_3_2_2_1"			// the id of the newly created question
	}


### updateQuestion

Modify an existing socratic question.

Input:

	{
		action: "updateQuestion",
		question_id: "KARMA_3_2_2_1",
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
		question_id: "KARMA_3_2_2_1",
	}

Output:

	{
		error: null,
	}







