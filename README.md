# sebot


request.py
-----------
	
The script that is run on every request to "/api/".
It takes a JSON object as input and produces a JSON object as output

The output should look like:
	
	{
		error: "text explaining what went wrong, or null if no error",
		data: { /* the response on a normal exit, or optional extra data on error */ }
	}



