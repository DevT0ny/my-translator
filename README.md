# My Translator
A text translator using google API

# features
- caches results
- smart pre cache : saves translations of all supported languages ahead of user input.

# install & setup
- clone this repo using git or downloading zip file.
- project assumes that you have already installed nodejs & mysql

# setup
- navigate to project directory in terminal
- run ```npm i```
- if you want run this project under development mode ```npm i -D```

## configuring environment
- copy `.env.example` template file as `.env` and provide values to it.
- if you have not installed dev dependecies (`npm i -D`) then provide `NODE_ENV=production` otherwise `NODE_ENV=development`
- google api credentials json file will be sent via mail, place the file inside `conifg` directory  and set `GOOGLE_APPLICATION_CREDENTIALS=./config/<credentials_filename>`

## staring server
```npm start``` will start web server normal
```npm run watch``` will watch files and reloads server if changes occur

## consuming API *use this as input for rest client (eg. Insomnia, postman, etc..)*
```
curl --request POST \
  --url http://localhost:7890/ \
  --header 'content-type: application/json' \
  --data '{
	"text": "Hello world",
	"from": "en",
	"to": "hi"
}'
```
