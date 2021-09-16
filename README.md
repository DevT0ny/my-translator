# My Translator
A text translator using Google cloud translation API


# Install & setup

1. Clone this repo using git or downloading zip file.
2. Project assumes that you have already installed latest version of  `nodejs`(> v10) & `mysql`(v8)
3. Navigate to project directory in terminal & run 
  ```
  npm i
  ```

4. If you want run this project under development mode run 
  ```
  npm i -D
  ```

# Configuring environment

1. Copy `.env.example` template file as `.env` and provide values to it.
2. If you have *not* installed dev dependencies (`npm i -D`) then provide `NODE_ENV=production` otherwise `NODE_ENV=development`
3. Google API credentials JSON file will be sent via mail, place the file inside `conifg` directory and set
  `GOOGLE_APPLICATION_CREDENTIALS=./config/<credentials_filename>`


# Quickstart

1. To start server
  ```
  npm start
  ``` 
2. To start testing (*you may have to run twice*)
  ```
  npm test
  ``` 


## consuming API *use this as input for rest client (eg. Insomnia, postman, etc..)*
```
curl --request POST \
  --url http://localhost:7890/translate \
  --header 'content-type: application/json' \
  --data '{
	"text": "Hello world",
	"from": "en",
	"to": "hi"
}'
```

## NOTE
A very first request may take near 20 sec to process, I have tried solve this issue but none worked. 
I believe this is because of Google's OAuth procedure. Once it has cached the OAuth response next 
requests will be completed within <2 sec (even for different text input requests) unless if you restart the server.
