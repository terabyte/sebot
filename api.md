
# API

This defines the API.
It describes the various inputs that request.py will accept and what the responses
will be.


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
				first_question_id: "KARMA_1"
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


### admin_LinkResponse



