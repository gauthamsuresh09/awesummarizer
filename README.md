# Welcome to AweSummarizer!
Video demo: https://youtu.be/P_OeXx4os3U
More details: https://devpost.com/software/awesummarizer

## How to spin up Flask microservice for BERT
```
sudo apt-get update
sudo apt-get install libssl1.0.0 libasound2

sudo apt-get install ffmpeg

pip install -r requirements.txt

cd timestamp-generation
FLASK_APP=app.py flask run
```

## How to spin up Expressjs server
```
cd timestamp-generation/backend_express
nodemon app.js
```
