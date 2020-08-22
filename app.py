import json
from flask import Flask, request, json
app = Flask(__name__)

import v1_pipeline

@app.route("/")
def hello():
    return "Caio!"

# @app.route("/twoflask", methods=['POST'])
@app.route("/twoflask")
def two():
    # return "2 from flask!"
    directory = request.args['working_dir']
    file_path = request.args['videofilepath']
    # return f'{directory}, {file_path}'

    # data = request.get_data()
    # data = request.json
    # return data
    # json.loads(d)
    # inputdir = data['filepath']
    # inputdir = data.filepath
    # return inputdir
    ret = json.dumps(v1_pipeline.convert_mp4_to_audio_and_summarize_transcript(directory, file_path))
    return ret

