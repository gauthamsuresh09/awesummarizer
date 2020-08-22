import os
import speech2text
from summarizer import Summarizer


def convert_mp4_to_audio_and_summarize_transcript(inputdir=os.getcwd()):
    # get current working directory to make code portable to other file systems

    for filename in os.listdir(inputdir):
        actual_filename = filename[:-4]
        if(filename.endswith(".mp4")):
            # is this call blocking?
            os.system('ffmpeg -i {} -acodec pcm_s16le -ar 16000 {}.wav'.format(filename, actual_filename))

            txt2timestamp, timestamp2txt = speech2text.speech_recognize_continuous_from_file(f'{actual_filename}.wav',
                                                                                             f'{inputdir}/secrets.json',
                                                                                             )

            body = [k for k in txt2timestamp]
            body = ' '.join(body)
            raw_list = body.split('.')

            model = Summarizer()
            result = model(body, min_length=60)
            brief = ''.join(result)
            print(brief)
            brief_list = brief.split('.')
            brief_list = [f'{sentence}.' for sentence in brief_list]

            print('original length: ', len(body))
            print('summary length: ', len(brief))
            print('original/summary: ', len(body)/len(brief))
            print('original sentence count: ', len(raw_list))
            print('summary sentence count: ', len(brief_list))

            # azure tells me the timestamp of each utterance, not sentence, so I account for that here
            timestamps = []
            for sentence in brief_list:
                for utterance in txt2timestamp.keys():
                    # utterance can be 1 or more sentences
                    if sentence in utterance:
                        timestamps.append(txt2timestamp[utterance])
            timestamp_and_text = [{"timestamp": time, "text": text} for time, text in zip(timestamps, brief_list)]
            # print(timestamp_and_text)
            return timestamp_and_text
        else:
            return "Error: something went wrong with V1 pipeline"
    pass
