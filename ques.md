# Back-end:
- Translation Caching:
- Language: NodeJS
- Goal: **Develop a web server that exposes an API to translate a text.**

## Task
Create a web server with a RESTful API to translate a text from one language to another.
For the actual translation, you can use an external service like Google Translate or Bing
Translations. The source and target language should be definable via the API.
In addition, we want to cache (store in Database) translations, in order to avoid repeated hits to the translation API. The cache must be persistent!
The server should have an extensible architecture. E.g. We may want to change our caching strategy or switch
out our translation service.

## Bonus Tasks
As a bonus task, implement smart pre-caching. This means we assume that if a user translates a text into
Kannada, he is likely to also translate the same text to Hindi. Therefore we want to not only request Kannada
from the external service but also other languages like Hindi, Tamil, etc. and store it in our cache.
The smart caching should not affect the response time of the translation API.

## Deliverables
1. A functional web server
2. Explanation for the design decisions (in markdown format).
3. Explanation how to setup & run the server (in markdown format).
4. Test cases to test the APIs (using any well-known NodeJs testing frameworks).
5. Quality code with appropriate comments (Feel free to use NodeJs linter libraries)
6. Code should be stored in Github repository & shared.
7. Any secret keys used in the code, can be shared via email with proper instruction saying how & where to use the secret keys.
8. Cache database schema
9. In addition, the text should contain how you evaluated your results and ideas for further improvement.

### Note:
1. All explanation & documentation should be done in markdown format & should be shared using Github repository
2. Use of MySql or similar SQL database is a plus We will evaluate your challenge on the quality of the code, documentation, test cases, linting and performance.  Make sure that it can be executed and installed easily!
