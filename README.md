# How to spin up Flask microservice for BERT
```
sudo apt-get update
sudo apt-get install libssl1.0.0 libasound2

pip install -r requirements.txt

cd timestamp-generation
FLASK_APP=app.py flask run
```

# How to spin up Expressjs server
```
cd timestamp-generation/backend_express
nodemon app.js
```
