from flask import Flask, request, jsonify
import whisper
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
import ffmpeg

app = Flask(__name__)
CORS(app)

# Load the Whisper model once when the server starts
model = whisper.load_model("base")

# Configuration
ALLOWED_EXTENSIONS = {'wav', 'mp3', 'm4a', 'flac', 'webm'}
app.config['UPLOAD_FOLDER'] = './uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024 * 1024 # Max 16 MB file size

# Utility function to check allowed file extensions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/transcribe', methods=['POST'])
def transcribe():
    # Retrieve optional language parameter
    language = request.args.get("language", "en")  # Default to English if no language specified

    if 'audio' not in request.files:
        return jsonify({"error": "No audio file provided."}), 400

    file = request.files['audio']
    if file.filename == '':
        return jsonify({"error": "No file selected for upload."}), 400

    if file and allowed_file(file.filename):
        # Ensure the upload folder exists
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

        # Secure the filename and save the file
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

        try:
            # Save the uploaded file
            file.save(file_path)

            # Convert the file to MP3 if necessary
            mp3_file_path = file_path.rsplit('.', 1)[0] + ".mp3"
            if file_path.split('.')[-1].lower() != 'mp3':
                ffmpeg.input(file_path).output(mp3_file_path, acodec="mp3").run(overwrite_output=True)
            else:
                mp3_file_path = file_path  # No need to convert if already an MP3

            # Transcribe the audio file
            result = model.transcribe(mp3_file_path, language=language)
            transcription = result["text"]

            # Clean up the uploaded and converted files
            if file_path != mp3_file_path:
                os.remove(file_path)
            os.remove(mp3_file_path)

            return jsonify({"transcription": transcription})

        except Exception as e:
            print(f"Error during transcription: {e}")
            return jsonify({"error": "Error during transcription, please try again later."}), 500

    return jsonify({"error": "Invalid file format."}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)
