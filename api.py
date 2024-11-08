from flask import Flask, request, jsonify
import whisper
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# Load the Whisper model once when the application starts
model = whisper.load_model("base")

# Define allowed file extensions and max upload size
ALLOWED_EXTENSIONS = {'wav', 'mp3', 'm4a', 'flac'}
app.config['UPLOAD_FOLDER'] = './uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Max 16 MB file

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/transcribe', methods=['POST'])
def transcribe():
    if 'audio' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['audio']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

        # Save the uploaded file
        file.save(file_path)

        # Transcribe audio with Whisper
        try:
            print(f"Transcribing the file {file_path}...")
            result = model.transcribe(file_path)
            transcription = result["text"]

            # Clean up by removing the saved file
            os.remove(file_path)

            return jsonify({"transcription": transcription})
        except Exception as e:
            print(f"Error during transcription: {e}")
            return jsonify({"error": "Error during transcription, please try again later."}), 500
    else:
        return jsonify({"error": "Invalid file format"}), 400

if __name__ == '__main__':
    if not os.path.exists('./uploads'):
        os.makedirs('./uploads')  # Create an upload folder if not exists
    app.run(debug=True, port=5000)
