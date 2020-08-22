import requests
from flask import Flask
app = Flask(__name__)

@app.route("/")
def hello():
    return "Caio!"

@app.route("/twoflask")
def two():
    return "2 from flask!"
