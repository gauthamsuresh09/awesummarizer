import json
from flask import Flask, request, json
app = Flask(__name__)

import v1_pipeline

@app.route("/")
def hello():
    return "Caio!"

@app.route("/callbert")
def call_ML_pipeline():
    directory = request.args['working_dir']
    file_path = request.args['videofilepath']
    ret = json.dumps(v1_pipeline.convert_mp4_to_audio_and_summarize_transcript(directory, file_path))
    return ret

if __name__ == "main":
    app.run()