from flask import Flask
from flask import request
import hashlib
import json

app = Flask(__name__)

@app.route("/")
def home():
    return "Hello, World!"

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