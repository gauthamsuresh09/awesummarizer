import json
from flask import Flask, request, json
app = Flask(__name__)

import v1_pipeline
from download import download_blob
from pathlib import Path

@app.route("/")
def hello():
    return "Caio!"

@app.route("/stt-summarize-local", methods=['POST'])
def call_ML_pipeline():
    directory = request.json['working_dir']
    file_path = request.json['audiofilepath']
    ret = json.dumps(v1_pipeline.convert_mp4_to_audio_and_summarize_transcript(directory, file_path))
    return ret

bucket_name = "verloop-dev-ml-summarizer"
@app.route("/stt-summarize", methods=['POST'])
def call_stt_summarize_pipeline():
    remote_file = request.json['audiofilepath']
    directory = Path("./data")
    local_file = directory / remote_file
    download_blob(bucket_name, remote_file, local_file)
    ret = json.dumps(v1_pipeline.convert_mp4_to_audio_and_summarize_transcript(directory, remote_file))
    return ret

@app.route("/summarize", methods=['POST'])
def call_summarize_pipeline():
    text = request.json['text']
    ret = json.dumps(v1_pipeline.summarize_transcript(text))
    return ret

if __name__ == "main":
    print("blah")
    app.run()
