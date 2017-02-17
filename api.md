
# API

This defines the API.
It describes the various inputs that request.py will accept and what the responses
will be.


### start

Input:

	{
		action: "start",
		topic: *string*,		// The topic to be explored, such as karma, jesus, aliens
	}

Output:

	{
		error: null,
		data: {
			id: *string*,		// universally unique tag for this question
			question: *string*,	// the text of the socratic question to ask
			answers: [			// ordered list of answers that the user can choose from
				*string*,	
				*string*,
				[...]
			]
		}
	}


### chosen

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


