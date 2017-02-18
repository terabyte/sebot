
# API

This defines the API.
It describes the various inputs that request.py will accept and what the responses
will be.


### start

Input:

	{
		action: "start",
		topic: "karma",		// The topic to be explored, such as karma, jesus, aliens
	}

Output:

	{
		error: null,
		data: {
			id: "KARMA_1",		// universally unique tag for this question
			question: "Do you think karma is real?",	// the text of the socratic question to ask
			answers: [			// ordered list of answers that the user can choose from
				{ text: "Yes.", next_question_id: "KARMA_1_1" },
				{ text: "No.", next_question_id: "KARMA_1_2" },
				{ text: "I'm not sure.", next_question_id: "KARMA_1_3" },
			]
		}
	}


### responseChosen

Input:

	{
		action: "responseChosen",
		question_id: "KARMA_1",
		choice: 2,
	}

Output:

	{
		error: null,
	}



### getQuestion

Input:

	{
		action: "getQuestion",
		question_id: "KARMA_1_1",
	}

Output:

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

