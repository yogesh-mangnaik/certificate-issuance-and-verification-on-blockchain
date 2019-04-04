from flask import Flask, render_template
from flask import request
import hashlib
import json

app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/publish")
def publish():
	return render_template("publish.html")

@app.route("/query")
def hash():
	normalhash = request.args.get('hash')
	x = hashlib.sha256(str(normalhash).encode('utf-8')).hexdigest()
	data = {}
	data['hash'] = x
	json_data = json.dumps(data)
	return json_data

if __name__ == "__main__":
    app.run(debug=True)
