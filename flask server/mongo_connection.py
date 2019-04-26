from flask import Flask
from flask_pymongo import PyMongo

app = Flask(__name__)
app.config['MONGO_URI'] = "mongodb://localhost:27017"
mongo = PyMongo(app)

@app.route('/')
def home_page():
	print(mongo)
	print(cx)
	return "Success"

if __name__ == "__main__":
    app.run(debug=True, port=100, threaded=True)
