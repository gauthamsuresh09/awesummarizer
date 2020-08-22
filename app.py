import v1_pipeline
from flask import Flask, request
app = Flask(__name__)

@app.route("/")
def hello():
    return "Caio!"

@app.route("/twoflask")
def two():
    inputdir = request.args.get('videofilepath')
    return v1_pipeline.convert_mp4_to_audio_and_summarize_transcript(inputdir)
    # return "2 from flask!"

