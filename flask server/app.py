from flask import Flask, render_template
from flask import request
import hashlib
import json
import csv
import pandas as pd
import os
from werkzeug import secure_filename
from web3 import Web3
from utils import Utils

from merkle_tree import MerkleTree
from merkle_tree import TreeNode

ALLOWED_EXTENSIONS = set(['csv'])

app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/uploadfile', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
    	f = request.files['file']
    	f.save(secure_filename("student_data.csv"))
    	filedata = pd.read_csv('data.csv')
    	tree = MerkleTree()
    	columns = list(filedata.columns)
    	returndata = ""
    	for i in range(len(filedata)):
    		data = {}
    		for j in range(len(columns)):
    			s = filedata[columns[j]][i]
    			data[columns[j]] = str(s)
    		json_data = json.dumps(data)
    		tree.add(json_data)
    	tree.createTree()

    	# generate the certificate json with hash and merklepath in header
    	# and data in certificate
    	
    	for i in range(len(filedata)):
    		data = {}
    		header = {}
    		header['hash'] = Web3.toHex(tree.getLeafHash(i))
    		path = []
    		for x in range(len(tree.getMerklePath(i))):
    			path.append(Web3.toHex(tree.getMerklePath(i)[x]))
    		header['merkleproof'] = path
    		data['header'] = header
    		certificateData = {}
    		for j in range(len(columns)):
    			s = filedata[columns[j]][i]
    			certificateData[columns[j]] = str(s)
    		data['certificate'] = certificateData
    		json_data = json.dumps(data)
    		print(json_data)
    		Utils.writeToFile(certificateData['ID'] + ".txt", json_data)
    		returndata += json_data + "\n"
    	return returndata
    else:
    	return "No File Selected"

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/upload")
def upload():
	return render_template("upload.html")

@app.route("/publish")
def publish():
	return render_template("publish.html")

@app.route("/query")
def hash():
	normalhash = request.args.get('hash')
	x = hashlib.sha256(str(normalhash).encode('utf-8')).hexdigest()
	data = {}
	data['value'] = x
	json_data = json.dumps(data)
	print(request.environ['REMOTE_ADDR'])
	return json_data

@app.route("/data")
def data():
	read_csv()
	return "Working"

if __name__ == "__main__":
    app.run(debug=True, port=80)
